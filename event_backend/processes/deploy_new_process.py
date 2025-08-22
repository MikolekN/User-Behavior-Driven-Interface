from pyzeebe import ZeebeClient, create_camunda_cloud_channel
from pyzeebe.grpc_internals.types import DeployResourceResponse

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
    process = await client.deploy_resource(file_path)
    return process