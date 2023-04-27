import { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Descriptions, Form, Spin } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

import RedStar from "../../RedStar";
import EditableRowShow from "../EditableRowShow";
import {
  EditableStoreDetailsProps,
  RowShowInputTypes,
  StoreDetailsData
} from "../../../types/updateStoreTypes";
import { useUpdateStoreDetails } from "../../../hooks/useRQUpdateStore";
import { onError, showSuccessToast } from "../../../utils/helperFunctions";
// import { patternRegex } from "../../../utils/regexValues";

import { fetchPinList, fetchBeatList } from "../../../api/fetchStoreLists";

const { Title } = Typography;

const EditableStoreDetails = ({
  handleEditStoreDetails,
  storeDetailsData,
  title,
  allTagsData,
  allFranchiseFeesData,
  // allBeatsData,
  allWareHousesData
}: EditableStoreDetailsProps) => {
  const [form] = Form.useForm();
  const [fieldsToShow, setFieldsToShow] = useState({
    onboarding_fees_applicable: false,
    franchise_fees_applicable: false
  });

  useEffect(() => {
    if (storeDetailsData && Object.keys(storeDetailsData).length > 0) {
      const temp = {
        onboarding_fees_applicable: storeDetailsData.onboarding_fees_applicable,
        franchise_fees_applicable: storeDetailsData.franchise_fees_applicable
      };

      setFieldsToShow(temp);
    }
  }, [storeDetailsData]);

  const handleFinish = (values: StoreDetailsData) => {
    // console.log({ values });
    // converting the boolean values to 1 and 0 as api is required in that way
    const temp = {
      ...values
    };
    const franchise_fees_applicable = temp.franchise_fees_applicable === true ? 1 : 0;
    const onboarding_fees_applicable = temp.onboarding_fees_applicable === true ? 1 : 0;
    const credit_allowed = temp.credit_allowed === true ? 1 : 0;
    const formattedPincode = temp.pincode ? temp.pincode.key : "";
    if (storeDetailsData && storeDetailsData.id) {
      // console.log({ values });
      updateStoreDetails({
        storeId: storeDetailsData?.id,
        payload: {
          ...values,
          franchise_fees_applicable,
          onboarding_fees_applicable,
          credit_allowed,
          pincode: formattedPincode
        } as any
      });
    }
  };

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    handleEditStoreDetails(false);
  };

  const { isLoading: mutationLoading, mutate: updateStoreDetails } = useUpdateStoreDetails({
    onError,
    onSuccess: onSuccess
  });

  console.log({ storeDetailsData });

  return (
    <Spin spinning={mutationLoading}>
      <Form
        form={form}
        name="editStoreDetails"
        initialValues={storeDetailsData}
        onFinish={handleFinish}
        //   onFinishFailed={onFinishFailed}
        onFieldsChange={(fieldInfo: any) => {
          //showing fields on the basic of switch selected for onboarding fees and franchise fees
          if (fieldInfo?.[0]?.name?.[0] === "onboarding_fees_applicable") {
            let temp = false;
            if (fieldInfo?.[0]?.value === true) {
              temp = true;
            }
            setFieldsToShow((prev) => {
              return {
                ...prev,
                onboarding_fees_applicable: temp
              };
            });
          } else if (fieldInfo?.[0]?.name?.[0] === "franchise_fees_applicable") {
            let temp = false;
            if (fieldInfo?.[0]?.value === true) {
              temp = true;
            } else {
              temp = false;
            }
            setFieldsToShow((prev) => {
              return {
                ...prev,
                franchise_fees_applicable: temp
              };
            });
          }
        }}
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
                onClick={() => handleEditStoreDetails(false)}>
                Cancel
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Descriptions title="" bordered>
          {storeDetailsData && (
            <>
              <Descriptions.Item
                label={
                  <>
                    Beat
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Beat"}
                  id={"beat"}
                  value={storeDetailsData.beat}
                  type={RowShowInputTypes.DEBOUNCE_SELECT}
                  fetchApi={fetchBeatList}
                  required={false}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Store Name
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Store Name"}
                  id={"name"}
                  value={storeDetailsData.name}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Store Address
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Store Address"}
                  id={"address"}
                  value={storeDetailsData.address}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Fulfill WareHouse
                    {/* <RedStar /> */}
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Fulfill WareHouse"}
                  id={"fulfil_warehouse_id"}
                  value={storeDetailsData?.fulfil_warehouse_name}
                  type={RowShowInputTypes.SINGLE_SELECT}
                  arrayData={allWareHousesData}
                  // disabled={!storeDetailsData?.can_edit_fulfil_warehouse_id}
                  required={false}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Landmark
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Landmark"}
                  id={"landmark"}
                  value={storeDetailsData.landmark}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              {/* <Descriptions.Item
                label={
                  <>
                    Pincode
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Pincode"}
                  id={"pincode"}
                  value={storeDetailsData.pincode}
                  type={RowShowInputTypes.PINCODE}
                />
              </Descriptions.Item> */}
              <Descriptions.Item
                label={
                  <>
                    Pincode
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Pincode"}
                  id={"pincode"}
                  value={storeDetailsData.pincode}
                  type={RowShowInputTypes.DEBOUNCE_SELECT}
                  fetchApi={fetchPinList}
                />
              </Descriptions.Item>
              {/* <Descriptions.Item label={<>GSTIN</>} span={3}>
                <EditableRowShow
                  label={"GSTIN"}
                  id={"gstin"}
                  value={storeDetailsData.gstin}
                  type={RowShowInputTypes.STRING_WITH_CUSTOM_RULE}
                  pattern={patternRegex.gstin}
                  required={false}
                />
              </Descriptions.Item> */}
              <Descriptions.Item
                label={
                  <>
                    Latitude
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Latitude"}
                  id={"lat"}
                  value={storeDetailsData.lat}
                  type={RowShowInputTypes.NUMBER}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Longitude
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Longitude"}
                  id={"lng"}
                  value={storeDetailsData.lng}
                  type={RowShowInputTypes.NUMBER}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Tags
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Tags"}
                  id={"requiredFormattedTags"}
                  value={storeDetailsData.requiredFormattedTags}
                  type={RowShowInputTypes.MULTI_TAGS}
                  arrayData={allTagsData}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Contact Person
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Contact Person"}
                  id={"contact_person"}
                  value={storeDetailsData.contact_person}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Contact Number
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Contact Number"}
                  id={"contact_mobile"}
                  value={storeDetailsData.contact_mobile}
                  type={RowShowInputTypes.TEXT}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Verified
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Verified"}
                  id={"verified"}
                  value={storeDetailsData.verified}
                  type={RowShowInputTypes.TAG}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    Credit Allowed
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Credit Allowed"}
                  id={"credit_allowed"}
                  value={storeDetailsData.credit_allowed}
                  type={RowShowInputTypes.TAG}
                />
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    On Boarding Fees Allowed
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"On Boarding Fees Allowed"}
                  id={"onboarding_fees_applicable"}
                  value={storeDetailsData.onboarding_fees_applicable}
                  type={RowShowInputTypes.TAG}
                  // disabled={!storeDetailsData.isAdmin}
                  // shouldUpdate={true}
                />
              </Descriptions.Item>
              {fieldsToShow.onboarding_fees_applicable === true && (
                <Descriptions.Item
                  label={
                    <>
                      On Boarding Amount(in ₹)
                      <RedStar />
                    </>
                  }
                  span={3}>
                  <EditableRowShow
                    label={"On Boarding Amount(in ₹)"}
                    id={"onboarding_fees_amount"}
                    value={storeDetailsData.onboarding_fees_amount}
                    type={RowShowInputTypes.NUMBER}
                    // disabled={!storeDetailsData.isAdmin}
                    // required={false}
                  />
                </Descriptions.Item>
              )}

              {/* )} */}
              <Descriptions.Item
                label={
                  <>
                    Franchise Fees Allowed
                    <RedStar />
                  </>
                }
                span={3}>
                <EditableRowShow
                  label={"Franchise Fees Allowed"}
                  id={"franchise_fees_applicable"}
                  value={storeDetailsData.franchise_fees_applicable}
                  type={RowShowInputTypes.TAG}
                  // disabled={!storeDetailsData.isAdmin}
                  // shouldUpdate={true}
                />
              </Descriptions.Item>
              {fieldsToShow.franchise_fees_applicable === true && (
                <>
                  <Descriptions.Item
                    label={
                      <>
                        Franchise Fees
                        <RedStar />
                      </>
                    }
                    span={3}>
                    {/* <EditableRowShow
                      label={"Franchise Fee mount(in ₹)"}
                      id={"franchise_fees_amount"}
                      value={storeDetailsData.franchise_fees_amount}
                      type={RowShowInputTypes.NUMBER}
                      // disabled={!storeDetailsData.isAdmin}
                      // required={false}
                    /> */}
                    <EditableRowShow
                      label={"Franchise Fees"}
                      // id={"franchise_fees_amount"}
                      id={"franchise_fees_product_id"}
                      type={RowShowInputTypes.SINGLE_SELECT}
                      value={storeDetailsData?.franchise_fees_amount_name}
                      arrayData={allFranchiseFeesData}
                      // disabled={!storeDetailsData.isAdmin}
                      // required={false}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        Franchise Start Date
                        <RedStar />
                      </>
                    }
                    span={3}>
                    <EditableRowShow
                      label={"Franchise Start Date"}
                      id={"momentFranchiseFeesStartDate"}
                      // value={storeDetailsData.momentFranchiseFeesStartDate}
                      type={RowShowInputTypes.DATE}
                      // disabled={!storeDetailsData.isAdmin}
                      // required={false}
                    />
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label={<>BD Store ID</>} span={3}>
                <EditableRowShow
                  label={"BD Store ID"}
                  id={"bd_store_id"}
                  required={false}
                  value={storeDetailsData.bd_store_id}
                  type={RowShowInputTypes.NUMBER}
                />
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Form>
    </Spin>
  );
};

export default EditableStoreDetails;
