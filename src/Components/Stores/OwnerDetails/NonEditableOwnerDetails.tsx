import { Row, Col, Typography, Button, Descriptions } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { NonEditableOwnerDetailsProps, RowShowInputTypes } from "../../../types/updateStoreTypes";

import NonEditableRowShow from "../NonEditableRowShow";
const { Title } = Typography;

const NonEditableOwnerDetails = ({
  handleEditOwnerDetails,
  ownerDetailsData,
  title
}: NonEditableOwnerDetailsProps) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Title level={3}>{title}</Title>
        </Col>
        <Col xs={12} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => handleEditOwnerDetails(true)}
            icon={<EditOutlined />}>
            Edit
          </Button>
        </Col>
      </Row>
      <Descriptions title="" bordered>
        {ownerDetailsData && (
          <>
            <Descriptions.Item label={"Owner Name"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.owner_name}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Father Name"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.father_name}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Owner Aadhar Number"} span={3}>
              <NonEditableRowShow value={ownerDetailsData.aadhar} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Owner Pan Number"} span={3}>
              <NonEditableRowShow value={ownerDetailsData.pan} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Date of Birth"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.formattedDataOfBirth}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Owner Present Address"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.present_address}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Owner Permanent Address"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.permanent_address}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Bank Account Number"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.bank_account}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"IFSC Number"} span={3}>
              <NonEditableRowShow
                value={ownerDetailsData.bank_ifsc}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </>
  );
};

export default NonEditableOwnerDetails;
