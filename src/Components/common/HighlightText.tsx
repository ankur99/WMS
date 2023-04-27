import { useMemo } from "react";

const HighlightText = ({
  text,
  highlight
}: {
  text: string | number | null;
  highlight: string | number | null;
}) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = useMemo(
    () => text?.toString().split(new RegExp(`(${highlight})`, "gi")),
    [text, highlight]
  );
  return (
    <span>
      {parts?.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight?.toString().toLowerCase()
              ? { backgroundColor: "#04a3bec2" }
              : {}
          }>
          {part}
        </span>
      ))}
    </span>
  );
};

export default HighlightText;
