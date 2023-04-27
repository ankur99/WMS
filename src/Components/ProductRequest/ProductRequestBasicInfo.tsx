import { Button, Col, Descriptions, Form, Row, Spin, Typography } from "antd";
import EditableRowShow from "../Stores/EditableRowShow";
import {
  AllowedFileTypes,
  DocFileType,
  FileUploadButtonType,
  RenderFile,
  RowShowInputTypes
} from "../../types/updateStoreTypes";
// import "easymde/dist/easymde.min.css";
import Paper from "../common/Paper";
// import { useEffect, useState } from "react";
import {
  ProductRequesImageKeys,
  ProductRequestBasic,
  ProductRequestComingFrom
} from "../../types/productRequestTypes";
import { ActualUomTypes } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getQueryValueFromKeyParams,
  onErrorNotification,
  showErrorNotification,
  showErrorToast,
  showSuccessToast
} from "../../utils/helperFunctions";
import {
  useCreateProductRequest,
  useUpdateProductRequestDetails
} from "../../hooks/useRQProductRequest";
import FileUpload from "../FileUpload";
import FileUploadAndView from "../FileUploadAndView";
import RedStar from "../RedStar";
import ViewUploadFileModal from "../Stores/ViewUploadFileModal";
import { MutableRefObject, useRef, useState } from "react";
import { patternRegex } from "../../utils/regexValues";

const { Title } = Typography;

interface BasicInfoProps {
  comingFrom: ProductRequestComingFrom;
  productRequestData?: ProductRequestBasic | undefined;
  productRequestId?: string;
  editPermission?: boolean;
}

const acceptedFiles = "image/jpg,image/png,image/gif,image/jpeg,image/webp";

