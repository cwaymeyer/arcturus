import { Box, Spinner, Button, Tip, Text, PageHeader, Page } from "grommet";
import { CircleInformation } from "grommet-icons";

const ActionsList = ({
  actionsData,
  setActionsData,
  statementStage,
  setStatementStage,
}) => {
  const handleActionSelection = (action) => {
    console.log(action);

    // get access level of selected action
    let accessLevel;
    for (const key in actionsData) {
      for (let actionDetails of actionsData[key]) {
        if (actionDetails.name === action) {
          accessLevel = key;
        }
      }
    }

    // update actions list
    let poppedAction;
    const newArray = actionsData[accessLevel].filter((val) => {
      if (val.name === action) poppedAction = val;
      return val.name !== action;
    });

    setActionsData((existingValues) => ({
      ...existingValues,
      [accessLevel]: newArray,
    }));

    // // update staging area

    // if (!actionsObject[action.access.S]) {
    //   actionsObject[action.access.S] = [];
    // }
    // // actionsObject[action.access.S].actions.push(actionObj);
    // actionsObject[action.access.S].push(actionObj);

    let stagedActions = statementStage.actions;
    if (!stagedActions[accessLevel]) {
      stagedActions[accessLevel] = [];
    }
    stagedActions[accessLevel].push(poppedAction);

    // let updatedStageAccess = statementStage.actions;
    // if (!updatedStageAccess.includes(accessLevel))
    //   updatedStageAccess.push(accessLevel);

    setStatementStage((existingValues) => ({
      ...existingValues,
      actions: stagedActions,
    }));
    console.log("💥", statementStage);
  };

  const actionsDataKeys = Object.keys(actionsData);
  console.log("✨", actionsData);

  if (actionsDataKeys.length) {
    return (
      <Box margin={{ top: "small", bottom: "medium" }}>
        <Button
          color="primary"
          label="ADD ALL ACTIONS (*)"
          size="small"
          pad="xsmall"
          alignSelf="center"
          hoverIndicator={true}
          value="*"
          fill={false}
          plain
          reverse
        />
        {actionsDataKeys.map((accessLevel) => {
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
                      label="Add all"
                      color="primary"
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
              {actionsData[accessLevel].map((action) => {
                return (
                  <Box key={action.name + Date.now()}>
                    <Button
                      color="primary"
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
  } else {
    return <Spinner margin="medium" />;
  }
};

export default ActionsList;
