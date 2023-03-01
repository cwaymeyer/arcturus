import { Box } from "grommet";

const FullBox = (props) => (
  <Box
    pad="xsmall"
    justify="stretch"
    fill="horizontal"
    overflow="auto"
    elevation="medium"
    {...props}
  />
);

export default FullBox;
