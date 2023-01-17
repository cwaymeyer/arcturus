import boto3

dynamo_db = boto3.resource('dynamo_db')
table = dynamo_db.Table(table_name)


def batch_upload_to_dynamo(service_data):
    '''upload data to Dynamo DB'''

    with table.batch_writer() as batch:
        for service in service_data:
            name = service.name
            # for item in service:
            item_data =
            try:
                batch.put_item(
                    Item=row
                )
            except Exception as err:
                print(err)