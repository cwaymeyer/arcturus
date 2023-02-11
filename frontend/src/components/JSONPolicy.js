import { useState } from "react";
import { Box, TextArea, Button, Notification } from "grommet";
import { Copy, Checkmark } from "grommet-icons";

const JSONPolicy = ({ document }) => {
  const [visible, setVisible] = useState(false);

  if (document.Statement.length) {
    return (
      <>
        {visible && (
          <Notification
            toast
            title="Policy Document Copied"
            icon={<Checkmark />}
            time={4000}
            onClose={() => setVisible(false)}
          />
        )}
        <Box align="end" margin={{ top: "xsmall", right: "xsmall" }}>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(document, null, 4));
              setVisible(true);
            }}
          >
            <Copy />
          </Button>
        </Box>
        <TextArea
          fill
          plain
          resize={false}
          focusIndicator="false"
          style={{ fontWeight: "normal", lineHeight: 1.4 }}
          value={JSON.stringify(document, null, 4)}
        />
      </>
    );
  } else {
    return;
  }
};

export default JSONPolicy;
