import { Box, Text, Anchor } from "grommet";
import { Edit } from "grommet-icons";

const Statements = ({ statements }) => {
  if (statements.length) {
    return (
      <Box>
        {statements.map((statement) => {
          let accessList = "";
          Object.keys(statement.actions).forEach((accessLevel, idx) => {
            idx > 0
              ? (accessList += `, ${accessLevel}`)
              : (accessList += accessLevel);
          });
          return (
            <Box
              pad="small"
              margin={{ top: "xsmall" }}
              round="small"
              justify="stretch"
              fill="horizontal"
              overflow="auto"
              elevation="small"
            >
              <Text>
                <Text weight="bold">{statement.access}</Text> access to
                <Text weight="bold"> {statement.serviceName}</Text>
                <Anchor
                  margin={{ left: "small" }}
                  label={<Edit size="small" />}
                />
              </Text>
              <Text
                size="small"
                color="deepPrimary"
                margin={{ top: "xsmall" }}
                style={{ fontStyle: "italic" }}
              >
                {accessList}
              </Text>
            </Box>
          );
        })}
      </Box>
    );
  } else {
    return;
  }
};

export default Statements;
