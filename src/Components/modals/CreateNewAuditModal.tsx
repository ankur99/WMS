import { useState } from "react";

import { Button, Form, Modal, Space, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { DocFileType, FileUploadButtonType, RowShowInputTypes } from "../../types/updateStoreTypes";
import EditableRowShow from "../Stores/EditableRowShow";
import {
  downloadCSVFile,
  onErrorNotification,
  showErrorNotification,
  showSuccessToast
} from "../../utils/helperFunctions";
import FileUpload from "../FileUpload";
import { useCreateAudit, useAuditReasons } from "../../hooks/Audit/useRQAudits";
import {
  AuditReasonsAllData,
  AuditReasonsType,
  AuditType,
  CreateAuditFormProps
} from "../../types/auditTypes";
import { getAuditReasonsWithIdName } from "../Audit/auditUtils";
import { tenMb } from "../../utils/constants";

const acceptedFiles = ".csv";
const sampleProductIds = ["224", "200", "192"];
const sampleStorageLabels = ["L0-A24-SLTD-R30-S2", "L0-A26-SLTD-R16-S6", "L0-A23-SLTD-R07-S2"];

interface CreateNewAuditModalProps {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const CreateNewAuditModal = ({ visible, handleOk, handleCancel }: CreateNewAuditModalProps) => {
  const [storedFile, setStoredFile] = useState<{ url: string; file: File } | null>();

  const [form] = Form.useForm<CreateAuditFormProps>();
  const auditTypeValue = Form.useWatch("audit_type", form);

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

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    handleOk();
  };

  const { isLoading, mutate: createAudit } = useCreateAudit({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: CreateAuditFormProps) => {
    // console.log({ values });

    if (!storedFile || !storedFile.file) {
      showErrorNotification({ msg: "Error", desc: "Please upload the file" });
      return;
    }

    const formData = new FormData();
    formData.append("input", storedFile.file);
    formData.append("name", values?.audit_name);
    formData.append("type", values?.audit_type.toString());
    formData.append("reason_id", values?.audit_reason.toString());
    formData.append("auto_settle", values?.auto_settle ? "1" : "0");

    createAudit(formData);
  };

  const handleFileUpload = ({
    id,
    file,
    fileParams
  }: {
    id: string;
    file: File;
    fileParams: DocFileType;
  }) => {
    console.log({ id, file });
    setStoredFile({
      url: fileParams?.url as string,
      file: file
    });
  };

  const exportToCsv = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    if (auditTypeValue === undefined || auditTypeValue === null) {
      showErrorNotification({ msg: "Error", desc: "Please first Select Audit Type" });
      return;
    }

    // Product Type Audit
    if (auditTypeValue === 0 || auditTypeValue === 2) {
      downloadCSVFile({
        data: [...sampleProductIds].join("\n"),
        fileName: "sampleProductIds.csv",
        fileType: "text/csv"
      });
    }

    // Storage Type Audit
    if (auditTypeValue === 1 || auditTypeValue === 3) {
      downloadCSVFile({
        data: [...sampleStorageLabels].join("\n"),
        fileName: "sampleStorageLabels.csv",
        fileType: "text/csv"
      });
    }
  };

  return (
    <Modal
      title="Create Audit"
      visible={visible}
      onCancel={handleCancel}
      destroyOnClose={true}
      footer={null}>
      <Spin spinning={isLoading || auditCreateReasonLoading}>
        <Form
          form={form}
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
          {(auditTypeValue === 0 || auditTypeValue === 2) && (
            <h4>NOTE: Upload CSV containing Product Ids</h4>
          )}
          {(auditTypeValue === 1 || auditTypeValue === 3) && (
            <h4>NOTE: Upload CSV containing Storage Labels</h4>
          )}
          <Space>
            <Button type="default" icon={<DownloadOutlined />} onClick={exportToCsv}>
              Download Sample CSV
            </Button>
            <FileUpload
              id={"csv_document"}
              buttonType={storedFile?.url ? FileUploadButtonType.UPDATE : FileUploadButtonType.NEW}
              handleFileUpload={handleFileUpload}
              accept={acceptedFiles}
              maxFileSizeInBytesAllowed={tenMb}
            />
          </Space>
          {storedFile?.url && storedFile?.file?.name && <h4>{storedFile?.file?.name}</h4>}
          <Form.Item>
            <Button htmlType="submit" type="primary" block className="m2-t">
              Create Audit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CreateNewAuditModal;
