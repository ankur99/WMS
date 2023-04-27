import { Tooltip, Typography } from "antd";

const { Text } = Typography;

const TextToolTip = ({ label, toolTipText }: { label: string; toolTipText: string }) => {
  return (
    <Tooltip placement="bottomRight" title={<span>{toolTipText}</span>}>
      <Text type="secondary" style={{ padding: "4px 15px" }}>
        {label}
      </Text>
    </Tooltip>
  );
};

export default TextToolTip;
