import xml.etree.ElementTree as ET
from typing import Dict, Set

from processes.types.graph_element import GraphElement


def parse_bpmn_structure(input_bpmn_file_path: str, verbose: bool = False) -> Dict[str, GraphElement]:
    tree: ET.ElementTree = ET.parse(input_bpmn_file_path)
    root: ET.Element = tree.getroot()

    ns = {k: v for k, v in root.attrib.items() if k.startswith("xmlns")}
    ns["bpmn"] = ns.pop("xmlns:bpmn", "http://www.omg.org/spec/BPMN/20100524/MODEL")

    graph_elements: Dict[str, GraphElement] = {}
    raw_outgoing_flows: Dict[str, Set[str]] = {}
    raw_incoming_flows: Dict[str, Set[str]] = {}

    process = root.find(".//bpmn:process", ns)
    if process is None:
        return graph_elements

    for element in process.findall(".//*"):
        element_id = element.attrib.get("id")
        if not element_id:
            continue

        bpmn_element_type = element.tag.split("}")[1] if "}" in element.tag else element.tag

        if bpmn_element_type == "sequenceFlow":
            source = element.attrib.get("sourceRef")
            target = element.attrib.get("targetRef")
            if source and target:
                raw_outgoing_flows.setdefault(source, set()).add(target)
                raw_incoming_flows.setdefault(target, set()).add(source)
            continue

        if bpmn_element_type == "exclusiveGateway":
            continue

        element_name = element.attrib.get("name", "").title()

        if bpmn_element_type == "task":
            element_name = element_name.split('/')[-1].replace('-', ' ').title()

        graph_elements[element_id] = GraphElement(
            id=element_id,
            name=element_name,
            bpmn_element_type=bpmn_element_type,
            outgoing_flows=set(),
            incoming_flows=set()
        )

    def resolve_transitive_flows(source_id: str, visited: Set[str] = None, direction: str = "outgoing") -> Set[str]:
        if visited is None:
            visited = set()
        if source_id in visited:
            return set()
        visited.add(source_id)

        transitive_targets = set()
        flow_dict = raw_outgoing_flows if direction == "outgoing" else raw_incoming_flows

        for target_id in flow_dict.get(source_id, set()):
            if target_id not in graph_elements:
                transitive_targets.update(resolve_transitive_flows(target_id, visited.copy(), direction))
            else:
                transitive_targets.add(target_id)
        return transitive_targets

    for element_id in graph_elements:
        graph_elements[element_id].outgoing_flows.update(resolve_transitive_flows(element_id, direction="outgoing"))
        graph_elements[element_id].incoming_flows.update(resolve_transitive_flows(element_id, direction="incoming"))

    if verbose:
        for source_id, source_element in graph_elements.items():
            for target_id in source_element.outgoing_flows:
                if target_id in graph_elements:
                    target_element = graph_elements[target_id]
                    print(
                        f"{source_element.name} ({source_id}: {source_element.bpmn_element_type}) -> {target_element.name} ({target_id}: {target_element.bpmn_element_type})")

    return graph_elements