import { Box, Button, Text, Tip, Page, PageHeader } from "grommet";
import { CircleInformation } from "grommet-icons";
import { Stager } from "../../library/Stager";

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
    const accessLevel = Stager.getAccessLevelOfAction(actionsData, actionName);

    // update actionsData
    const updatedActionsDataArray = actionsData[accessLevel].map((val) => {
      if (val.name === actionName) {
        val.disabled = false;
      }
      return val;
    });

    Stager.updateKeyInState(
      setActionsData,
      accessLevel,
      updatedActionsDataArray
    );

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

    Stager.updateKeyInState(
      setStagedStatement,
      "actions",
      newStagedActionsObject
    );
  };

  const handleRemoveAllSelection = (accessLevel) => {
    // update actionsData
    const updatedActionsDataArray = actionsData[accessLevel].map((val) => {
      val.disabled = false;
      return val;
    });

    Stager.updateKeyInState(
      setActionsData,
      accessLevel,
      updatedActionsDataArray
    );

    // update stagedStatement
    let updatedStagedStatement = stagedStatement.actions;
    delete updatedStagedStatement[accessLevel];

    Stager.updateKeyInState(
      setStagedStatement,
      "actions",
      updatedStagedStatement
    );
  };

  const handleStageSave = () => {
    let currentStatements = statements;
    currentStatements.push(stagedStatement);
    setStatements(currentStatements);

    let actionsArray = [];
    for (const accessLevel in stagedStatement.actions) {
      stagedStatement.actions[accessLevel].forEach((action) => {
        actionsArray.push(`${action.prefix}:${action.name}`);
      });
    }

    for (const accessLevel in stagedStatement.suggestions) {
      stagedStatement.suggestions[accessLevel].forEach((action) => {
        actionsArray.push(`${action.prefix}:${action.name}`);
      });
    }

    let policyObj = {
      Effect: stagedStatement.access,
      Action: actionsArray,
      Resource: "*",
    };

    let currentDocumentStatement = document.Statement;
    currentDocumentStatement.push(policyObj);

    Stager.updateKeyInState(setDocument, "Statement", currentDocumentStatement);

    handleStageReset();
  };

  const handleStageReset = () => {
    setStagedStatement(initialStagedStatement);
    setActionsData({});
    setCurrentAccordion(0);
  };

  const actionKeys = Object.keys(stagedStatement.actions);
  const suggestionKeys = Object.keys(stagedStatement.suggestions);
  const stagedStatementKeys = [...new Set(actionKeys.concat(suggestionKeys))]; // combine with no dublicates

  if (stagedStatementKeys.length) {
    return (
      <Box>
        <Box margin={{ top: "small", bottom: "medium" }}>
          {stagedStatementKeys.map((accessLevel) => {
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
                {suggestionKeys.includes(accessLevel)
                  ? stagedStatement.suggestions[accessLevel].map(
                      (suggestion) => {
                        return (
                          <Box key={suggestion.name + Date.now()}>
                            <Button
                              color="secondary"
                              label={suggestion.name}
                              size="small"
                              active
                              fill={false}
                              hoverIndicator
                              margin="xxsmall"
                              value={JSON.stringify(suggestion)}
                              // onClick={(e) =>
                              //   handleWildcardSuggestion(e.target.value)
                              // }
                            ></Button>
                          </Box>
                        );
                      }
                    )
                  : null}
                {actionKeys.includes(accessLevel)
                  ? stagedStatement.actions[accessLevel].map((action) => {
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
                                    <Text size="small">
                                      {action.description}
                                    </Text>
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
                    })
                  : null}
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
            label={<Text weight="bold">Reset</Text>}
            onClick={handleStageReset}
          />
        </Box>
      </Box>
    );
  }
};

export default StageDraft;
