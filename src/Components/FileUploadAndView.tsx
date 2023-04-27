import { Space, Button } from "antd";
import { DocFileType, FileUploadButtonType } from "../types/updateStoreTypes";
import FileUpload from "./FileUpload";

interface UploadDocProps {
  id: string;
  handleFileUpload: ({
    id,
    fileParams,
    file
  }: {
    id: string;
    fileParams: DocFileType;
    file: File;
  }) => void;
  handleView: (id: string, url?: string | null) => void;
  handleDeleteFiles: (id: string) => void;
  fileName: string;
  acceptedFiles: string;
  url?: string | null;
}

const FileUploadAndView = ({
  id,
  handleFileUpload,
  handleView,
  // handleDeleteFiles,
  fileName,
  acceptedFiles,
  url
}: UploadDocProps) => {
  return (
    <Space wrap>
      <FileUpload
        id={id}
        buttonType={FileUploadButtonType.UPDATE}
        handleFileUpload={handleFileUpload}
        accept={acceptedFiles}
      />
      <Button type="primary" onClick={() => handleView(id, url)}>
        View
      </Button>
      {/* <Button
          danger
          type="primary"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteFiles(id)}
        /> */}
      <h5 style={{ marginBottom: 0, wordBreak: "normal" }}>{fileName}</h5>
    </Space>
  );
};

export default FileUploadAndView;
