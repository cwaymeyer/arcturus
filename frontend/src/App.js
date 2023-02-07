import { useState, useEffect } from "react";
import {
  Grommet,
  Box,
  Text,
  RadioButtonGroup,
  Accordion,
  AccordionPanel,
} from "grommet";
import { Api } from "./library/Api";
import { theme } from "./library/theme";
import AppBar from "./components/AppBar";
// import StyledAccordionPanel from "./components/StyledAccordionPanel";
import ServicesList from "./components/ServicesList";
import ActionsList from "./components/ActionsList";
// import StageDraft from "./components/StageDraft";

const App = () => {
  const initialStatementStage = {
    serviceName: "",
    serviceValue: "",
    access: "",
    actions: {},
    actionCategories: [],
    actions: [],
  };

  const initialPolicyStatement = {
    Version: "2012-10-17",
    Statement: [],
  };

  const [servicesData, setServicesData] = useState([]); // all services, unchanging directly from Canopus table
  const [displayedServices, setDisplayedServices] = useState([]); // displayed services, changes based on user search (subset of servicesData)
  const [currentAccordion, setCurrentAccordion] = useState(0); // current open accordion by index (null = none)
  const [actionsData, setActionsData] = useState([]); // all actions from selected service
  const [statementStage, setStatementStage] = useState(initialStatementStage); // object containing current policy data
  const [currentStatement, setCurrentStatement] = useState(
    initialPolicyStatement
  ); // exact current staged IAM policy statement

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

  const handleAccessSelect = (access) => {
    setStatementStage((existingValues) => ({
      ...existingValues,
      access: access,
    }));
    setCurrentAccordion(2);
  };

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
            <AccordionPanel
              label={
                <Text size="large" margin="small" weight="bold">
                  Select Service
                  <Text
                    size="medium"
                    weight="bolder"
                    margin={{ left: "medium" }}
                    color="primary"
                  >
                    {statementStage.serviceName}
                  </Text>
                </Text>
              }
            >
              <ServicesList
                servicesData={servicesData}
                displayedServices={displayedServices}
                setDisplayedServices={setDisplayedServices}
                setActionsData={setActionsData}
                setCurrentAccordion={setCurrentAccordion}
                statementStage={statementStage}
                setStatementStage={setStatementStage}
              />
            </AccordionPanel>
            <AccordionPanel
              label={
                <Text size="large" margin="small" weight="bold">
                  Select Access
                  <Text
                    size="medium"
                    weight="bolder"
                    margin={{ left: "medium" }}
                    color="primary"
                  >
                    {statementStage.access}
                  </Text>
                </Text>
              }
            >
              <RadioButtonGroup
                name="Access"
                margin={{ top: "small", bottom: "medium", left: "small" }}
                options={["Allow", "Deny"]}
                onChange={(e) => handleAccessSelect(e.target.value)}
              />
            </AccordionPanel>
            <AccordionPanel
              label={
                <Text size="large" margin="small" weight="bold">
                  Select Actions
                  <Text
                    size="medium"
                    weight="bolder"
                    margin={{ left: "medium" }}
                    color="primary"
                  >
                    {Object.keys(statementStage.actions).map(
                      (text) => text + " "
                    )}
                  </Text>
                </Text>
              }
            >
              <ActionsList
                actionsData={actionsData}
                setActionsData={setActionsData}
                statementStage={statementStage}
                setStatementStage={setStatementStage}
              />
            </AccordionPanel>
            <AccordionPanel
              label={
                <Text size="large" margin="small" weight="bold">
                  Specify Resources
                  <Text
                    size="medium"
                    weight="bolder"
                    margin={{ left: "medium" }}
                    color="primary"
                  ></Text>
                </Text>
              }
            ></AccordionPanel>
            <AccordionPanel
              label={
                <Text size="large" margin="small" weight="bold">
                  Specify Conditions
                  <Text
                    size="medium"
                    weight="bolder"
                    margin={{ left: "medium" }}
                    color="primary"
                  ></Text>
                </Text>
              }
            ></AccordionPanel>
          </Accordion>
        </Box>
        <Box
          pad="xsmall"
          border={{ color: "tertiary", size: "small" }}
          justify="stretch"
          fill="horizontal"
        >
          {/* <StageDraft statementStage={statementStage} /> */}
        </Box>
        <Box
          pad="xsmall"
          border={{ color: "tertiary", size: "small" }}
          justify="stretch"
          fill="horizontal"
        />
      </Box>
    </Grommet>
  );
};

export default App;
