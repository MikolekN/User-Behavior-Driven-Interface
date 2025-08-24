from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class NextStep:
    bpmn_element_id: str
    message: str
    visits: int
    next_page: str
    page: str
    probability: str

    def to_dict(self) -> Dict[str, Any]:
        step_dict = asdict(self)
        return step_dict
