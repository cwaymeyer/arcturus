import { useState } from "react";
import { Box, TextArea, Button, Notification } from "grommet";
import { Copy, Checkmark } from "grommet-icons";

const JSONPolicy = ({ document }) => {
  const [visibleCopyNotif, setVisibleCopyNotif] = useState(false);

  const formattedDoc = JSON.stringify(document, null, 2);

  if (document.Statement.length) {
    return (
      <>
        {visibleCopyNotif && (
          <Notification
            toast
            title="Policy Document Copied"
            icon={<Checkmark />}
            time={4000}
            onClose={() => setVisibleCopyNotif(false)}
          />
        )}
        <Box align="end" direction="row-reverse">
          <Button
            margin={{ top: "small", right: "small" }}
            onClick={() => {
              navigator.clipboard.writeText(formattedDoc);
              setVisibleCopyNotif(true);
            }}
          >
            <Copy />
          </Button>
        </Box>
        <TextArea
          fill
          plain
          resize={false}
          size="small"
          focusIndicator="false"
          spellCheck="false"
          style={{
            fontFamily: "JetBrains Mono",
            fontWeight: "normal",
            lineHeight: 1.4,
          }}
          value={formattedDoc}
        />
      </>
    );
  } else {
    return;
  }
};

export default JSONPolicy;
