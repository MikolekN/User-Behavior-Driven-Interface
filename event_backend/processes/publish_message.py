from pyzeebe import ZeebeClient, create_camunda_cloud_channel


async def publish_message(message:str, correlation_key: str, cluster_id: str, client_id: str, client_secret: str) -> None:
    # channel = create_oauth2_client_credentials_channel(
    #     grpc_address=f"grpcs://{cluster_id}.bru-2.zeebe.camunda.io",
    #     client_id=client_id,
    #     client_secret=client_secret,
    #     authorization_server="https://login.cloud.camunda.io/oauth/token",
    #     audience="zeebe.camunda.io"
    # )
    channel = create_camunda_cloud_channel(
        client_id=client_id,
        client_secret=client_secret,
        cluster_id=cluster_id,
        region='bru-2',
        authorization_server="https://login.cloud.camunda.io/oauth/token",
        audience="zeebe.camunda.io"
    )
    client = ZeebeClient(grpc_channel=channel)
    await client.publish_message(
        name=message,
        correlation_key=correlation_key
    )
