import { Box, Button, Text, Tip, Page, PageHeader } from "grommet";
import { CircleInformation } from "grommet-icons";

const StageDraft = ({
  stagedStatement,
  setStagedStatement,
  initialStagedStatement,
  actionsData,
  setActionsData,
  statements,
  setStatements,
  document,
  setDocument,
  setCurrentAccordion,
}) => {
  const handleActionSelection = (actionName) => {
    // get access level of selected action
    let accessLevel;
    for (const key in stagedStatement.actions) {
      for (let actionDetails of stagedStatement.actions[key]) {
        if (actionDetails.name === actionName) {
          accessLevel = key;
        }
      }
    }

    // update actionsData
    const updatedActionsDataArray = actionsData[accessLevel].map((val) => {
      if (val.name === actionName) {
        val.disabled = false;
      }
      return val;
    });

    setActionsData((existingValues) => ({
      ...existingValues,
      [accessLevel]: updatedActionsDataArray,
    }));

    // update stagedStatement
    let newStagedActionsObject = stagedStatement.actions;

    const updatedStagedStatement = stagedStatement.actions[accessLevel].filter(
      (val) => val.name !== actionName
    );

    if (!updatedStagedStatement.length) {
      delete newStagedActionsObject[accessLevel];
    } else {
      newStagedActionsObject[accessLevel] = updatedStagedStatement;
    }

    setStagedStatement((existingValues) => ({
      ...existingValues,
      actions: newStagedActionsObject,
    }));
  };

  const handleRemoveAllSelection = (accessLevel) => {
    // update actionsData
    const updatedActionsDataArray = actionsData[accessLevel].map((val) => {
      val.disabled = false;
      return val;
    });

    setActionsData((existingValues) => ({
      ...existingValues,
      [accessLevel]: updatedActionsDataArray,
    }));

    // update stagedStatement
    let updatedStagedStatement = stagedStatement.actions;
    delete updatedStagedStatement[accessLevel];

    setStagedStatement((existingValues) => ({
      ...existingValues,
      actions: updatedStagedStatement,
    }));
  };

  const handleStageSave = () => {
    let currentStatements = statements;
    currentStatements.push(stagedStatement);
    setStatements(currentStatements);

    let actionsArray = [];
    for (const accessLevel in stagedStatement.actions) {
      stagedStatement.actions[accessLevel].forEach((action) => {
        actionsArray.push(`${stagedStatement.serviceValue}:${action.name}`);
      });
    }

    let policyObj = {
      Effect: stagedStatement.access,
      Action: actionsArray,
      Resource: "*",
    };

    let currentDocumentStatement = document.Statement;
    currentDocumentStatement.push(policyObj);

    setDocument((existingValues) => ({
      ...existingValues,
      Statement: currentDocumentStatement,
    }));

    handleStageClear();
  };

  const handleStageClear = () => {
    setStagedStatement(initialStagedStatement);
    setCurrentAccordion(0);
  };

  const stagedStatementActionKeys = Object.keys(stagedStatement.actions);

  if (stagedStatementActionKeys.length) {
    return (
      <Box>
        <Box margin={{ top: "small", bottom: "medium" }}>
          {stagedStatementActionKeys.map((accessLevel) => {
            return (
              <Box
                justify="stretch"
                fill="horizontal"
                align="start"
                alignContent="start"
                direction="row"
                wrap
                overflow="auto"
              >
                <Page>
                  <PageHeader
                    title={accessLevel}
                    actions={
                      <Button
                        label="Remove all"
                        color="light"
                        size="small"
                        primary
                        value={accessLevel}
                        onClick={(e) =>
                          handleRemoveAllSelection(e.target.value)
                        }
                      />
                    }
                    size="small"
                    margin={{
                      left: "small",
                      top: "xxsmall",
                      right: "xxsmall",
                      bottom: "xxsmall",
                    }}
                  />
                </Page>
                {stagedStatement.actions[accessLevel].map((action) => {
                  return (
                    <Box key={action.name + Date.now()}>
                      <Button
                        color="secondary"
                        label={action.name}
                        size="small"
                        fill={false}
                        hoverIndicator
                        margin="xxsmall"
                        reverse
                        value={action.name}
                        onClick={(e) =>
                          handleActionSelection(e.currentTarget.value)
                        }
                        icon={
                          <Tip
                            plain
                            dropProps={{ align: { bottom: "top" } }}
                            size="small"
                            content={
                              <Box
                                pad="small"
                                gap="small"
                                margin="small"
                                width={{ max: "medium" }}
                                background="lightSecondary"
                                round="small"
                              >
                                <Text size="small">{action.description}</Text>
                              </Box>
                            }
                          >
                            <Box round="small">
                              <CircleInformation
                                size="small"
                                background="secondary"
                              />
                            </Box>
                          </Tip>
                        }
                      />
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
        <Box direction="row" gap="small" margin="small">
          <Button
            primary
            color="deepSecondary"
            size="large"
            width="medium"
            label={<Text weight="bold">Save</Text>}
            onClick={handleStageSave}
          />
          <Button
            primary
            color="light"
            size="large"
            width="medium"
            label={<Text weight="bold">Clear</Text>}
            onClick={handleStageClear}
          />
        </Box>
      </Box>
    );
  }
};

export default StageDraft;
