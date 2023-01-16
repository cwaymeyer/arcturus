def scrape_conditions_and_resources(table):
    '''
    Get data from resource types and condition keys tables (passed as Beautiful Soup)
    => { headers: [], rows: [] } 
    '''

    table_rows = table.find_all('tr')

    data = {}
    data['rows'] = []

    for row in table_rows:
        if row.find('th'):
            stripped_headers = row.text.replace('(*required)', '')
            headers_list = stripped_headers.lower().replace(' ', '_').split() # create list of snake_case headers
            data['headers'] = headers_list
            continue

        data_obj = {}

        data_blocks = row.find_all('td')
        for i in enumerate(data_blocks): # i = (ind, val) ... i[0] = ind, i[1] = val
            index = i[0]
            value = i[1].text.lstrip().rstrip() # strip leading and trailing whitespaces
            heads = data['headers']
            data_obj[data['headers'][index]] = value # assign value to header label key
        data['rows'].append(data_obj)

    return data


def scrape_actions(table, resource_types = False, condition_keys = False):
    '''
    Get data from actions table (passed as Beautiful Soup)
    => { headers: [], rows: [] } 
    '''

    table_rows = table.find_all('tr')

    data = {}
    data['rows'] = []

    def place_value_in_object(val):
        '''Place value as resource type, condition key, or dependent action'''

        if val in resource_types:
            resource_obj = { 'type': val, 'required': 'false'}
            data_obj['resource_types'].append(resource_obj)
        elif val[:-1] in resource_types and val[-1:] == '*':
            resource_obj = { 'type': val[:-1], 'required': 'true'}
            data_obj['resource_types'].append(resource_obj)
        elif val in condition_keys:
            data_obj['condition_keys'].append(val)
        elif val:
            data_obj['dependent_actions'].append(val)

    for row in table_rows:
        if row.find('th'):
            stripped_headers = row.text.replace('(*required)', '')
            headers_list = stripped_headers.lower().replace(' ', '_').split() # create list of snake_case headers
            data['headers'] = headers_list
            continue

        initial_state = {
                'resource_types': [],
                'condition_keys': [],
                'dependent_actions': [],
                'permission_only_action': 'false'
            }

        if (not 'data_obj' in locals()): # if data_obj does not exist
            data_obj = initial_state

        data_blocks = row.find_all('td')
        for block in data_blocks:
            value = block.text.lstrip().rstrip()
            if block.find('a', attrs={'id' : True }): # new row block includes an ID
                if 'actions' in data_obj: # if action has been filled (not first row)
                    data['rows'].append(data_obj)
                    data_obj = initial_state
                curr_row = 0

            if curr_row < 3: # first three cells are predictable
                if '[permission only]' in value:
                    value = value[:-18]
                    data_obj['permission_only_action'] = 'true'
                data_obj[data['headers'][curr_row]] = value
            else: # remaining cells are unpredictable
                if '\n' in value:
                    value = [i for i in value.split('\n') if i] # split mutlivalue blocks into array
                if type(value) == str:
                    place_value_in_object(value)
                if type(value) == list:
                    for val in value:
                        place_value_in_object(val)
            curr_row += 1
    return data