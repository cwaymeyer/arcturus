import { useState, useEffect } from "react";
import {
  Grommet,
  Heading,
  Box,
  Text,
  Button,
  TextInput,
  Accordion,
  AccordionPanel,
  Spinner,
} from "grommet";
import { FormSearch } from "grommet-icons";
import { Api } from "./library/Api";
import AppBar from "./components/AppBar";

const theme = {
  global: {
    colors: {
      primary: "#95B8D1", // 1C3041, 2FE6DE, 18F2B2, B2ABF2, 89043D, || 809BCE, 95B8D1, B8E0D2, D6EADF, EAC4D5 ||
      secondary: "#B8E0D2",
      tertiary: "#D6EADF",
      deep: "#809BCE",
      light: "#EAC4D5",
    },
    font: {
      family: "Karla",
      size: "18px",
      height: "20px",
    },
  },
};

const App = () => {
  const [servicesData, setServicesData] = useState([]); // all services, unchanging directly from Canopus table
  const [displayedServices, setDisplayedServices] = useState([]); // displayed services, changes based on user search (subset of servicesData)
  const [currentAccordion, setCurrentAccordion] = useState(0); // current open accordion by index (null = none)
  const [actionsData, setActionsData] = useState([]); // displayed services, changes based on user search (subset of servicesData)
  // const [currentStatement, setCurrentStatement] = useState({}); // current IAM policy statement in editing

  useEffect(() => {
    const getServices = async () => {
      // set state from local storage if exists
      const checkServices = localStorage.getItem("services");
      if (checkServices) {
        const services = JSON.parse(checkServices);
        setServicesData(services);
        setDisplayedServices(services);
      } else {
        const data = await Api.getServices();
        console.log(data);

        localStorage.setItem("services", JSON.stringify(data.Items));
        const services = localStorage.getItem("services");
        const parsedServices = JSON.parse(services);

        setServicesData(parsedServices);
        setDisplayedServices(parsedServices);
      }
    };
    getServices();
  }, []);

  // clear all local storage but services on page close
  window.onunload = () => {
    const services = localStorage.getItem("services");
    localStorage.clear();
    localStorage.setItem("services", services);
  };

  const handleServiceSearch = (searchValue) => {
    const filteredServices = servicesData.filter((service) => {
      const serviceName = service.sk.S.toLowerCase();
      return serviceName.includes(searchValue);
    });
    setDisplayedServices(filteredServices);
  };

  // get a service's actions data
  const handleServiceSelection = async (service) => {
    setCurrentAccordion(1);
    const checkActions = localStorage.getItem(`${service}-actions`);
    if (checkActions) {
      const actions = JSON.parse(checkActions);
      setActionsData(actions);
    } else {
      const data = await Api.getServiceActionsData(service);
      console.log(data);

      localStorage.setItem(`${service}-actions`, JSON.stringify(data.Items));
      const actions = localStorage.getItem(`${service}-actions`);
      const parsedActions = JSON.parse(actions);

      setActionsData(parsedActions);
    }
  };

  if (servicesData.length) {
    return (
      <Grommet theme={theme}>
        <AppBar color="primary">
          <Text size="large">IAM Generator</Text>
        </AppBar>
        <Heading level={1} size="small">
          Create a new IAM policy
        </Heading>
        <Box
          height="xlarge"
          direction="row"
          gap="small"
          border={{ color: "primary", size: "small" }}
          pad="small"
        >
          <Box
            pad="xsmall"
            border={{ color: "tertiary", size: "small" }}
            justify="stretch"
            fill="horizontal"
            overflow="auto"
          >
            <Accordion animate={false} activeIndex={currentAccordion}>
              <AccordionPanel label="Select Service">
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
                    onChange={(e) =>
                      handleServiceSearch(e.target.value.toLowerCase())
                    }
                  />
                  {displayedServices.map((service) => (
                    <Button
                      color="primary"
                      label={service.sk.S}
                      size="xsmall"
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
              </AccordionPanel>
              <AccordionPanel label="Select Actions" color="deep">
                <Box
                  justify="stretch"
                  fill="horizontal"
                  align="start"
                  alignContent="start"
                  direction="row"
                  wrap={true}
                  overflow="auto"
                >
                  {() => {
                    if (actionsData.length) {
                      <Heading level={3} size="xxsmall">
                        Read
                      </Heading>;
                    } else {
                      <Spinner />;
                    }
                  }}
                </Box>
              </AccordionPanel>
              <AccordionPanel label="Panel 3" color="deep"></AccordionPanel>
            </Accordion>
          </Box>
          <Box
            pad="xsmall"
            border={{ color: "tertiary", size: "small" }}
            justify="stretch"
            fill="horizontal"
          />
          <Box
            pad="xsmall"
            border={{ color: "tertiary", size: "small" }}
            justify="stretch"
            fill="horizontal"
          />
        </Box>
      </Grommet>
    );
  } else {
    return <Text size="large">Loading...</Text>;
  }
};

export default App;
