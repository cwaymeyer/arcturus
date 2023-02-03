import { useState, useEffect } from "react";
import { Grommet, Box, Text, Accordion, AccordionPanel } from "grommet";
import { Api } from "./library/Api";
import AppBar from "./components/AppBar";
import ServicesList from "./components/ServicesList";
import ActionsList from "./components/ActionsList";

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
  const [actionsData, setActionsData] = useState([]); // all actions from selected service
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

  if (servicesData.length) {
    return (
      <Grommet theme={theme}>
        <AppBar color="primary">
          <Text size="xxlarge" margin="xsmall" weight="bold">
            IAM Generator
            <Text size="large" weight="normal" margin={{ left: "medium" }}>
              Create AWS IAM policies
            </Text>
          </Text>
        </AppBar>
        <Box
          height="xlarge"
          direction="row"
          margin={{ top: "small", bottom: "small" }}
          gap="small"
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
                <ServicesList
                  servicesData={servicesData}
                  displayedServices={displayedServices}
                  setDisplayedServices={setDisplayedServices}
                  setActionsData={setActionsData}
                  setCurrentAccordion={setCurrentAccordion}
                />
              </AccordionPanel>
              <AccordionPanel label="Select Actions">
                <ActionsList actionsData={actionsData} />
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
