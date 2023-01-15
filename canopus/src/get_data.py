def scrape_conditions_and_resources(table):
    '''
    Get data from resource types and condition keys tables (passed as Beautiful Soup)
    => { headers: [], rows: [] } 
    '''

    table_rows = table.find_all('tr')

    data = {}
    data['rows'] = []
    headers_list = []

    for row in table_rows:
        if row.find('th'):
            headers_list = row.text.lower().replace(' ', '_').split() # create list of snake_case headers
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


def scrape_actions(table):
    '''
    Get data from actions table (passed as Beautiful Soup)
    => { headers: [], rows: [] } 
    '''

    table_rows = table.find_all('tr')

    data = {}
    data['rows'] = []
    headers_list = []

    for row in table_rows:
        if row.find('th'):
            headers_list = row.text.lower().replace(' ', '_').split() # create list of snake_case headers
            data['headers'] = headers_list
            continue
        data_obj = {}
        data_blocks = row.find_all('td')
        for i in enumerate(data_blocks): # i = (ind, val) ... i[0] = ind, i[1] = val
            index = i[0]
            value = i[1].text.lstrip().rstrip() # strip leading and trailing whitespaces
            # TODO:
            # build
            # build
        data['rows'].append(data_obj)

    return data