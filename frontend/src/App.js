import { useState, useEffect } from "react";
import { Grommet, Box, Text, Nav, RadioButtonGroup, Accordion } from "grommet";
import { Api } from "./library/Api";
import { theme } from "./style/theme";
import AppBar from "./components/AppBar";
import SupportMe from "./components/SupportMe";
import FullBox from "./components/FullBox";
import StyledAccordionPanel from "./components/select/StyledAccordionPanel";
import ServicesList from "./components/select/ServicesList";
import ActionsList from "./components/select/ActionsList";
import Statements from "./components/stage/Statements";
import StageDraft from "./components/stage/StageDraft";
import JSONPolicy from "./components/result/JSONPolicy";
import { Stager } from "./library/Stager";

const App = () => {
  const initialStagedStatement = {
    serviceName: "",
    serviceValue: "",
    access: "",
    actions: {},
    suggestions: {},
  };

  const initialDocument = {
    Version: "2012-10-17",
    Statement: [],
  };

  const initialActionsData = {
    actions: {},
    suggestions: {},
  };

  const [servicesData, setServicesData] = useState([]); // all services, unchanging directly from Canopus table
  const [displayedServices, setDisplayedServices] = useState([]); // displayed services, changes based on user search (subset of servicesData)
  const [currentAccordion, setCurrentAccordion] = useState(0); // current open accordion by index (null = none)
  const [actionsData, setActionsData] = useState(initialActionsData); // all actions from selected service
  const [stagedStatement, setStagedStatement] = useState(
    initialStagedStatement
  ); // object containing current policy data
  const [statements, setStatements] = useState([]); // all added policy statements
  const [document, setDocument] = useState(initialDocument); // exact current staged IAM policy statement

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
    Stager.updateKeyInState(setStagedStatement, "access", access);

    // setStagedStatement((existingValues) => ({
    //   ...existingValues,
    //   access: access,
    // }));
    setCurrentAccordion(2);
  };

  return (
    <Grommet full theme={theme}>
      <Box fill background="lightBG">
        <AppBar color="primary">
          <Text size="xxlarge" margin="xsmall" weight="bold">
            IAM Generator
            <Text size="large" weight="normal" margin={{ left: "medium" }}>
              Create AWS IAM policies
            </Text>
          </Text>
          <Nav direction="row">
            <SupportMe />
          </Nav>
        </AppBar>
        <Box
          height="xlarge"
          direction="row"
          margin={{ top: "small", bottom: "small" }}
          gap="small"
        >
          <FullBox>
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
          </FullBox>
          <FullBox>
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
          </FullBox>
          <FullBox>
            <JSONPolicy document={document} />
          </FullBox>
        </Box>
      </Box>
    </Grommet>
  );
};

export default App;
