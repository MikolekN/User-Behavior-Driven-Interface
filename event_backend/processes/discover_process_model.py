import asyncio
import os
from typing import List

import bson
import pandas as pd
from pm4py.convert import convert_to_bpmn
from pm4py.discovery import discover_petri_net_heuristics
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter
from pm4py.vis import save_vis_bpmn as bpmn_save_vis
from pm4py.write import write_bpmn
from pyzeebe.grpc_internals.types import DeployResourceResponse
from shared import Database

from models.get_model import get_model
from models.model import Model
from models.model_repository import ModelRepository
from models.update_model import update_model
from page_transition_event.page_transition_event import PageTransitionEvent
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository
from processes.deploy_new_process import deploy_new_process
from processes.generate_transformed_bpmn import generate_transformed_bpmn
from processes.parse_bpmn_structure import parse_bpmn_structure
from processes.transform_structure import transform_structure

model_repository = ModelRepository()


def discover_process_model(user_id: str):
    Database.initialise()
    asyncio.run(_discover_process_model(user_id))


async def _discover_process_model(user_id: str) -> None:
    bpmn_file_path = f"base_models/model_{user_id}"
    output_bpmn_file_path = f"transformed_models/transformed_model_{user_id}.bpmn"

    os.makedirs(os.path.dirname(bpmn_file_path), exist_ok=True)
    os.makedirs(os.path.dirname(output_bpmn_file_path), exist_ok=True)

    # GATHER EVENTS
    page_transitions_events_repository = PageTransitionEventRepository()
    page_transition_events: List[PageTransitionEvent] = page_transitions_events_repository.get_next_step_events(
        user_id) or []
    page_transition_events.sort(key=lambda event: event.start_timestamp)
    if not page_transition_events:
        return

    # SUM THE NUMBERS OF TRANSITIONS BETWEEN PAGES
    visits_map = {}
    for event in page_transition_events:
        if event.page not in visits_map:
            visits_map[event.page] = {}
        visits_map[event.page][event.next_page] = visits_map[event.page].get(event.next_page, 0) + 1

    # DISCOVER THE PROCESS
    df = pd.DataFrame(page_transition_events)
    df["case:concept:name"] = df["case_id"]
    df["concept:name"] = df["activity"]
    df["time:timestamp"] = df["start_timestamp"]
    df = df.sort_values(by=["case:concept:name", "time:timestamp"]),

    log = log_converter.apply(df, variant=log_converter.Variants.TO_EVENT_LOG)
    log = log[0]

    xes_exporter.apply(log, f"eventlog_{user_id}.xes")

    net, im, fm = discover_petri_net_heuristics(
        log=log,
        dependency_threshold=0.5,
        and_threshold=0.65,
        loop_two_threshold=0.5,
        activity_key="concept:name",
        timestamp_key="time:timestamp",
        case_id_key="case:concept:name"
    )

    bpmn_graph = convert_to_bpmn(net, im, fm)
    write_bpmn(bpmn_graph, bpmn_file_path)
    bpmn_save_vis(bpmn_graph, f"{bpmn_file_path}.png")

    # PREPROCESS MODEL
    bpmn_file_path = ''.join([bpmn_file_path, '.bpmn'])
    graph_elements = parse_bpmn_structure(bpmn_file_path, verbose=False)
    transformed_map = transform_structure(graph_elements, verbose=False)
    generate_transformed_bpmn(transformed_map, user_id, output_bpmn_file_path, visits_map, verbose=False)

    # DEPLOY THE PROCESS TO CAMUNDA
    deployed_resource: DeployResourceResponse = await deploy_new_process(output_bpmn_file_path)
    model_id: str = deployed_resource.deployments[0].bpmn_process_id

    # RETRIEVE THE MODEL DATA FROM DATABASE
    model = get_model(bson.ObjectId(user_id))
    if model is None:
        # SAVE THE MODEL ID IN THE DATABASE
        model: Model = Model(
            model_id=model_id,
            new_model_id=None,
            user_id=bson.ObjectId(user_id)
        )
        model_repository.insert(model)
        return
    update_model(str(model.id), {"new_model_id": model_id})
