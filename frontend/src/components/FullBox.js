import { Box } from "grommet";

const FullBox = (props) => (
  <Box
    pad="xsmall"
    margin="xsmall"
    round="medium"
    justify="stretch"
    fill="horizontal"
    overflow="auto"
    elevation="medium"
    background="white"
    {...props}
  />
);

export default FullBox;
