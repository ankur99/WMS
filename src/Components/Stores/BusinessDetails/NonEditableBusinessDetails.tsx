import { Row, Col, Typography, Button, Descriptions } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
  NonEditableBusinessDetailsProps,
  RowShowInputTypes
} from "../../../types/updateStoreTypes";

import NonEditableRowShow from "../NonEditableRowShow";
const { Title } = Typography;

const NonEditableOwnerDetails = ({
  handleEditBusinessDetails,
  businessDetailsData,
  title
}: NonEditableBusinessDetailsProps) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Title level={3}>{title}</Title>
        </Col>
        <Col xs={12} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => handleEditBusinessDetails(true)}
            icon={<EditOutlined />}>
            Edit
          </Button>
        </Col>
        <Col>
          <h3 style={{ color: "deeppink", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
            Note : Below are the compulsory business ID. Need atleast one of the following business
            ID.
          </h3>
        </Col>
      </Row>
      <Descriptions title="" bordered>
        {businessDetailsData && (
          <>
            <Descriptions.Item label={"GSTIN Number"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.gstin_number}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Business PAN"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.business_pan}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Shop & Establishment Act"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.shop_establishment_act}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"FSSAI License"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.fssai_license}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Trade License"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.trade_license}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Udyog Aadhar/Udhayam Registartion"} span={3}>
              <NonEditableRowShow
                value={businessDetailsData.udyog_aadhar}
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
