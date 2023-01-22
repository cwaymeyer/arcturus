import React from "react";
import { Grommet, Page, Heading, Grid, Box, Text } from "grommet";
import AppBar from "./components/AppBar";

const theme = {
  global: {
    colors: {
      primary: "#95B8D1", // 1C3041, 2FE6DE, 18F2B2, B2ABF2, 89043D, || 809BCE, 95B8D1, B8E0D2, D6EADF, EAC4D5 ||
      secondary: "#B8E0D2",
      tertiary: "#D6EADF",
      deep: "#809BCE",
      light: "#EAC4D5",
    },
    font: {
      family: "Karla",
      size: "18px",
      height: "20px",
    },
  },
};

const App = () => {
  return (
    <Grommet theme={theme}>
      <AppBar>
        <Text size="large">IAM Generator</Text>
      </AppBar>
      <Heading size="small">Create a new IAM policy</Heading>
      <Box
        height="large"
        direction="row"
        gap="small"
        border={{ color: "primary", size: "small" }}
        pad="small"
      >
        <Box
          pad="large"
          border={{ color: "tertiary", size: "small" }}
          justify="stretch"
          fill="horizontal"
        />
        <Box
          pad="large"
          border={{ color: "tertiary", size: "small" }}
          justify="stretch"
          fill="horizontal"
        />
        <Box
          pad="large"
          border={{ color: "tertiary", size: "small" }}
          justify="stretch"
          fill="horizontal"
        />
      </Box>
    </Grommet>
  );
};

export default App;
