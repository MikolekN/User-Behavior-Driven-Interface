from dataclasses import dataclass


@dataclass
class ProcessInstanceDefinition:
    bpmn_process_id: str
    process_definition_key: int
    process_instance_key: int