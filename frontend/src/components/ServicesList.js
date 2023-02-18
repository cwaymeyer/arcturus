import { Box, Button, TextInput, Spinner } from "grommet";
import { Api } from "../library/Api";
import { FormSearch } from "grommet-icons";
import { createWildcardSuggestions } from "../library/utils";

const ServicesList = ({
  servicesData,
  displayedServices,
  setDisplayedServices,
  setActionsData,
  setCurrentAccordion,
  setStagedStatement,
}) => {
  const handleServiceSearch = (searchValue) => {
    const filteredServices = servicesData.filter((service) => {
      const serviceName = service.sk.S;
      const acronym = serviceName.match(/[A-Z]/g).join("").toLowerCase();
      return (
        serviceName.toLowerCase().includes(searchValue) ||
        acronym.includes(searchValue)
      );
    });
    setDisplayedServices(filteredServices);
  };

  const handleServiceSelection = async (service) => {
    console.log("💡", service);
    const serviceSnakeValue = service.toLowerCase().split(" ").join("_");

    setStagedStatement((existingValues) => ({
      ...existingValues,
      serviceName: service,
      serviceValue: serviceSnakeValue,
    }));
    setCurrentAccordion(1);

    let servicePrefix;

    const checkActions = localStorage.getItem(`${serviceSnakeValue}-actions`);
    if (checkActions) {
      const actions = JSON.parse(checkActions);
      setActionsData(actions);
    } else {
      const data = await Api.getServiceData(serviceSnakeValue, "ACTION");

      localStorage.setItem(
        `${serviceSnakeValue}-actions`,
        JSON.stringify(data.Items)
      );
      const actions = localStorage.getItem(`${serviceSnakeValue}-actions`);
      const parsedActions = JSON.parse(actions);

      // set object for actions state
      let actionsObject = {
        actions: {},
        suggestions: {},
      };

      servicePrefix = parsedActions[0].prefix.S;

      parsedActions.forEach((action) => {
        const actionObj = {
          name: action.action.S,
          description: action.description.S,
          prefix: servicePrefix,
        };
        if (!actionsObject.actions[action.access.S]) {
          actionsObject.actions[action.access.S] = [];
        }
        actionsObject.actions[action.access.S].push(actionObj);
      });

      // get suggestions for each access level and add to actionsObject
      for (const key in actionsObject.actions) {
        const actionsList = actionsObject.actions[key].map(
          (action) => action.name
        );
        const suggestions = createWildcardSuggestions(
          actionsList,
          key,
          servicePrefix
        );
        actionsObject.suggestions[key] = suggestions;
      }

      setActionsData(actionsObject);
      setDisplayedServices(servicesData);
    }
  };

  if (servicesData.length) {
    return (
      <Box
        margin={{ top: "small", bottom: "medium" }}
        justify="stretch"
        fill="horizontal"
        align="start"
        alignContent="start"
        direction="row"
        wrap={true}
        overflow="auto"
      >
        <TextInput
          placeholder="Search services..."
          icon={<FormSearch />}
          plain={true}
          size="small"
          focusIndicator={false}
          onChange={(e) => handleServiceSearch(e.target.value.toLowerCase())}
        />
        {displayedServices.map((service) => (
          <Button
            color="primary"
            label={service.sk.S}
            size="small"
            fill={false}
            hoverIndicator={true}
            margin="xxsmall"
            value={service.sk.S}
            onClick={async (e) => await handleServiceSelection(e.target.value)}
          />
        ))}
      </Box>
    );
  } else {
    return <Spinner margin="medium" />;
  }
};

export default ServicesList;
