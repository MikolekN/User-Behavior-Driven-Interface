from pyzeebe import ZeebeClient, create_camunda_cloud_channel
from pyzeebe.grpc_internals.types import DeployResourceResponse
from pyzeebe.errors.zeebe_errors import ZeebeGatewayUnavailableError
from pyzeebe.errors.process_errors import ProcessInvalidError

from config import CLIENT_ID, CLIENT_SECRET, CLUSTER_ID


async def deploy_new_process(file_path: str) -> DeployResourceResponse:
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

    # DEPLOY THE PROCESS
    try:
        process = await client.deploy_resource(file_path)
        return process
    except ZeebeGatewayUnavailableError:
        print("pyzeebe.errors.zeebe_errors.ZeebeGatewayUnavailableError")
    except ProcessInvalidError:
        print("pyzeebe.errors.process_errors.ProcessInvalidError")
