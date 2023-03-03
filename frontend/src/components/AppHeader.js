import { Header, Text, Nav } from "grommet";
import SupportMe from "./SupportMe";

const AppHeader = (props) => (
  <Header
    background="primary"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
  >
    <Text size="xxlarge" margin="xsmall" weight="bold">
      IAM Generator
      <Text size="large" weight="normal" margin={{ left: "medium" }}>
        Create AWS IAM policies
      </Text>
    </Text>
    <Nav direction="row">
      <SupportMe />
    </Nav>
  </Header>
);

export default AppHeader;
