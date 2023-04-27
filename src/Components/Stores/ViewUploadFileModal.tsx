import { Modal } from "antd";

import {
  AllowedFileTypes,
  RenderFile
  // FileComingFrom
} from "../../types/updateStoreTypes";

interface ViewUploadFileModalProps {
  visible: boolean;
  handleCancel: () => void;
  fileData: RenderFile;
}

const ViewUploadFileModal = ({ visible, handleCancel, fileData }: ViewUploadFileModalProps) => {
  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={fileData?.fileName || ""}
      // onOk={handleOk}
      // onFinish={handleFinish}
      onCancel={handleCancel}
      footer={null}>
      {fileData.fileType === AllowedFileTypes.IMAGE && (
        <div style={{ padding: "1rem", objectFit: "cover" }}>
          <img
            src={fileData.url as string}
            alt="file"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </div>
      )}

      {fileData.fileType === AllowedFileTypes.PDF && (
        <iframe
          src={fileData.url as string}
          title="PDF File"
          style={{ minHeight: "70vh", width: "95%" }}>
          Presss me:
          <a href={fileData.url as string}>Download PDF</a>
        </iframe>
      )}
    </Modal>
  );
};

export default ViewUploadFileModal;
