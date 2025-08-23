import xml.etree.ElementTree as ET
from typing import Optional

import bson

from config import CLIENT_ID, CLIENT_SECRET, OPERATE_AUDIENCE, CLUSTER_ID
from models.get_model import get_model
from processes.helpers.get_access_token import get_access_token
from processes.helpers.get_active_process_instances import get_active_process_instances
from processes.helpers.get_flownodes_instances import get_flownodes_instances
from processes.helpers.get_process_definition_xml import get_process_definition_xml
from processes.types.next_step import NextStep


def generate_next_step(user_id: str) -> Optional[NextStep]:
    # RETRIEVE THE MODEL DATA FROM DATABASE
    model = get_model(bson.ObjectId(user_id))
    if model is None or model.model_id is None:
        # IF NO MODEL IS ASSOCIATED WITH THE USER - SKIP
        print("No model associated with the user found in the database.")
        return None
    model_id = model.model_id

    # RETRIEVE THE ACTIVE PROCESS INSTANCES
    operate_token = get_access_token(CLIENT_ID, CLIENT_SECRET, OPERATE_AUDIENCE)
    instances: list = get_active_process_instances(model_id, operate_token, CLUSTER_ID)
    if not instances:
        # IF NO CURRENTLY RUNNING PROCESSES ARE ASSOCIATED WITH THE USER - SKIP
        print("No process instances associated with the process definition.")
        return None
    instance = instances[0]
    process_instance_key = instance['key']

    # RETRIEVE THE CURRENTLY ACTIVE GATEWAY
    gateways = get_flownodes_instances(process_instance_key, operate_token, CLUSTER_ID)
    if not gateways:
        # IF THERE IS NO ACTIVE ELEMENT OR THE ACTIVE ELEMENT IS NOT A GATE
        print("Wrong or no element to get next step from.")
        return None
    current_gateway = gateways[0]
    current_gateway_id = current_gateway['flowNodeId']

    # RETRIEVE THE PROCESS XML
    xml = get_process_definition_xml(model_id, operate_token, CLUSTER_ID)

    # RETRIEVE THE POSSIBLE MESSAGES ACCEPTED BY THE GATEWAY
    root = ET.fromstring(xml)
    ns = {
        'bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
        'zeebe': 'http://camunda.org/schema/zeebe/1.0'
    }
    gateway = root.find(f".//bpmn:eventBasedGateway[@id='{current_gateway_id}']", ns)
    if gateway is None:
        # IF THE GATEWAY CANNOT BE FOUND MEANS THERE IS AN ERROR, SO WE TERMINATE
        return None
    outgoing_flows = gateway.findall("bpmn:outgoing", ns)
    flow_ids = [flow.text for flow in outgoing_flows]
    steps = []
    for flow_id in flow_ids:
        sequence_flow = root.find(f".//bpmn:sequenceFlow[@id='{flow_id}']", ns)
        if sequence_flow is None:
            continue

        target_ref = sequence_flow.get('targetRef')

        target_event = root.find(f".//bpmn:intermediateCatchEvent[@id='{target_ref}']", ns)
        if target_event is None:
            continue

        event_name = target_event.get('name', '')

        properties = target_event.find('.//zeebe:properties/zeebe:property[@name="visits"]', ns)
        visits = properties.get('value', '0') if properties is not None else '0'

        properties = target_event.find('.//zeebe:properties/zeebe:property[@name="url"]', ns)
        url = properties.get('value', 'other') if properties is not None else 'other'

        properties = target_event.find('.//zeebe:properties/zeebe:property[@name="previous_url"]', ns)
        previous_url = properties.get('value', 'other') if properties is not None else 'other'

        steps.append({
            'message_event_id': target_ref,
            'message_event_name': event_name,
            'visits': int(visits),
            'url': url,
            'previous_url': previous_url
        })

    sum_visits = sum(step['visits'] for step in steps)

    filtered_steps = [
        step for step in steps
        if step['url'] != 'other' and step['message_event_name'] != 'Navigate Other'
    ]

    next_step_data = max(filtered_steps, key=lambda x: x['visits'], default=None)
    next_step = NextStep(
        bpmn_element_id=next_step_data['message_event_id'],
        message=next_step_data['message_event_name'],
        visits=next_step_data['visits'],
        next_page=next_step_data['url'],
        page=next_step_data['previous_url'],
        probability=f"{(next_step_data['visits'] / sum_visits) * 100:.2f}%",
    )

    return next_step
