from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class Step:
    bpmn_element_id: str
    message: str
    visits: int
    url: str
    previous_url: str
    probability: str

    def to_dict(self) -> Dict[str, Any]:
        step_dict = asdict(self)
        return step_dict