import { Box, Spinner, Button, Tip, Text, PageHeader, Page } from "grommet";
import { CircleInformation } from "grommet-icons";

const ActionsList = ({ actionsData }) => {
  const actionsDataKeys = Object.keys(actionsData);
  if (actionsDataKeys.length) {
    return (
      <Box>
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
                      margin={{ right: "small" }}
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
                  <Button
                    color="primary"
                    label={action.name}
                    size="small"
                    fill={false}
                    hoverIndicator={true}
                    margin="xxsmall"
                    value={action.name}
                    reverse
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
                            round="small"
                            background="tertiary"
                          >
                            <Text size="small">{action.description}</Text>
                          </Box>
                        }
                      >
                        <CircleInformation size="small" />
                      </Tip>
                    }
                  />
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
