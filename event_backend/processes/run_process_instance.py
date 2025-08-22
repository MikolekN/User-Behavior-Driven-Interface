from typing import Optional

import bson
from pyzeebe import ZeebeClient, create_camunda_cloud_channel
from pyzeebe.errors import ProcessDefinitionNotFoundError
from pyzeebe.grpc_internals.types import CreateProcessInstanceResponse, CancelProcessInstanceResponse

from config import CLIENT_ID, CLIENT_SECRET, CLUSTER_ID, OPERATE_AUDIENCE
from models.get_model import get_model
from models.update_model import update_model
from processes.helpers.get_access_token import get_access_token
from processes.helpers.get_active_process_instances import get_active_process_instances
from processes.types.process_instance_definition import ProcessInstanceDefinition


async def create_process_instance(user_id: str) -> Optional[ProcessInstanceDefinition]:
    # RETRIEVE THE MODEL DATA FROM DATABASE
    model = get_model(bson.ObjectId(user_id))
    if model is None:
        # IF NO MODEL IS ASSOCIATED WITH THE USER - SKIP
        print("\033[33mNo model associated with the user found in the database.\033[0m")
        return None

    model_id = model.new_model_id or model.model_id
    if model_id is None:
        print("\033[33mNo model associated with the user found in the database.\033[0m")
        return None

    if (
            model.model_id is None
            or (model.model_id != model.new_model_id and model.new_model_id is not None)
    ):
        update_model(str(model.id), {"model_id": model.new_model_id})

    if model.model_id is not None:
        # CANCEL RUNNING PROCESS INSTANCES
        operate_token = get_access_token(CLIENT_ID, CLIENT_SECRET, OPERATE_AUDIENCE)
        instances: list = get_active_process_instances(model.model_id, operate_token, CLUSTER_ID)
        for instance in instances:
            await cancel_process_instance(instance['key'])

    process_instance_definition = await run_process_instance(model_id, user_id)
    return process_instance_definition

async def cancel_process_instance(process_instance_key: int) -> None:
    # CONNECT TO CAMUNDA
    channel = create_camunda_cloud_channel(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        cluster_id=CLUSTER_ID,
        region='bru-2',
        authorization_server="https://login.cloud.camunda.io/oauth/token",
        audience="zeebe.camunda.io"
    )
    client = ZeebeClient(grpc_channel=channel)

    # START/RUN THE PROCESS
    response: CancelProcessInstanceResponse = await client.cancel_process_instance(process_instance_key)

async def run_process_instance(model_id: str, user_id: str) -> Optional[ProcessInstanceDefinition]:
    try:
        # CONNECT TO CAMUNDA
        channel = create_camunda_cloud_channel(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            cluster_id=CLUSTER_ID,
            region='bru-2',
            authorization_server="https://login.cloud.camunda.io/oauth/token",
            audience="zeebe.camunda.io"
        )
        client = ZeebeClient(grpc_channel=channel)

        # START/RUN THE PROCESS
        response: CreateProcessInstanceResponse = await client.run_process(
            bpmn_process_id=model_id,
            variables={"userId": user_id}
        )

    except ProcessDefinitionNotFoundError:
        print("\033[33mProcess definition not found.\033[0m")
        return None

    process_instance = ProcessInstanceDefinition(response.bpmn_process_id, response.process_definition_key, response.process_instance_key)
    return process_instance
