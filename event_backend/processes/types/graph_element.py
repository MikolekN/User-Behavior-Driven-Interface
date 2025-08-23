from dataclasses import dataclass
from typing import Set


@dataclass
class GraphElement:
    id: str
    name: str
    bpmn_element_type: str
    outgoing_flows: Set[str]
    incoming_flows: Set[str]
