import { Modal, Spin, Table } from "antd";
import { useAuditReportExpiry } from "../../../hooks/Audit/useRQAuditReport";
import { AuditReportExpiryData } from "../../../types/auditTypes";
import { formatDate } from "../../../utils/constants";
import { onErrorNotification } from "../../../utils/helperFunctions";

interface ExpiryModalProps {
  productId: number;
  storageId: string;
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const { Column } = Table;

const ExpiryModal = ({ productId, storageId, visible, handleCancel }: ExpiryModalProps) => {
  const {
    isLoading: expiryLoading,
    data: expiryData
  }: {
    isLoading: boolean;
    data: AuditReportExpiryData | undefined;
  } = useAuditReportExpiry({
    onError: onErrorNotification,
    productId,
    storageId
  });

  return (
    <Modal title="Audit Report Expiry" visible={visible} onCancel={handleCancel} footer={null}>
      <Table
        dataSource={expiryData}
        pagination={false}
        rowKey="expiry_date"
        loading={expiryLoading}>
        <Column
          key={"expiry_date"}
          dataIndex={"expiry_date"}
          title={"Expiry Date"}
          render={(value) => {
            return formatDate(value);
          }}
        />
        <Column key={"quantity"} dataIndex={"quantity"} title={"Quantity"} />
      </Table>
      <Spin spinning={expiryLoading}></Spin>
    </Modal>
  );
};

export default ExpiryModal;
