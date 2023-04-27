import { useMemo } from "react";

const FormatText = ({ text }: { text: string }) => {
  if (!text || typeof text !== "string") {
    return <>--</>;
  }

  const formattedText = useMemo(() => text.replace("_", " "), [text]);
  return <div style={{ textTransform: "capitalize" }}>{formattedText}</div>;
};

export default FormatText;
