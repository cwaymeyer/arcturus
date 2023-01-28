import { Header } from "grommet";

const AppBar = (props: any): any => (
  <Header
    background="primary"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    {...props}
  />
);

export default AppBar;
