import React from "react";
import { Grommet, Header, Page, PageContent, PageHeader, Text } from "grommet";
import AppBar from "./components/AppBar";

const theme = {
  global: {
    colors: {
      brand: "#95B8D1", // 1C3041, 2FE6DE, 18F2B2, B2ABF2, 89043D, || 809BCE, 95B8D1, B8E0D2, D6EADF, EAC4D5 ||
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
      <Page>
        <AppBar>
          <Text size="large">IAM Generator</Text>
        </AppBar>
        <PageContent>
          <PageHeader title="Create a new IAM policy" />
        </PageContent>
      </Page>
    </Grommet>
  );
};

export default App;