const ProductRequestBasicInfo = ({
  comingFrom,
  productRequestData,
  productRequestId,
  editPermission
}: BasicInfoProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { search } = useLocation();

  // storing images to send to backend
  const [storedFiles, setStoreFiles] = useState<Record<string, { url: string; file: File } | null>>(
    {
      image_front: null,
      image_back: null,
      mrp_details: null,
      marketer_details: null,
      fssai_license: null
    }
  );

  const onSuccess = (productRequestId: number, comingFrom: ProductRequestComingFrom) => {
    form.resetFields();
    if (comingFrom === ProductRequestComingFrom.CREATE) {
      showSuccessToast("Product Request has been created successfully");
      if (productRequestId) {
        // redirecting to 2nd tab of update product
        navigate(`/home/products/product-request/${productRequestId}?key=1`);
      }
      return;
    }
    // for update
    showSuccessToast("Product Request Basic Info has been updated successfully");
  };

  const { isLoading: createLoading, mutate: createProductRequest } = useCreateProductRequest({
    onError: onErrorNotification,
    onSuccess
  });

  const { isLoading: updateLoading, mutate: updateProductRequest } = useUpdateProductRequestDetails(
    {
      onError: onErrorNotification,
      onSuccess
    }
  );

  const onFinish = (values: ProductRequestBasic) => {
    // console.log({ values, storedFiles });
    //check whether all images are present or not, if not show error.

    // since fssai licence is not compulsory, we dont to check for that
    const storedFilesWithoutFssai = { ...storedFiles };
    delete storedFilesWithoutFssai["fssai_license"];

    const anyImageNotPresent = Object.keys(storedFilesWithoutFssai).every((file) => {
      return storedFilesWithoutFssai[file] !== null;
    });
    if (!anyImageNotPresent && comingFrom === ProductRequestComingFrom.CREATE) {
      showErrorNotification({ msg: "Error", desc: "Please upload all images" });
      return;
    }

    // appending images
    const formData = new FormData();
    formData.append("images[]", storedFiles.image_front?.file || "");
    formData.append("images[]", storedFiles.image_back?.file || "");
    formData.append("images[]", storedFiles.mrp_details?.file || "");
    formData.append("images[]", storedFiles.marketer_details?.file || "");
    formData.append("images[]", storedFiles.fssai_license?.file || "");

    const payload = { ...values };
    console.log("******", payload);

    if (comingFrom === ProductRequestComingFrom.CREATE) {
      // for create, if auto assign barcode, then send 1 or 0, and if auto assign selected, then dont send barcode.
      // check whether all images are present or not, if not show error.
      if (payload.auto_assign_barcode === true) {
        delete payload.barcode;
        payload.auto_assign_barcode = 1;
      } else {
        payload.auto_assign_barcode = 0;
      }
      // create page is coming from the redirection of old panel, then we will also have to send source_id and source
      if (search) {
        const source_id = getQueryValueFromKeyParams({ search, key: "source_id" });
        const source = getQueryValueFromKeyParams({ search, key: "source" });

        if (source_id) {
          payload.source_id = +source_id;
        }

        if (source) {
          payload.source = source;
        }
      }
      // modifying payload and sending as formdata
      for (const item in payload) {
        if (payload[item as keyof ProductRequestBasic]) {
          formData.append(item, payload[item as keyof ProductRequestBasic] as string);
        }
      }
      createProductRequest(formData);
    } else if (comingFrom === ProductRequestComingFrom.UPDATE) {
      if (!payload.auto_assign_barcode && !payload.barcode) {
        showErrorToast("Please enter a barcode");
        return;
      }

      if (payload.barcode) {
        formData.append("barcode", payload.barcode);
      }

      if (!payload.outer_units) {
        formData.append("outer_units", "0");
      }
      if (payload.outer_units) {
        formData.append("outer_units", payload.outer_units.toString());
      }
      if (!payload.case_units) {
        formData.append("case_units", "0");
      }
      if (payload.case_units) {
        formData.append("case_units", payload.case_units.toString());
      }
      formData.append("name", payload.name);
      productRequestId && updateProductRequest({ productRequestId, payload: formData });
    }
  };

  const autoAssignBarcodeValue = Form.useWatch("auto_assign_barcode", form);

  const [viewFile, setViewFile] = useState(false);
  const fileViewRef = useRef() as MutableRefObject<RenderFile>;

  const handleFileStore = ({
    id,
    file,
    fileParams
  }: {
    id: string;
    file: File;
    fileParams: DocFileType;
  }) => {
    // console.log({ id, file });
    setStoreFiles((prev) => {
      return {
        ...prev,
        [id]: {
          url: fileParams?.url as string,
          file: file
        }
      };
    });

    // fileViewRef.current = {
    //   fileType: AllowedFileTypes.IMAGE,
    //   url: fileParams.url as string,
    //   fileName: ""
    // };

    // setViewFile(true);
  };

  const handleView = (id: string, url?: string | null) => {
    fileViewRef.current = {
      fileType: AllowedFileTypes.IMAGE,
      url: url as string,
      fileName: ""
    };
    setViewFile(true);
  };

  return (
    <Spin spinning={createLoading || updateLoading}>
      <Paper>
        <Form
          initialValues={productRequestData}
          form={form}
          name="product_request_form"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Row gutter={24}>
            <Col xs={12}>
              <Title level={3}>Basic Info</Title>
            </Col>
            <Col xs={12} style={{ textAlign: "right" }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button htmlType="submit" type="primary" size="small">
                  Save
                </Button>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <EditableRowShow
                label={"PRODUCT NAME"}
                id="name"
                type={RowShowInputTypes.TEXT}
                labelToShow={true}
                marginBottom={true}
                disabled={comingFrom === ProductRequestComingFrom.UPDATE}
                required={comingFrom === ProductRequestComingFrom.UPDATE ? false : true}
              />
            </Col>

            {comingFrom === ProductRequestComingFrom.CREATE && (
              <>
                <Col sm={8} xs={12}>
                  <EditableRowShow
                    label={"AUTO ASSIGN BARCODE"}
                    id={"auto_assign_barcode"}
                    type={RowShowInputTypes.CHECKBOX}
                    labelToShow={true}
                    marginBottom={false}
                    required={false}
                  />
                </Col>
                <Col sm={8} xs={12}>
                  <EditableRowShow
                    label="BARCODE"
                    id="barcode"
                    type={RowShowInputTypes.TEXT}
                    labelToShow={true}
                    marginBottom={true}
                    disabled={autoAssignBarcodeValue === true ? true : false}
                    required={autoAssignBarcodeValue === true ? false : true}
                  />
                </Col>
              </>
            )}

            {comingFrom === ProductRequestComingFrom.UPDATE && (
              <Col span={24}>
                <EditableRowShow
                  label="BARCODE"
                  id="barcode"
                  type={RowShowInputTypes.TEXT}
                  labelToShow={true}
                  marginBottom={true}
                  // disabled={comingFrom === ProductRequestComingFrom.UPDATE}
                  disabled={checkBarcodeDisable({
                    auto_assign_barcode: productRequestData?.auto_assign_barcode,
                    editPermission
                  })}
                  required={false}
                />
              </Col>
            )}

            <Col sm={8} xs={12}>
              <EditableRowShow
                label="UOM"
                id="uom"
                type={RowShowInputTypes.SINGLE_SELECT}
                labelToShow={true}
                marginBottom={true}
                arrayData={[
                  { id: ActualUomTypes.pc, name: ActualUomTypes.pc },
                  { id: ActualUomTypes.kg, name: ActualUomTypes.kg },
                  { id: ActualUomTypes.l, name: ActualUomTypes.l },
                  { id: ActualUomTypes.m, name: ActualUomTypes.m },
                  { id: ActualUomTypes.ea, name: ActualUomTypes.ea }
                ]}
                disabled={comingFrom === ProductRequestComingFrom.UPDATE && editPermission !== true}
                required={comingFrom === ProductRequestComingFrom.UPDATE ? false : true}
              />
            </Col>
            <Col sm={8} xs={12}>
              <EditableRowShow
                label="Outer Quantity"
                id="outer_units"
                type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                labelToShow={true}
                marginBottom={true}
                required={false}
                disabled={comingFrom === ProductRequestComingFrom.UPDATE && editPermission !== true}
                pattern={patternRegex.wholePositive}
              />
            </Col>
            <Col sm={8} xs={12}>
              <EditableRowShow
                label="Case Quantity"
                id="case_units"
                type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                labelToShow={true}
                marginBottom={true}
                required={false}
                disabled={comingFrom === ProductRequestComingFrom.UPDATE && editPermission !== true}
                pattern={patternRegex.wholePositive}
              />
            </Col>
          </Row>
          <Descriptions title="" bordered className="ant-desc">
            <Descriptions.Item
              label={
                <>
                  Front Product Image
                  <RedStar />
                </>
              }
              span={3}>
              {productRequestData?.image_front || storedFiles?.image_front?.url ? (
                <FileUploadAndView
                  id={ProductRequesImageKeys.FRONT}
                  handleFileUpload={handleFileStore}
                  handleView={handleView}
                  handleDeleteFiles={() => console.log("delete")}
                  fileName=""
                  acceptedFiles={acceptedFiles}
                  url={storedFiles?.image_front?.url || productRequestData?.image_front}
                />
              ) : (
                <FileUpload
                  id={ProductRequesImageKeys.FRONT}
                  buttonType={FileUploadButtonType.NEW}
                  handleFileUpload={handleFileStore}
                  accept={acceptedFiles}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  Back Product Image
                  <RedStar />
                </>
              }
              span={3}>
              {productRequestData?.image_back || storedFiles?.image_back?.url ? (
                <FileUploadAndView
                  id={ProductRequesImageKeys.BACK}
                  handleFileUpload={handleFileStore}
                  handleView={handleView}
                  handleDeleteFiles={() => console.log("delete")}
                  fileName=""
                  acceptedFiles={acceptedFiles}
                  url={storedFiles?.image_back?.url || productRequestData?.image_back}
                />
              ) : (
                <FileUpload
                  id={ProductRequesImageKeys.BACK}
                  buttonType={FileUploadButtonType.NEW}
                  handleFileUpload={handleFileStore}
                  accept={acceptedFiles}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  MRP Details
                  <RedStar />
                </>
              }
              span={3}>
              {productRequestData?.mrp_details || storedFiles?.mrp_details?.url ? (
                <FileUploadAndView
                  id={ProductRequesImageKeys.MRP}
                  handleFileUpload={handleFileStore}
                  handleView={handleView}
                  handleDeleteFiles={() => console.log("delete")}
                  fileName=""
                  acceptedFiles={acceptedFiles}
                  url={storedFiles?.mrp_details?.url || productRequestData?.mrp_details}
                />
              ) : (
                <FileUpload
                  id={ProductRequesImageKeys.MRP}
                  buttonType={FileUploadButtonType.NEW}
                  handleFileUpload={handleFileStore}
                  accept={acceptedFiles}
                />
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <>
                  Manufacturer Details
                  <RedStar />
                </>
              }
              span={3}>
              {productRequestData?.marketer_details || storedFiles?.marketer_details?.url ? (
                <FileUploadAndView
                  id={ProductRequesImageKeys.MANUFACTURER}
                  handleFileUpload={handleFileStore}
                  handleView={handleView}
                  handleDeleteFiles={() => console.log("delete")}
                  fileName=""
                  acceptedFiles={acceptedFiles}
                  url={storedFiles?.marketer_details?.url || productRequestData?.marketer_details}
                />
              ) : (
                <FileUpload
                  id={ProductRequesImageKeys.MANUFACTURER}
                  buttonType={FileUploadButtonType.NEW}
                  handleFileUpload={handleFileStore}
                  accept={acceptedFiles}
                />
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <>
                  FSSAI Licence
                  {/* <RedStar /> */}
                </>
              }
              span={3}>
              {productRequestData?.fssai_license || storedFiles?.fssai_license?.url ? (
                <FileUploadAndView
                  id={ProductRequesImageKeys.FSAAI_LICENSE}
                  handleFileUpload={handleFileStore}
                  handleView={handleView}
                  handleDeleteFiles={() => console.log("delete")}
                  fileName=""
                  acceptedFiles={acceptedFiles}
                  url={storedFiles?.fssai_license?.url || productRequestData?.fssai_license}
                />
              ) : (
                <FileUpload
                  id={ProductRequesImageKeys.FSAAI_LICENSE}
                  buttonType={FileUploadButtonType.NEW}
                  handleFileUpload={handleFileStore}
                  accept={acceptedFiles}
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
        </Form>
      </Paper>
    </Spin>
  );
};

export default ProductRequestBasicInfo;

const checkBarcodeDisable = ({
  auto_assign_barcode,
  editPermission
}: {
  auto_assign_barcode: 1 | 0 | undefined | boolean;
  editPermission: boolean | undefined;
}) => {
  // if (editPermission !== true) {
  //   return true;
  // }
  if (auto_assign_barcode === 1) {
    return true;
  }
  if (auto_assign_barcode === 0 && editPermission === true) {
    return false;
  }
  if (auto_assign_barcode === 0 && editPermission !== true) {
    return true;
  }

  return false;
};
