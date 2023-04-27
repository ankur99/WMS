import { Row, Col, Typography, Button, Descriptions } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { NonEditableStoreDetailsProps, RowShowInputTypes } from "../../../types/updateStoreTypes";

import NonEditableRowShow from "../NonEditableRowShow";
const { Title } = Typography;

const NonEditableStoreDetails = ({
  handleEditStoreDetails,
  storeDetailsData,
  title
}: NonEditableStoreDetailsProps) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Title level={3}>{title}</Title>
        </Col>
        <Col xs={12} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            onClick={() => handleEditStoreDetails(true)}
            icon={<EditOutlined />}>
            Edit
          </Button>
        </Col>
      </Row>
      <Descriptions title="" bordered>
        {storeDetailsData && (
          <>
            <Descriptions.Item label={"Beat"} span={3}>
              {/* <NonEditableRowShow
                value={storeDetailsData?.beat?.name}
                type={RowShowInputTypes.TEXT}
              /> */}
              <NonEditableRowShow
                value={storeDetailsData?.beat?.label}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Store Name"} span={3}>
              <NonEditableRowShow value={storeDetailsData.name} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Store Address"} span={3}>
              <NonEditableRowShow value={storeDetailsData.address} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Fulfill WareHouse"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData?.fulfil_warehouse_name}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Landmark"} span={3}>
              <NonEditableRowShow value={storeDetailsData.landmark} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Pincode"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.pincode?.label}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            {/* <Descriptions.Item label={"GSTIN"} span={3}>
              <NonEditableRowShow value={storeDetailsData.gstin} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item> */}
            <Descriptions.Item label={"Latitude"} span={3}>
              <NonEditableRowShow value={storeDetailsData.lat} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Longitude"} span={3}>
              <NonEditableRowShow value={storeDetailsData.lng} type={RowShowInputTypes.TEXT} />
            </Descriptions.Item>
            <Descriptions.Item label={"Tags"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.tags}
                type={RowShowInputTypes.MULTI_TAGS}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Contact Person"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.contact_person}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Contact Number"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.contact_mobile}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Verified"} span={3}>
              <NonEditableRowShow value={storeDetailsData.verified} type={RowShowInputTypes.TAG} />
            </Descriptions.Item>
            <Descriptions.Item label={"Credit Allowed"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.credit_allowed}
                type={RowShowInputTypes.TAG}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"On Boarding Fees Allowed"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.onboarding_fees_applicable}
                type={RowShowInputTypes.TAG}
              />
            </Descriptions.Item>

            <Descriptions.Item label={"On Boarding Amount(in ₹)"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.onboarding_fees_amount}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>

            <Descriptions.Item label={"Franchise Fees Allowed"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.franchise_fees_applicable}
                type={RowShowInputTypes.TAG}
              />
            </Descriptions.Item>

            <Descriptions.Item label={"Franchise Fees"} span={3}>
              <NonEditableRowShow
                value={
                  storeDetailsData?.franchise_fees_amount
                    ? `${storeDetailsData?.franchise_fees_amount?.name} (${storeDetailsData?.franchise_fees_amount?.mrp})`
                    : "--"
                }
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"Franchise Fees Start Date"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.formattedFranchiseFeesStartDate}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
            <Descriptions.Item label={"BD Store ID"} span={3}>
              <NonEditableRowShow
                value={storeDetailsData.bd_store_id}
                type={RowShowInputTypes.TEXT}
              />
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </>
  );
};

export default NonEditableStoreDetails;
