import { Box, Button, Text, Tip } from "grommet";
import { CircleInformation } from "grommet-icons";

const StageDraft = ({ statementStage }) => {
  if (statementStage.actions.length) {
    return (
      <Box>
        {statementStage.actions.map((category) => {
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
                onClick={(e) => console.log(e.currentTarget.value)}
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
                      <CircleInformation size="small" background="secondary" />
                    </Box>
                  </Tip>
                }
              />
            </Box>
          );
        })}
      </Box>
    );
  }
};

export default StageDraft;
