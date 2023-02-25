import { useState, useEffect } from "react";
import {
  Grommet,
  Box,
  Text,
  Nav,
  Button,
  RadioButtonGroup,
  Accordion,
} from "grommet";
import { Api } from "./library/Api";
import { theme } from "./library/theme";
import AppBar from "./components/AppBar";
import StyledAccordionPanel from "./components/StyledAccordionPanel";
import ServicesList from "./components/ServicesList";
import ActionsList from "./components/ActionsList";
import Statements from "./components/Statements";
import StageDraft from "./components/StageDraft";
import JSONPolicy from "./components/JSONPolicy";

const App = () => {
  const initialStagedStatement = {
    serviceName: "",
    serviceValue: "",
    access: "",
    actions: {},
    suggestions: {},
  };

  const initialPolicyDocument = {
    Version: "2012-10-17",
    Statement: [],
  };

  const [servicesData, setServicesData] = useState([]); // all services, unchanging directly from Canopus table
  const [displayedServices, setDisplayedServices] = useState([]); // displayed services, changes based on user search (subset of servicesData)
  const [currentAccordion, setCurrentAccordion] = useState(0); // current open accordion by index (null = none)
  const [actionsData, setActionsData] = useState({}); // all actions from selected service
  const [stagedStatement, setStagedStatement] = useState(
    initialStagedStatement
  ); // object containing current policy data
  const [statements, setStatements] = useState([]); // all added policy statements
  const [document, setDocument] = useState(initialPolicyDocument); // exact current staged IAM policy statement

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

  const handleAccessSelect = (access) => {
    setStagedStatement((existingValues) => ({
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
        <Nav direction="row">
          <Text>
            Helped by this tool?
            <Button
              margin={{ left: "small" }}
              primary
              size="small"
              label={
                <Text weight="bold" margin={{ left: "small", right: "small" }}>
                  ☕ Buy me a coffee
                </Text>
              }
              color="lightSecondary"
              target="_blank"
              href="https://www.buymeacoffee.com/calebwaymeyer"
            />
          </Text>
        </Nav>
      </AppBar>
      <Box
        height="xlarge"
        direction="row"
        margin={{ top: "small", bottom: "small" }}
        gap="small"
      >
        <Box
          pad="xsmall"
          justify="stretch"
          fill="horizontal"
          overflow="auto"
          elevation="medium"
        >
          <Accordion animate={false} activeIndex={currentAccordion}>
            <StyledAccordionPanel
              heading="Select Service"
              subheading={stagedStatement.serviceName}
            >
              <ServicesList
                servicesData={servicesData}
                displayedServices={displayedServices}
                setDisplayedServices={setDisplayedServices}
                setActionsData={setActionsData}
                setCurrentAccordion={setCurrentAccordion}
                stagedStatement={stagedStatement}
                setStagedStatement={setStagedStatement}
              />
            </StyledAccordionPanel>
            <StyledAccordionPanel
              heading="Select Access"
              subheading={stagedStatement.access}
            >
              <RadioButtonGroup
                name="Access"
                margin={{ top: "small", bottom: "medium", left: "small" }}
                options={["Allow", "Deny"]}
                onChange={(e) => handleAccessSelect(e.target.value)}
              />
            </StyledAccordionPanel>
            <StyledAccordionPanel
              heading="Select Actions"
              subheading={Object.keys(stagedStatement.actions).map(
                (text, idx) => {
                  return idx === 0 ? text : `, ${text}`;
                }
              )}
            >
              <ActionsList
                actionsData={actionsData}
                setActionsData={setActionsData}
                stagedStatement={stagedStatement}
                setStagedStatement={setStagedStatement}
              />
            </StyledAccordionPanel>
            <StyledAccordionPanel heading="Specify Resources" subheading="" />
            <StyledAccordionPanel heading="Add Principal?" subheading="" />
            <StyledAccordionPanel heading="Add Conditions?" subheading="" />
          </Accordion>
        </Box>
        <Box
          pad="xsmall"
          justify="stretch"
          fill="horizontal"
          overflow="auto"
          elevation="medium"
        >
          <Statements statements={statements} />
          <StageDraft
            stagedStatement={stagedStatement}
            setStagedStatement={setStagedStatement}
            initialStagedStatement={initialStagedStatement}
            actionsData={actionsData}
            setActionsData={setActionsData}
            statements={statements}
            setStatements={setStatements}
            document={document}
            setDocument={setDocument}
            setCurrentAccordion={setCurrentAccordion}
          />
        </Box>
        <Box
          pad="xsmall"
          justify="stretch"
          fill="horizontal"
          overflow="auto"
          elevation="medium"
        >
          <JSONPolicy document={document} />
        </Box>
      </Box>
    </Grommet>
  );
};

export default App;
