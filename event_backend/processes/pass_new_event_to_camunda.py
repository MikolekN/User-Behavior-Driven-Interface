import asyncio
import time
import xml.etree.ElementTree as ET

import bson
from shared import Database

from config import CLIENT_SECRET, CLIENT_ID, OPERATE_AUDIENCE, CLUSTER_ID
from models.get_model import get_model
from processes.helpers.get_access_token import get_access_token
from processes.helpers.get_active_process_instances import get_active_process_instances
from processes.helpers.get_flownodes_instances import get_flownodes_instances
from processes.helpers.get_process_definition_xml import get_process_definition_xml
from processes.publish_message import publish_message
from processes.run_process_instance import create_process_instance


def pass_new_event_to_camunda(next_page, user_id):
    Database.initialise()
    asyncio.run(_pass_new_event_to_camunda(next_page, user_id))


async def _pass_new_event_to_camunda(next_page: str, user_id: str) -> None:
    # RETRIEVE THE MODEL DATA FROM DATABASE
    model = get_model(bson.ObjectId(user_id))
    if model is None or model.model_id is None:
        # IF NO MODEL IS ASSOCIATED WITH THE USER - SKIP
        print("\033[33mNo model associated with the user found in the database.\033[0m")
        return
    model_id = model.model_id

    # RETRIEVE THE ACTIVE PROCESS INSTANCES
    operate_token = get_access_token(CLIENT_ID, CLIENT_SECRET, OPERATE_AUDIENCE)
    instances: list = get_active_process_instances(model_id, operate_token, CLUSTER_ID)
    if not instances:
        # IF NO CURRENTLY RUNNING PROCESSES ARE ASSOCIATED WITH THE USER
        print(
            "\033[33mNo active process instances associated with the user found - attempting to start an instance.\033[0m")

        process_instance_definition = await create_process_instance(user_id)
        if not process_instance_definition:
            print("\033[31mProcess instance not created.\033[0m")
            return

        model_id = process_instance_definition.bpmn_process_id
        time.sleep(5)
        for i in range(15):
            instances: list = get_active_process_instances(model_id, operate_token, CLUSTER_ID)
            if instances:
                break
            time.sleep(1)

        if not instances:
            print("\033[31mNo process instances associated with the process definition.\033[0m")
            return
    instance = instances[0]
    process_instance_key = instance['key']

    # RETRIEVE THE CURRENTLY ACTIVE GATEWAY
    gateways = get_flownodes_instances(process_instance_key, operate_token, CLUSTER_ID)
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
        return
    outgoing_flows = gateway.findall("bpmn:outgoing", ns)
    flow_ids = [flow.text for flow in outgoing_flows]
    urls = []
    map_url_to_name = {}
    for flow_id in flow_ids:
        sequence_flow = root.find(f".//bpmn:sequenceFlow[@id='{flow_id}']", ns)
        if sequence_flow is None:
            continue

        target_ref = sequence_flow.get('targetRef')

        target_event = root.find(f".//bpmn:intermediateCatchEvent[@id='{target_ref}']", ns)
        if target_event is None:
            continue

        event_name = target_event.get('name', '')

        properties = target_event.find('.//zeebe:properties/zeebe:property[@name="url"]', ns)
        url = properties.get('value', 'other') if properties is not None else 'other'

        urls.append(url)
        map_url_to_name[url] = event_name

    if next_page in urls:
        message = map_url_to_name[next_page]
    else:
        message = "Navigate Other"

    await publish_message(message=message, correlation_key=user_id, cluster_id=CLUSTER_ID, client_id=CLIENT_ID,
                          client_secret=CLIENT_SECRET)
