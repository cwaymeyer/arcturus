import { Box, Text } from "grommet";

const Statements = ({ statements }) => {
  if (statements.length) {
    console.log("STATEMENTS", statements);
    return (
      <Box>
        {statements.map((statement) => {
          return (
            <Box pad="small">
              <Text>
                <Text weight="bold">{statement.access}</Text> access to
                <Text weight="bold"> {statement.serviceName}</Text>
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
