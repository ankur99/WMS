import { Button, Form, Modal, Spin } from "antd";

import { RowShowInputTypes } from "../../types/updateStoreTypes";
import EditableRowShow from "../Stores/EditableRowShow";
import { onErrorNotification } from "../../utils/helperFunctions";
import { useAuditReasons } from "../../hooks/Audit/useRQAudits";
import {
  AuditReasonsAllData,
  AuditReasonsType,
  AuditType,
  CreateAuditFormProps,
  DisputeListAuditCreateFormProps
} from "../../types/auditTypes";
import { getAuditReasonsWithIdName } from "../Audit/auditUtils";

interface DisputeListCreateAuditModalProps {
  visible: boolean;
  handleOk: (data: DisputeListAuditCreateFormProps) => void;
  handleCancel: () => void;
  loading: boolean;
  title: string;
}

const DisputeListCreateAuditModal = ({
  visible,
  handleOk,
  handleCancel,
  loading,
  title
}: DisputeListCreateAuditModalProps) => {
  const {
    isLoading: auditCreateReasonLoading,
    data: auditCreateReasonData
  }: {
    isLoading: boolean;
    data: AuditReasonsAllData | undefined;
  } = useAuditReasons({
    onError: onErrorNotification,
    reasonType: AuditReasonsType.create
  });

  const onFinish = (values: CreateAuditFormProps) => {
    console.log({ values });

    const payload = {
      audit_name: values?.audit_name,
      audit_type: values?.audit_type,
      reason_id: values?.audit_reason,
      auto_settle: values?.auto_settle ? 1 : 0
    };

    handleOk(payload);
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      destroyOnClose={true}
      footer={null}>
      <Spin spinning={loading || auditCreateReasonLoading}>
        <Form
          name="create_audit_modal"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ auto_settle: true }}>
          <EditableRowShow
            label={"AUDIT NAME"}
            id={"audit_name"}
            type={RowShowInputTypes.TEXT}
            labelToShow={true}
            marginBottom={true}
          />
          <EditableRowShow
            label="REASON FOR AUDIT"
            id="audit_reason"
            type={RowShowInputTypes.SINGLE_SELECT}
            labelToShow={true}
            marginBottom={true}
            arrayData={getAuditReasonsWithIdName(auditCreateReasonData)}
          />
          <EditableRowShow
            label="SELECT AUDIT TYPE"
            id="audit_type"
            type={RowShowInputTypes.RADIO_BUTTON}
            labelToShow={true}
            marginBottom={true}
            arrayData={[
              { id: AuditType.ProductId as number, name: AuditType.Product as string },
              { id: AuditType.LocationId as number, name: AuditType.Location as string },
              {
                id: AuditType.Shelf_Life_Product_Id as number,
                name: AuditType.Shelf_Life_Product as string
              },
              {
                id: AuditType.Shelf_Life_Location_Id as number,
                name: AuditType.Shelf_Life_Location as string
              }
            ]}
          />
          <EditableRowShow
            label={"AUTO SETTLE AUDIT"}
            labelToShow={true}
            id={"auto_settle"}
            type={RowShowInputTypes.TAG}
            marginBottom={true}
          />
          <Form.Item>
            <Button htmlType="submit" type="primary" block>
              Create Audit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default DisputeListCreateAuditModal;
