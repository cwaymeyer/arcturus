from bs4 import BeautifulSoup
import requests
from get_services import get_aws_services
from get_data import scrape_conditions_and_resources

all_services = get_aws_services()

def get_html(url):
    '''Get webpage HTML'''

    response = requests.get(url)
    return response.text

# for service in all_services:

link = all_services[0]['link']

service_html = get_html(link)
service_soup = BeautifulSoup(service_html, 'html.parser')

tables = service_soup.find_all('table')

# condition keys
if tables[2]:
    conditions_table = tables[2]
    condition_keys_data = scrape_conditions_and_resources(conditions_table)

# resource types
if tables[1]:
    resources_table = tables[1]
    resource_types_data = scrape_conditions_and_resources(resources_table)

# actions
actions_table = tables[0]
actions_data = {}

print(condition_keys_data)
print(resource_types_data)