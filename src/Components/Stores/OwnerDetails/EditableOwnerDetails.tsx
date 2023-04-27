import { Row, Col, Typography, Button, Descriptions, Form, Spin } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

import RedStar from "../../RedStar";
import EditableRowShow from "../EditableRowShow";
import {
  EditableOwnerDetailsProps,
  OwnerDetailsData,
  RowShowInputTypes
} from "../../../types/updateStoreTypes";
import { useUpdateOwnerDetails } from "../../../hooks/useRQUpdateStore";
import { onError, showSuccessToast } from "../../../utils/helperFunctions";
import { patternRegex } from "../../../utils/regexValues";

const { Title } = Typography;

const EditableOwnerDetails = ({
  handleEditOwnerDetails,
  ownerDetailsData,
  title
}: EditableOwnerDetailsProps) => {
  const handleFinish = (values: OwnerDetailsData) => {
    // console.log({ values });
    if (ownerDetailsData && ownerDetailsData.id) {
      updateStoreDetails({ storeId: ownerDetailsData?.id, payload: values });
    }
  };

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    handleEditOwnerDetails(false);
  };

  const { isLoading: mutationLoading, mutate: updateStoreDetails } = useUpdateOwnerDetails({
    onError,
    onSuccess: onSuccess
  });

  return (
    <Spin spinning={mutationLoading}>
      <Form
        name="editOwnerDetails"
        initialValues={ownerDetailsData}
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
                onClick={() => handleEditOwnerDetails(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Descriptions title="" bordered>
          {ownerDetailsData && (
            <>
              <Descriptions.Item
                label={
                  <>
                    Owner Name
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Owner Name"}
                  id={"owner_name"}
                  value={ownerDetailsData.owner_name}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Father Name
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Father Name"}
                  id={"father_name"}
                  value={ownerDetailsData.father_name}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Owner Aadhar Number
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Owner Aadhar Number"}
                  id={"aadhar"}
                  value={ownerDetailsData.aadhar}
                  type={RowShowInputTypes.STRING_WITH_CUSTOM_RULE}
                  pattern={patternRegex.aadhar}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Owner Pan Number
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Owner Pan Number"}
                  id={"pan"}
                  value={ownerDetailsData.pan}
                  type={RowShowInputTypes.STRING_WITH_CUSTOM_RULE}
                  pattern={patternRegex.pan}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Date of Birth
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Date Of Birth"}
                  id={"momentDateOfBirth"}
                  // value={ownerDetailsData.momentDateOfBirth}
                  type={RowShowInputTypes.DATE}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Owner Present Address
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Owner Present Address"}
                  id={"present_address"}
                  value={ownerDetailsData.present_address}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Owner Permanent Address
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Owner Permanent Address"}
                  id={"permanent_address"}
                  value={ownerDetailsData.permanent_address}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Bank Account Number
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Bank Account Number"}
                  id={"bank_account"}
                  value={ownerDetailsData.bank_account}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    IFSC Number
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"IFSC Number"}
                  id={"bank_ifsc"}
                  value={ownerDetailsData.bank_ifsc}
                  type={RowShowInputTypes.TEXT}
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
