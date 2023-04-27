import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const confirmModal = ({
  title,
  content,
  onOk
}: {
  title: string;
  content: string;
  onOk: () => void;
}) => {
  Modal.confirm({
    title: title,
    icon: <ExclamationCircleOutlined />,
    content: content,
    onOk() {
      onOk();
    },
    onCancel() {
      console.log("Cancel");
    }
  });
};

export default confirmModal;
