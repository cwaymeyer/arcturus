import boto3

dynamo_db = boto3.resource('dynamodb')
table = dynamo_db.Table('Canopus_Data') # TODO: put table name in env variables


def put_single_item_in_dynamo(data):
    '''add a single item to DynamoDB'''

    try:
        table.put_item(
            Item=data
        )
    except Exception as err:
        print(err)


def upload_iam_data_to_dynamo(service_data):
    '''upload scraped data to DynamoDB'''

    def batch_put_item_in_dynamo(data):
        '''add a single item to DynamoDB with batch writer'''
        try:
            batch.put_item(
                Item=data
            )
        except Exception as err:
            print(err)

    for service in service_data:
        with table.batch_writer(overwrite_by_pkeys=['service', 'sk']) as batch:
            print('💽 uploading ', service['service_name'])
            print('SERVICE:', service)
            name = service['service_name'].lower().replace(' ', '_')
            prefix = service['service_prefix']

            for item in service['actions']['rows']:
                print("ITEM:", item)
                action = item['actions']
                access = item['access_level']

                action_item_data = {
                    'service': name,
                    'sk': 'ACTION',
                    'prefix': prefix,
                    'access': access,
                    'action': action,
                    'description': item['description'],
                    'permission_only': item['permission_only_action'],
                    'resource_types': item['resource_types'],
                    'condition_keys': item['condition_keys'],
                    'dependent_actions': item['dependent_actions']
                }

                batch_put_item_in_dynamo(action_item_data)

            if service['resource_types']:
                for item in service['resource_types']['rows']:
                    resource = item['resource_types']

                    resource_item_data = {
                        'service': name,
                        'sk': 'RESOURCE',
                        'resource': resource,
                        'arn': item['arn'],
                        'condition_keys': item['condition_keys']
                    }

                    batch_put_item_in_dynamo(resource_item_data)

            if service['condition_keys']:
                for item in service['condition_keys']['rows']:
                    condition = item['condition_keys'].upper()

                    condition_item_data = {
                        'service': name,
                        'sk': 'CONDITION',
                        'condition': condition,
                        'description': item['description'],
                        'type': item['type']
                    }

                    batch_put_item_in_dynamo(condition_item_data)