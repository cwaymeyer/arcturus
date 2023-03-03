import { Box, Spinner, Button, Tip, Text, PageHeader, Page } from "grommet";
import { CircleInformation } from "grommet-icons";
import { Stager } from "../../library/Stager";

const ActionsList = ({
  actionsData,
  setActionsData,
  stagedStatement,
  setStagedStatement,
}) => {
  const handleActionSelection = (actionName) => {
    const accessLevel = Stager.getAccessLevelOfAction(actionsData, actionName);

    const action = Stager.disableActionInList(
      actionsData,
      setActionsData,
      actionName,
      "actions",
      accessLevel
    );

    Stager.addActionToStage(
      stagedStatement,
      setStagedStatement,
      action,
      "actions",
      accessLevel
    );
  };

  const handleWildcardSuggestion = (wildcard) => {
    const wildcardData = JSON.parse(wildcard);

    let actionNamesToDisable = [];
    if (wildcardData.type === "prefix") {
      actionsData.actions[wildcardData.accessLevel].forEach((action) => {
        const searchVal = wildcardData.name.slice(0, -1);
        const currActionPrefix = action.name.slice(0, searchVal.length);
        if (currActionPrefix === searchVal)
          actionNamesToDisable.push(action.name);
      });
    } else if (wildcardData.type === "suffix") {
      actionsData.actions[wildcardData.accessLevel].forEach((action) => {
        const searchVal = wildcardData.name.slice(1, wildcardData.name.length);
        const currActionSuffix = action.name.slice(-Math.abs(searchVal.length));
        if (currActionSuffix === searchVal)
          actionNamesToDisable.push(action.name);
      });
    } else {
      throw new Error(
        `Wildcard must be prefix or suffix. Received ${wildcardData.type}.`
      );
    }

    Stager.disableActionInList(
      actionsData,
      setActionsData,
      wildcardData.name,
      "suggestions",
      wildcardData.accessLevel
    );

    Stager.disableActionInList(
      actionsData,
      setActionsData,
      actionNamesToDisable,
      "actions",
      wildcardData.accessLevel
    );

    const wildcardObj = {
      name: wildcardData.name,
      prefix: wildcardData.servicePrefix,
    };

    Stager.addActionToStage(
      stagedStatement,
      setStagedStatement,
      wildcardObj,
      "suggestions",
      wildcardData.accessLevel
    );
  };

  const handleAddAllSelection = (accessLevel) => {
    // update actionsData
    const updatedArray = actionsData.actions[accessLevel].map((val) => {
      val.disabled = true;
      return val;
    });

    Stager.updateKeyInState(setActionsData, accessLevel, updatedArray);

    // update stagedStatement
    let stagedActions = stagedStatement.actions;
    stagedActions[accessLevel] = actionsData.actions[accessLevel];

    Stager.updateKeyInState(setStagedStatement, "actions", stagedActions);
  };

  // const handleAllActionsSelection = () => {};

  const actionsDataKeys = Object.keys(actionsData.actions);

  if (actionsDataKeys.length) {
    return (
      <Box margin={{ top: "small", bottom: "medium" }}>
        <Button
          color="primary"
          label="ADD ALL ACTIONS (*)"
          size="small"
          pad="xsmall"
          alignSelf="center"
          hoverIndicator
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
              wrap
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
                      value={accessLevel}
                      onClick={(e) => handleAddAllSelection(e.target.value)}
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
              {actionsData.suggestions[accessLevel].length
                ? actionsData.suggestions[accessLevel].map((suggestion) => {
                    return (
                      <Box key={suggestion.name + Date.now()}>
                        <Button
                          color="primary"
                          label={suggestion.name}
                          size="small"
                          active
                          fill={false}
                          hoverIndicator
                          margin="xxsmall"
                          disabled={suggestion.disabled}
                          value={JSON.stringify(suggestion)}
                          onClick={(e) =>
                            handleWildcardSuggestion(e.target.value)
                          }
                        ></Button>
                      </Box>
                    );
                  })
                : null}
              {actionsData.actions[accessLevel].map((action) => {
                return (
                  <Box key={action.name + Date.now()}>
                    <Button
                      color="primary"
                      label={action.name}
                      size="small"
                      fill={false}
                      hoverIndicator
                      margin="xxsmall"
                      disabled={action.disabled}
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
    );
  } else {
    return <Spinner margin="medium" />;
  }
};

export default ActionsList;
