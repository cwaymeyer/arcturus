import { Box, Button, Text, Tip, Page, PageHeader } from "grommet";
import { CircleInformation } from "grommet-icons";

const StageDraft = ({
  stagedStatement,
  setStagedStatement,
  actionsData,
  setActionsData,
}) => {
  const handleActionSelection = (actionName) => {
    console.log(actionName);

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
    console.log("✨ UPDATEDACTIONSDATAARRAY", updatedActionsDataArray);
    setActionsData((existingValues) => ({
      ...existingValues,
      [accessLevel]: updatedActionsDataArray,
    }));
    console.log("✨ STAGE", actionsData);

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
    console.log("new staged actions object", newStagedActionsObject);
    setStagedStatement((existingValues) => ({
      ...existingValues,
      actions: newStagedActionsObject,
    }));
  };

  const stagedStatementActionKeys = Object.keys(stagedStatement.actions);

  if (stagedStatementActionKeys.length) {
    return (
      <Box margin={{ top: "small", bottom: "medium" }}>
        {stagedStatementActionKeys.map((accessLevel) => {
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
              <Page>
                <PageHeader
                  title={accessLevel}
                  actions={
                    <Button
                      label="Remove all"
                      color="tertiary"
                      size="small"
                      primary
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
                      hoverIndicator={true}
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
                              background="tertiary"
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
    );
  }
};

export default StageDraft;
