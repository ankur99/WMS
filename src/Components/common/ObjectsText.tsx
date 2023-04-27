import { getType } from "../../utils/helperFunctions";
const ObjectTexts = ({ value }: { value: Record<string, string> }) => {
  if (!value) return <></>;
  if (getType(value) === "string") return <>value</>;
  return (
    <>
      {value &&
        Object.keys(value).map((item, index) => (
          <p key={index} style={{ margin: "0" }}>{`${item.replaceAll("_", " ")}: ${
            value[item]
          }`}</p>
        ))}
    </>
  );
};

export default ObjectTexts;
