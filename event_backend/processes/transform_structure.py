from copy import deepcopy
from typing import Dict

from processes.helpers.generate_id import generate_id
from processes.types.graph_element import GraphElement


def transform_structure(graph_elements: Dict[str, GraphElement], verbose: bool = False) -> Dict[str, GraphElement]:
    transformed_elements = deepcopy(graph_elements)

    def add_flow(source_id: str, target_id: str, elements: Dict[str, GraphElement]):
        elements[source_id].outgoing_flows.add(target_id)
        elements[target_id].incoming_flows.add(source_id)

    def remove_flow(source_id: str, target_id: str, elements: Dict[str, GraphElement]):
        if target_id in elements[source_id].outgoing_flows:
            elements[source_id].outgoing_flows.remove(target_id)
            elements[target_id].incoming_flows.remove(source_id)

    end_event_id = next(
        eid for eid, elem in transformed_elements.items() if elem.bpmn_element_type == "endEvent"
    )

    exclusive_gateway_id = generate_id("Gateway")
    service_task_id = generate_id("Activity")

    exclusive_gateway = GraphElement(
        id=exclusive_gateway_id,
        name="Join",
        bpmn_element_type="exclusiveGateway",
        outgoing_flows=set(),
        incoming_flows=set()
    )

    service_task = GraphElement(
        id=service_task_id,
        name="Restart an instance",
        bpmn_element_type="serviceTask",
        outgoing_flows=set(),
        incoming_flows=set()
    )

    transformed_elements[exclusive_gateway_id] = exclusive_gateway
    transformed_elements[service_task_id] = service_task

    add_flow(exclusive_gateway_id, service_task_id, transformed_elements)
    add_flow(service_task_id, end_event_id, transformed_elements)

    original_ids = list(graph_elements.keys())
    for source_id in original_ids:
        source_elem = transformed_elements[source_id]

        if end_event_id in source_elem.outgoing_flows:
            remove_flow(source_id, end_event_id, transformed_elements)
            add_flow(source_id, exclusive_gateway_id, transformed_elements)

        if not source_elem.outgoing_flows or source_elem.bpmn_element_type == "endEvent":
            continue

        if len(source_elem.outgoing_flows) == 1 and list(source_elem.outgoing_flows)[0] == exclusive_gateway_id:
            continue

        event_based_gateway_id = generate_id("Gateway")
        event_based_gateway_name = f"{source_elem.name} Decision"
        event_based_gateway = GraphElement(
            id=event_based_gateway_id,
            name=event_based_gateway_name,
            bpmn_element_type="eventBasedGateway",
            outgoing_flows=set(),
            incoming_flows=set()
        )
        transformed_elements[event_based_gateway_id] = event_based_gateway

        original_flows = source_elem.outgoing_flows.copy()
        for target_id in original_flows:
            remove_flow(source_id, target_id, transformed_elements)
        add_flow(source_id, event_based_gateway_id, transformed_elements)

        for target_id in original_flows:
            catch_id = generate_id("Event")
            if target_id == exclusive_gateway_id:
                catch_event_name = "Navigate Other"
            else:
                target_name = transformed_elements[target_id].name if target_id in transformed_elements else ""
                catch_event_name = f"Navigate {target_name}"
            catch_event = GraphElement(
                id=catch_id,
                name=catch_event_name,
                bpmn_element_type="intermediateCatchEvent",
                outgoing_flows=set(),
                incoming_flows=set()
            )
            transformed_elements[catch_id] = catch_event
            add_flow(catch_id, target_id, transformed_elements)
            add_flow(event_based_gateway_id, catch_id, transformed_elements)

        if exclusive_gateway_id not in original_flows:
            catch_id = generate_id("Event")
            catch_event_name = f"Navigate Other"
            catch_event = GraphElement(
                id=catch_id,
                name=catch_event_name,
                bpmn_element_type="intermediateCatchEvent",
                outgoing_flows=set(),
                incoming_flows=set()
            )
            transformed_elements[catch_id] = catch_event
            add_flow(catch_id, exclusive_gateway_id, transformed_elements)
            add_flow(event_based_gateway_id, catch_id, transformed_elements)

    if verbose:
        for source_id, source_element in transformed_elements.items():
            for target_id in source_element.outgoing_flows:
                if target_id in transformed_elements:
                    target_element = transformed_elements[target_id]
                    print(
                        f"{source_element.name} ({source_id}: {source_element.bpmn_element_type}) -> "
                        f"{target_element.name} ({target_id}: {target_element.bpmn_element_type})"
                    )

    return transformed_elements
