import React from "react";
import { Header } from "grommet";

const AppBar = (props: any): any => (
  <Header
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    {...props}
  />
);

export default AppBar;
