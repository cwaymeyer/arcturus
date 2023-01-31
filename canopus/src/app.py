from bs4 import BeautifulSoup
import requests
from get_services import get_aws_services
from get_data import scrape_conditions_and_resources, scrape_actions
from upload_data import upload_iam_data_to_dynamo, put_single_item_in_dynamo


def get_html(url):
    '''Get webpage HTML'''

    response = requests.get(url)
    return response.text


def handler(event, context):
    '''🛰️ Get tabled IAM data for all AWS services 🛰️'''

    all_services = get_aws_services()
    data = []

    for service in all_services:
        print('🏃‍♂️ ', service['name'])

        # put service name in dynamo under 'SERVICE_NAMES' pk for quick access
        service_name = {
            'service': 'SERVICE_NAMES',
            'sk': service['name'],
        }

        put_single_item_in_dynamo(service_name)

        # get service link to scrape actions, resources and conditions
        link = service['link']

        service_html = get_html(link)
        service_soup = BeautifulSoup(service_html, 'html.parser')

        service_prefix = service_soup.find('p').find('code').text

        tables = service_soup.find_all('table')
        table_identification = []
        for table in tables: # find table names to determine what to scrape below
            table_head = table.find('th').text
            table_identification.append(table_head)

        if 'Condition keys' in table_identification:
            conditions_table = tables[table_identification.index('Condition keys')]
            condition_keys_data = scrape_conditions_and_resources(conditions_table)
            condition_keys = [ value[condition_keys_data['headers'][0]] for value in condition_keys_data['rows'] ] # extract resource types list

        if 'Resource types' in table_identification:
            resources_table = tables[table_identification.index('Resource types')]
            resource_types_data = scrape_conditions_and_resources(resources_table)
            resource_types = [ value[resource_types_data['headers'][0]] for value in resource_types_data['rows'] ] # extract condition keys list

        # actions table always exists
        actions_table = tables[0]
        actions_data = scrape_actions(actions_table, resource_types, condition_keys)

        obj = { 
            'service_name': service['name'], 
            'service_prefix': service_prefix, 
            'actions': actions_data
        }

        if ('condition_keys_data' in locals()):
            obj['condition_keys'] = condition_keys_data
        if ('resource_types_data' in locals()):
            obj['resource_types'] = resource_types_data
        data.append(obj)

    upload_iam_data_to_dynamo(data)

    return data