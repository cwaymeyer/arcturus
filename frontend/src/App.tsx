import { useState, useEffect } from "react";
import { Grommet, Heading, Box, Text, Button } from "grommet";
import { Api } from "./library/Api";
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
  const [servicesData, setServicesData]: any = useState([]);

  useEffect(() => {
    const getServices = async () => {
      // set state from local storage if exists
      const checkServices = localStorage.getItem("services");
      if (checkServices) {
        const services = JSON.parse(checkServices);
        setServicesData(services);
      } else {
        const data: any = await Api.getServices();

        localStorage.setItem("services", JSON.stringify(data.Items));
        const services = localStorage.getItem("services");
        const parsedServices = JSON.parse(services!);

        setServicesData(parsedServices);
      }
    };
    getServices();
  }, []);

  if (servicesData.length) {
    return (
      <Grommet theme={theme}>
        <AppBar color="primary">
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
          >
            {servicesData.map((service: any) => (
              <Button label={service.sk.S} />
            ))}
          </Box>
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
  } else {
    return <Text>Loading...</Text>;
  }
};

export default App;
