import { AccordionPanel, Text } from "grommet";

const StyledAccordionPanel = ({ heading, subheading, ...rest }) => {
  return (
    <AccordionPanel
      label={
        <Text size="large" margin="small" weight="bold">
          {heading}
          <Text
            size="medium"
            weight="bolder"
            margin={{ left: "medium" }}
            color="primary"
          >
            {subheading}
          </Text>
        </Text>
      }
      {...rest}
    />
  );
};

export default StyledAccordionPanel;
