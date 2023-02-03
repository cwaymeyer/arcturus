import { Box, Button, TextInput, Spinner } from "grommet";
import { Api } from "../library/Api";
import { FormSearch } from "grommet-icons";

const ServicesList = ({
  servicesData,
  displayedServices,
  setDisplayedServices,
  setActionsData,
  setCurrentAccordion,
}) => {
  const handleServiceSearch = (searchValue) => {
    const filteredServices = servicesData.filter((service) => {
      const serviceName = service.sk.S.toLowerCase();
      const acronym = serviceName
        .split(" ")
        .map((word) => word[0])
        .join("");
      return serviceName.includes(searchValue) || acronym.includes(searchValue);
    });
    setDisplayedServices(filteredServices);
  };

  const handleServiceSelection = async (service) => {
    setCurrentAccordion(1);
    const checkActions = localStorage.getItem(`${service}-actions`);
    if (checkActions) {
      const actions = JSON.parse(checkActions);
      setActionsData(actions);
    } else {
      const data = await Api.getServiceData(service, "ACTION");
      console.log(data);

      localStorage.setItem(`${service}-actions`, JSON.stringify(data.Items));
      const actions = localStorage.getItem(`${service}-actions`);
      const parsedActions = JSON.parse(actions);

      // set object for actions state
      let actionsObject = {};
      parsedActions.forEach((action) => {
        const actionObj = {
          name: action.action.S,
          description: action.description.S,
        };
        if (!actionsObject[action.access.S]) {
          actionsObject[action.access.S] = [];
        }
        actionsObject[action.access.S].push(actionObj);
      });

      setActionsData(actionsObject);
    }
  };

  if (servicesData.length) {
    return (
      <Box
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
            onClick={async (e) => {
              const snakeValue = e.target.value
                .toLowerCase()
                .split(" ")
                .join("_");
              await handleServiceSelection(snakeValue);
            }}
          />
        ))}
      </Box>
    );
  } else {
    return <Spinner margin="medium" />;
  }
};

export default ServicesList;
