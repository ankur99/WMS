import { Button, Form, Modal, Select, Space } from "antd";
import { useState } from "react";
import { useUploadPodImages, useUploadPodImagesStore } from "../../hooks/useRQStores";
import { ReasonTypes } from "../../types/podTypes";
import { FileUploadButtonType } from "../../types/updateStoreTypes";
import { showSuccessToast, showErrorToast } from "../../utils/helperFunctions";
import FileUploadMultiple from "../FileUploadMultiple";

const maxFileSize = 1024 * 1024 * 10; // 10mb
const acceptedFiles = "image/jpg,image/png,image/gif,image/jpeg,image/webp,application/pdf";
const { Option } = Select;

interface UploadImagesPodTypes {
  visible: boolean;
  setUploadStorePodModalVisible: (arg0: boolean) => void;
  handleCancel: () => void;
  shipment_id?: string;
}

const UploadImagesPOD = ({
  visible,
  handleCancel,
  shipment_id,
  setUploadStorePodModalVisible
}: UploadImagesPodTypes) => {
  const [form] = Form.useForm();
  const [uploadFiles, setUploadFiles] = useState<File[] | undefined>();

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    form.resetFields();
    setUploadStorePodModalVisible(false);
  };

  const { isLoading: uploadImagesLoading, mutate: uploadImages } = useUploadPodImages({
    onSuccess: onSuccess,
    onError: showErrorToast
  });
  const { isLoading: uploadStoreImagesLoading, mutate: uploadImagesStore } =
    useUploadPodImagesStore({
      onSuccess: onSuccess,
      onError: showErrorToast
    });

  const handleMultipleFileUpload = ({
    // id,
    // multipleParams,
    files
  }: {
    // id: string;
    // multipleParams: DocFileType[];
    files: File[];
  }) => {
    setUploadFiles(files);
  };

  const onFinish = (values: { reason: string }) => {
    const formData = new FormData();

    if (Array.isArray(uploadFiles)) {
      for (let i = 0; i < uploadFiles?.length; i++) {
        formData.append("pod_images", uploadFiles[i]);
      }
    }

    formData.append("reason", values?.reason);

    if (shipment_id) {
      uploadImagesStore({ id: shipment_id, payload: formData });
    }
    if (!shipment_id) {
      uploadImages(formData);
    }
  };

  return (
    <Modal title="Upload POD" visible={visible} onCancel={handleCancel} footer={null}>
      <Form form={form} name="upload-pod" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="reason"
          rules={[{ required: true, message: "Missing Team Type" }]}
          label="Reason">
          <Select placeholder="Select Reason For Upload">
            <Option value={ReasonTypes.NOT_UPLOADED}>{ReasonTypes.NOT_UPLOADED}</Option>
            <Option value={ReasonTypes.NOT_CLEAR}>{ReasonTypes.NOT_CLEAR}</Option>
          </Select>
        </Form.Item>
        <Space wrap>
          <FileUploadMultiple
            id="images-pod"
            buttonType={FileUploadButtonType.NEW}
            handleMultipleFileUpload={handleMultipleFileUpload}
            maxFileSizeInBytesAllowed={maxFileSize}
            accept={acceptedFiles}
          />
        </Space>

        <Form.Item style={{ marginTop: "1rem" }}>
          <Button
            htmlType="submit"
            type="primary"
            loading={uploadImagesLoading || uploadStoreImagesLoading}>
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadImagesPOD;
