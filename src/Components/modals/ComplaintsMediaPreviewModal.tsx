import { Button, Modal, Spin } from "antd";
import { useIssueAttachmentsData } from "../../hooks/useRQComplaints";
import { onErrorNotification } from "../../utils/helperFunctions";
import RenderMedia from "../common/RenderMedia";
import styles from "./complaints.module.css";

interface ComplaintsModelProps {
  visible: boolean;
  handleCancel: () => void;
  // images: string[];
  id: number;
}

const ComplaintsMediaPreviewModal = ({ visible, handleCancel, id }: ComplaintsModelProps) => {
  const { isLoading, data: attachmentsData } = useIssueAttachmentsData({
    id,
    onError: onErrorNotification
  });

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={<Button onClick={handleCancel}> Close </Button>}>
      <Spin spinning={isLoading}>
        <div className={styles.media}>
          {attachmentsData?.map((data: Attachments, index: number) => (
            <RenderMedia key={index} url={data?.url} />
          ))}
        </div>
      </Spin>
    </Modal>
  );
};

export default ComplaintsMediaPreviewModal;

export interface Attachments {
  attachment_id: number;
  url: string;
}
