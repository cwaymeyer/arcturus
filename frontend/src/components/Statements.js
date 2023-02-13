import { Box, Text, Anchor } from "grommet";
import { Edit } from "grommet-icons";

const Statements = ({ statements }) => {
  if (statements.length) {
    return (
      <Box>
        {statements.map((statement) => {
          return (
            <Box
              pad="small"
              justify="stretch"
              fill="horizontal"
              overflow="auto"
              elevation="small"
              direction="row"
              alignContent="stretch"
            >
              <Text>
                <Text weight="bold">{statement.access}</Text> access to
                <Text weight="bold"> {statement.serviceName}</Text>
              </Text>
              <Anchor
                margin={{ left: "small" }}
                label={<Edit size="small" />}
              />
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
