import { useState, useEffect, useRef, MutableRefObject } from "react";

import { Row, Col, Typography, Descriptions, Button, Tooltip, Spin, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import Paper from "../../common/Paper";
import FileUpload from "../../FileUpload";
import {
  AllowedFileTypes,
  BusinessDocumentData,
  BusinessDocumentDataNew,
  DocFileType,
  FileUploadButtonType,
  RenderFile
} from "../../../types/updateStoreTypes";
import ViewUploadFileModal from "../ViewUploadFileModal";
import { businessDocumentsInfo, tenMb } from "../../../utils/constants";
import {
  useBusinessDocumentsData,
  useUploadBusinessDocuments
} from "../../../hooks/useRQUpdateStore";
import { onError, showSuccessToast } from "../../../utils/helperFunctions";
import RedStar from "../../RedStar";
import FileUploadAndView from "../../FileUploadAndView";

const { Title } = Typography;
const acceptedFileTypes = "image/*,.pdf";

const BusinessDocuments = ({ storeId }: { storeId: number }) => {
  const [documents, setDocuments] = useState<BusinessDocumentData>();
  const [viewFile, setViewFile] = useState(false);
  const fileViewRef = useRef() as MutableRefObject<RenderFile>;

  const { isLoading, data: businessDocumentsData } = useBusinessDocumentsData({ storeId, onError });
  const { isLoading: mutationLoading, mutate: sendFileToBackend } = useUploadBusinessDocuments({
    onError,
    onSuccess: showSuccessToast
  });

  useEffect(() => {
    if (businessDocumentsData && Object.keys(businessDocumentsData).length > 0) {
      setDocuments(businessDocumentsData);
    }
  }, [businessDocumentsData]);

  const handleFileUpload = ({
    id,
    // fileParams,
    file
  }: {
    id: string;
    // fileParams: DocFileType;
    file: File;
  }) => {
    // const tempData = { ...documents };
    // tempData[id as keyof BusinessDocumentDataNew] = {
    //   ...fileParams
    // };

    // setDocuments(tempData as BusinessDocumentData);

    //this step not needed as if successfully uploaded then it will be addede to the list
    uploadFileToBackend(id, file);
  };

  const handleDeleteFiles = (id: string) => {
    const tempData = { ...documents };
    tempData[id as keyof BusinessDocumentDataNew] = {
      url: null,
      fileType: null,
      fileComingFrom: null,
      fileName: null
    };

    setDocuments(tempData as BusinessDocumentData);
  };

  const handleView = (id: string) => {
    setViewFile(true);
    if (documents) {
      // fileViewRef.current = documents[id as keyof BusinessDocumentDataNew];
      fileViewRef.current = {
        fileType: documents[id as keyof BusinessDocumentDataNew]?.fileType as AllowedFileTypes,
        url: documents[id as keyof BusinessDocumentDataNew]?.url as string,
        fileName: documents[id as keyof BusinessDocumentDataNew]?.fileName as string
      };
    }
  };

  const uploadFileToBackend = (id: string, file: File) => {
    //call the api to upload the file
    const formData = new FormData();
    const stripped_id = id.replace("_document", "");

    formData.append("document", file);
    formData.append("type", stripped_id);
    sendFileToBackend({
      storeId,
      payload: formData
    });

    //call the react query mutate function
  };

  return (
    <Spin spinning={isLoading || mutationLoading}>
      <Paper>
        <Row>
          <Col xs={24} style={{ display: "flex" }}>
            <Title level={3}>Business Documents</Title>
            <Tooltip
              title={
                <ul style={{ paddingLeft: "1rem" }}>
                  {businessDocumentsInfo.map((info, index) => (
                    <li key={index}>{info}</li>
                  ))}
                </ul>
              }
              color="gold">
              <Button icon={<QuestionCircleOutlined />} type="text" />
            </Tooltip>
          </Col>
        </Row>
        <Descriptions title="" bordered className="ant-desc">
          <Descriptions.Item label={"Owner's PAN Card"} span={3}>
            {/* <Spin spinning={uploadLoader.pan_document}> */}
            {documents?.pan_document?.url ? (
              <FileUploadAndView
                id="pan_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.pan_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="pan_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
            {/* </Spin> */}
          </Descriptions.Item>

          <Descriptions.Item label={"Aadhar Card Front"} span={3}>
            {documents?.aadhar_front_document?.url ? (
              <FileUploadAndView
                id="aadhar_front_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.aadhar_front_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="aadhar_front_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label={"Aadhar Card Back"} span={3}>
            {documents?.aadhar_back_document?.url ? (
              <FileUploadAndView
                id="aadhar_back_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.aadhar_back_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="aadhar_back_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
        </Descriptions>
        <h3 style={{ color: "deeppink", marginTop: "2rem", marginBottom: "0.5rem" }}>
          Note : Below are the compulsory business ID. Need atleast one of the following business
          ID.
        </h3>
        <Descriptions title="" bordered className="ant-desc">
          <Descriptions.Item
            label={
              <>
                GSTIN
                <RedStar />
              </>
            }
            span={3}>
            {documents?.gstin_number_document?.url ? (
              <FileUploadAndView
                id="gstin_number_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.gstin_number_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="gstin_number_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                Business PAN
                <RedStar />
              </>
            }
            span={3}>
            {documents?.business_pan_document?.url ? (
              <FileUploadAndView
                id="business_pan_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.business_pan_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="business_pan_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                Shop & Establishment certificate
                <RedStar />
              </>
            }
            span={3}>
            {documents?.shop_establishment_act_document?.url ? (
              <FileUploadAndView
                id="shop_establishment_act_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.shop_establishment_act_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="shop_establishment_act_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                FSSAI license
                <RedStar />
              </>
            }
            span={3}>
            {documents?.fssai_license_document?.url ? (
              <FileUploadAndView
                id="fssai_license_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.fssai_license_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="fssai_license_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                Trade License
                <RedStar />
              </>
            }
            span={3}>
            {documents?.trade_license_document?.url ? (
              <FileUploadAndView
                id="trade_license_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.trade_license_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="trade_license_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                Udyog Aadhar/Udhayam Registration
                <RedStar />
              </>
            }
            span={3}>
            {documents?.udyog_aadhar_document?.url ? (
              <FileUploadAndView
                id="udyog_aadhar_document"
                handleFileUpload={handleFileUpload}
                handleView={handleView}
                handleDeleteFiles={handleDeleteFiles}
                fileName={documents?.udyog_aadhar_document?.fileName || ""}
                acceptedFiles={acceptedFileTypes}
              />
            ) : (
              <FileUpload
                id="udyog_aadhar_document"
                buttonType={FileUploadButtonType.NEW}
                handleFileUpload={handleFileUpload}
                maxFileSizeInBytesAllowed={tenMb}
                accept={acceptedFileTypes}
              />
            )}
          </Descriptions.Item>
        </Descriptions>
        {fileViewRef.current && (
          <ViewUploadFileModal
            visible={viewFile}
            handleCancel={() => setViewFile(false)}
            fileData={fileViewRef.current}
          />
        )}
      </Paper>
    </Spin>
  );
};

export default BusinessDocuments;

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
  handleView: (id: string) => void;
  handleDeleteFiles: (id: string) => void;
  fileName: string;
}

const UploadedDoc = ({
  id,
  handleFileUpload,
  handleView,
  // handleDeleteFiles,
  fileName
}: UploadDocProps) => {
  return (
    <Space wrap>
      <FileUpload
        id={id}
        buttonType={FileUploadButtonType.UPDATE}
        handleFileUpload={handleFileUpload}
        maxFileSizeInBytesAllowed={tenMb}
        accept={acceptedFileTypes}
      />
      <Button type="primary" onClick={() => handleView(id)}>
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
