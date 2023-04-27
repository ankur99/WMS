import { Button, Form, Modal, Spin } from "antd";
import { useAuditReasons } from "../../../hooks/Audit/useRQAudits";
import { AuditReasonsAllData, AuditReasonsType } from "../../../types/auditTypes";
import { RowShowInputTypes } from "../../../types/updateStoreTypes";
import { onErrorNotification } from "../../../utils/helperFunctions";
import { getAuditReasonsWithIdName } from "../../Audit/auditUtils";
import EditableRowShow from "../../Stores/EditableRowShow";

interface SettleAuditModalProps {
  id: number;
  visible: boolean;
  handleOk: (payload: { audit_item_id: number | undefined; reason_id?: number }) => void;
  handleCancel: () => void;
  loading: boolean;
  auditReasonType: AuditReasonsType | null;
}

const SettleAuditModal = ({
  id,
  visible,
  handleOk,
  handleCancel,
  loading,
  auditReasonType
}: SettleAuditModalProps) => {
  const {
    isLoading: auditReasonLoading,
    data: auditCancelReasonData
  }: {
    isLoading: boolean;
    data: AuditReasonsAllData | undefined;
  } = useAuditReasons({
    onError: onErrorNotification,
    reasonType: auditReasonType
  });

  const onFinish = (values: { reason_id: number }) => {
    handleOk({
      reason_id: values?.reason_id,
      audit_item_id: id
    });
  };

  return (
    <Modal title="Reason for Audit Settle" visible={visible} onCancel={handleCancel} footer={null}>
      <Spin spinning={loading || auditReasonLoading}>
        <Form name="audit_settle_reason" onFinish={onFinish} layout={"vertical"}>
          <EditableRowShow
            label="REASON FOR SETTLE"
            id="reason_id"
            type={RowShowInputTypes.SINGLE_SELECT}
            labelToShow={true}
            marginBottom={true}
            arrayData={getAuditReasonsWithIdName(auditCancelReasonData)}
          />
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Settle Audit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default SettleAuditModal;
