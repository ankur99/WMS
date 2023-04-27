import { Button, Form, Modal, Spin } from "antd";
import { useAuditReasons } from "../../../hooks/Audit/useRQAudits";
import { AuditReasonsAllData, AuditReasonsType } from "../../../types/auditTypes";
import { RowShowInputTypes } from "../../../types/updateStoreTypes";
import { onErrorNotification, showSuccessToast } from "../../../utils/helperFunctions";
import { getAuditReasonsWithIdName } from "../../Audit/auditUtils";
import EditableRowShow from "../../Stores/EditableRowShow";

import { useAuditCancel, useAuditItemsCancel } from "../../../hooks/Audit/useRQAuditView";

interface CancelAuditModalProps {
  id: number;
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  cancelType:
    | "Audit"
    | "SingleAuditItem"
    | {
        type: "BulkAuditItems";
        auditItemIds: number[];
      };
}

const CancelAuditModal = ({
  id,
  visible,
  handleOk,
  handleCancel,
  cancelType
}: CancelAuditModalProps) => {
  const {
    isLoading: auditCancelReasonLoading,
    data: auditCancelReasonData
  }: {
    isLoading: boolean;
    data: AuditReasonsAllData | undefined;
  } = useAuditReasons({
    onError: onErrorNotification,
    reasonType: AuditReasonsType.cancel
  });

  const onSuccess = () => {
    if (cancelType === "Audit") {
      showSuccessToast("Audit Cancelled Successfully");
      handleCancel();
      return;
    }

    if (cancelType === "SingleAuditItem") {
      showSuccessToast("Audit Item Cancelled Successfully");
      handleCancel();
      return;
    }

    if (cancelType?.type === "BulkAuditItems") {
      showSuccessToast("Multiple Audit Items Cancelled Successfully");
      handleOk();
      return;
    }
  };

  const { isLoading: cancelAuditLoading, mutate: cancelAudit } = useAuditCancel({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const { isLoading: cancelAuditItemsLoading, mutate: cancelAuditItems } = useAuditItemsCancel({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: { reason_id: number }) => {
    if (cancelType === "Audit") {
      cancelAudit({
        audit_id: id,
        reason_id: values?.reason_id
      });
    } else if (cancelType === "SingleAuditItem") {
      cancelAuditItems({
        reason_id: values?.reason_id,
        audit_item_ids: [id]
      });
    } else if (cancelType?.type === "BulkAuditItems") {
      cancelAuditItems({
        reason_id: values?.reason_id,
        audit_item_ids: cancelType?.auditItemIds
      });
    }
  };

  return (
    <Modal
      title="Reason for Audit Cancellation"
      visible={visible}
      onCancel={handleCancel}
      footer={null}>
      <Spin spinning={auditCancelReasonLoading || cancelAuditLoading || cancelAuditItemsLoading}>
        <Form name="audit_cancel_reason" onFinish={onFinish} layout={"vertical"}>
          <EditableRowShow
            label="REASON FOR CANCEL"
            id="reason_id"
            type={RowShowInputTypes.SINGLE_SELECT}
            labelToShow={true}
            marginBottom={true}
            arrayData={getAuditReasonsWithIdName(auditCancelReasonData)}
          />
          <Form.Item>
            <Button htmlType="submit" type="primary" block danger>
              Cancel Audit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CancelAuditModal;
