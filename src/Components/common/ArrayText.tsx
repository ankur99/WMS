import { AuditResultProps } from "../../types/auditTypes";

const ArrayText = ({ value }: { value: AuditResultProps }) => {
  return (
    <>
      {value &&
        value.map((item, index) => (
          <p key={index} style={{ margin: "0" }}>
            {item?.result ? item.result : JSON.stringify(item).replaceAll('"', "")}
          </p>
        ))}
    </>
  );
};

export default ArrayText;
