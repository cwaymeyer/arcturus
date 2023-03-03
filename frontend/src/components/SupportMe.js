import { Text, Button } from "grommet";

const SupportMe = () => (
  <Text>
    Helped by this tool?
    <Button
      margin={{ left: "small" }}
      primary
      size="small"
      label={
        <Text weight="bold" margin={{ left: "small", right: "small" }}>
          ☕ Buy me a coffee
        </Text>
      }
      color="lightSecondary"
      target="_blank"
      href="https://www.buymeacoffee.com/calebwaymeyer"
    />
  </Text>
);

export default SupportMe;
