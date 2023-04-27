import { Row, Col, Typography, Button, Descriptions, Form, Spin } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

// import RedStar from "../../RedStar";
import EditableRowShow from "../EditableRowShow";
import {
  BusinessDetailsData,
  EditableBusinessDetailsProps,
  RowShowInputTypes
} from "../../../types/updateStoreTypes";
import { onError, showErrorToast, showSuccessToast } from "../../../utils/helperFunctions";
import { useUpdateBusinessDetails } from "../../../hooks/useRQUpdateStore";
import { patternRegex } from "../../../utils/regexValues";

const { Title } = Typography;

const EditableOwnerDetails = ({
  handleEditBusinessDetails,
  businessDetailsData,
  title
}: EditableBusinessDetailsProps) => {
  const handleFinish = (values: BusinessDetailsData) => {
    //checking atleast one business id is filled
    const isAllEmpty = Object.values(values).every(
      (value) => (typeof value === "string" && value.trim() === "") || value === null
    );

    if (isAllEmpty) {
      showErrorToast("Need atleast one of the following business ID.");
      return;
    }
    if (businessDetailsData && businessDetailsData.id) {
      updateStoreDetails({ storeId: businessDetailsData?.id, payload: values });
    }
  };

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    handleEditBusinessDetails(false);
  };

  const { isLoading: mutationLoading, mutate: updateStoreDetails } = useUpdateBusinessDetails({
    onError,
    onSuccess: onSuccess
  });
  return (
    <Spin spinning={mutationLoading}>
      <Form
        name="editOwnerDetails"
        initialValues={businessDetailsData}
        onFinish={handleFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Row>
          <Col xs={12}>
            <Title level={3}>{title}</Title>
          </Col>
          <Col xs={12} style={{ textAlign: "right" }}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                Update
              </Button>
              <Button
                className="ml-1"
                type="primary"
                icon={<CloseOutlined />}
                danger
                onClick={() => handleEditBusinessDetails(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <h3 style={{ color: "deeppink", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
              Note : Below are the compulsory business ID. Need atleast one of the following
              business ID.
            </h3>
          </Col>
        </Row>
        <Descriptions title="" bordered>
          {businessDetailsData && (
            <>
              <Descriptions.Item
                label={
                  <>
                    GSTIN Number
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"GSTIN Number"}
                  id={"gstin_number"}
                  value={businessDetailsData.gstin_number}
                  type={RowShowInputTypes.STRING_WITH_CUSTOM_RULE}
                  required={false}
                  pattern={patternRegex.gstin}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Business PAN
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Business PAN"}
                  id={"business_pan"}
                  value={businessDetailsData.business_pan}
                  type={RowShowInputTypes.STRING_WITH_CUSTOM_RULE}
                  required={false}
                  pattern={patternRegex.pan}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Shop & Establishment Act
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Shop & Establishment Act"}
                  id={"shop_establishment_act"}
                  value={businessDetailsData.shop_establishment_act}
                  type={RowShowInputTypes.TEXT}
                  required={false}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    FSSAI License
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"FSSAI License"}
                  id={"fssai_license"}
                  value={businessDetailsData.fssai_license}
                  type={RowShowInputTypes.TEXT}
                  required={false}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Trade License
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Trade License"}
                  id={"trade_license"}
                  value={businessDetailsData.trade_license}
                  type={RowShowInputTypes.TEXT}
                  required={false}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Udyog Aadhar/Udhayam Registartion
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Udyog Aadhar/Udhayam Registartion"}
                  id={"udyog_aadhar"}
                  value={businessDetailsData.udyog_aadhar}
                  type={RowShowInputTypes.TEXT}
                  required={false}
                />
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Form>
    </Spin>
  );
};

export default EditableOwnerDetails;
