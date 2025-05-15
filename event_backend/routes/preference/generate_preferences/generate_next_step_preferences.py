from typing import Union, List

import pandas as pd
from pm4py.convert import convert_to_bpmn
from pm4py.discovery import discover_petri_net_heuristics
from pm4py.objects.conversion.log import converter as log_converter
from pm4py.objects.log.exporter.xes import exporter as xes_exporter
from pm4py.vis import save_vis_bpmn as bpmn_save_vis
from pm4py.vis import view_bpmn as bpmn_view

from click_events.click_event import ClickEvent
from click_events.click_event_repository import ClickEventRepository
from hover_events.hover_event import HoverEvent
from hover_events.hover_event_repository import HoverEventRepository
from page_transition_event.page_transition_event import PageTransitionEvent
from page_transition_event.page_transition_event_repository import PageTransitionEventRepository

click_events_repository = ClickEventRepository()
hover_events_repository = HoverEventRepository()
page_transitions_events_repository = PageTransitionEventRepository()

Event = Union[ClickEvent, HoverEvent, PageTransitionEvent]

def generate_next_step_preferences(user_id: str):
    click_events: List[ClickEvent] = click_events_repository.get_next_step_events(user_id) or []
    hover_events: List[HoverEvent] = hover_events_repository.get_next_step_events(user_id) or []
    page_transition_events: List[PageTransitionEvent] = page_transitions_events_repository.get_next_step_events(user_id) or []

    all_events: List[Event] = click_events + hover_events + page_transition_events

    all_events.sort(key=lambda event: event.start_timestamp)

    df = pd.DataFrame(all_events)
    df["case:concept:name"] = df["case_id"]
    df["concept:name"] = df["activity"]
    df["time:timestamp"] = df["start_timestamp"]
    df = df.sort_values(by=["case:concept:name", "time:timestamp"]),

    log = log_converter.apply(df, variant=log_converter.Variants.TO_EVENT_LOG)
    log = log[0]

    xes_exporter.apply(log, "events.xes")

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

    bpmn_view(bpmn_graph)
    bpmn_save_vis(bpmn_graph, "model.png")
