import { Button, Col, Form, Popconfirm, Row, Space, Spin, Tooltip, Typography } from "antd";
import EditableRowShow from "../Stores/EditableRowShow";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Paper from "../common/Paper";
import { useEffect, useState } from "react";
import {
  useApproveProductRequest,
  useDeleteProductRequest,
  useSaveProductRequest
} from "../../hooks/useRQProductRequest";
// import styles from "../Products/basicInfo.module.css";
import { ApproveProductRequestProps, PlanningInfoForm } from "../../types/productRequestTypes";
import {
  fetchBrandsList,
  fetchClass4,
  fetchHSNDependentList,
  fetchHSNList,
  fetchProductGroups
} from "../../api/fetchLists";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { tagsColor } from "../../utils/constants";
import { patternRegex } from "../../utils/regexValues";

const { Title } = Typography;

const PlanningInfo = ({
  productRequestId,
  productRequestData,
  approve_permission,
  save_permission
}: {
  productRequestId: string;
  productRequestData?: PlanningInfoForm | undefined;
  approve_permission: boolean | undefined;
  save_permission: boolean | undefined;
  // productRequestData: ProductRequestBasic | undefined;
}) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const onSuccess = (type: "SAVE" | "APPROVED" | "DELETE") => {
    // form.resetFields();

    if (type === "SAVE") {
      showSuccessToast("Product Request has been saved successfully");
      return;
    } else if (type === "APPROVED") {
      showSuccessToast("Product Request has been approved");
      navigate(`/home/products/`);
      return;
    } else if (type === "DELETE") {
      showSuccessToast("Product Request has been deleted");
      navigate(`/home/products/product-request/`);
      return;
    }
  };

  const { isLoading: saveLoading, mutate: saveRequest } = useSaveProductRequest({
    onError: onErrorNotification,
    onSuccess
  });

  const { isLoading: approveLoading, mutate: approveRequest } = useApproveProductRequest({
    onError: onErrorNotification,
    onSuccess
  });

  const { isLoading: deleteLoading, mutate: deleteRequest } = useDeleteProductRequest({
    onError: onErrorNotification,
    onSuccess
  });
  const onFinish = (values: PlanningInfoForm) => {
    // console.log({ values });
    const payload: ApproveProductRequestProps = {
      name: values.name,
      description: description,
      unit_mrp: values?.unit_mrp as number,
      brand_id: values?.brand?.key as string,
      group_id: values?.group?.key as string,
      cl4_id: values?.cl4?.key as string,
      hsn_code: values?.hsn_sac?.key as string
    };

    saveRequest({
      productRequestId,
      payload
    });
  };
  const handleRichTextChange = (value: string) => {
    // console.log({ value });
    setDescription(value);
  };

  const classL4 = Form.useWatch("cl4", form);

  // const handleHSNDependency = async (hsnKey: string) => {
  //   try {
  //     const response = await fetchHSNDependentList({ hsn: hsnKey, cl4_id: classL4?.key as string });
  //     // console.log({ response });
  //     return response;
  //   } catch (error) {
  //     console.log("error", error);
  //     return Promise.resolve([]);
  //   }
  // };

  //adding description to the form
  useEffect(() => {
    if (productRequestData?.description) {
      setDescription(productRequestData?.description);
    }
  }, [productRequestData]);

  const handleApprove = () => {
    // console.log("approved");
    // console.log("form", form.getFieldsValue());

    const values: PlanningInfoForm = form.getFieldsValue();

    const payload: ApproveProductRequestProps = {
      type: "approve", // since save and approve has same api and to distinguish between them we are passing type=approve
      name: values.name,
      description: description,
      unit_mrp: values?.unit_mrp as number,
      brand_id: values?.brand?.key as string,
      group_id: values?.group?.key as string,
      cl4_id: values?.cl4?.key as string,
      hsn_code: values?.hsn_sac?.key as string
    };

    approveRequest({ productRequestId, payload });
  };

  return (
    <Spin spinning={approveLoading || deleteLoading || saveLoading}>
      <Paper>
        <Form
          form={form}
          name="product_request_form"
          onFinish={onFinish}
          initialValues={productRequestData}
          layout="vertical"
          autoComplete="off">
          <Row gutter={24}>
            <Col xs={12}>
              <Title level={3}>Admin Info</Title>
            </Col>
            <Col xs={12} style={{ textAlign: "right" }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space size={"middle"}>
                  {save_permission && (
                    <Button htmlType="submit" type="primary" size="small">
                      Save
                    </Button>
                  )}

                  {approve_permission && (
                    <>
                      <Button
                        onClick={handleApprove}
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: tagsColor.activeTagColor,
                          borderColor: tagsColor.activeTagColor
                        }}>
                        Approve
                      </Button>
                      <Popconfirm
                        title="Are you sure you want to delete this product request?"
                        onConfirm={() => deleteRequest({ productRequestId })}>
                        <Button type="primary" size="small" danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                </Space>
              </Form.Item>
            </Col>
            {/* </Row> */}
            <Col span={24}>
              <EditableRowShow
                label={"PRODUCT NAME"}
                id="name"
                type={RowShowInputTypes.TEXT}
                labelToShow={true}
                marginBottom={true}
              />
            </Col>
            {/* <Row gutter={24}> */}
            <Col span={24}>
              <h4>PRODUCT DESCRIPTION</h4>
              <SimpleMdeReact value={description} onChange={handleRichTextChange} />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label="MRP"
                id="unit_mrp"
                type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                labelToShow={true}
                marginBottom={true}
                pattern={patternRegex.postiveNumber}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"Select Brand"}
                id={"brand"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchBrandsList}
              />
            </Col>
            <Col span={24}>
              <EditableRowShow
                label={"PRODUCT GROUP"}
                id={"group"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchProductGroups}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"CL4"}
                id={"cl4"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchClass4}
              />
            </Col>
            <Col sm={10} xs={22}>
              <EditableRowShow
                label={"HSN/SAC Code"}
                id={"hsn_sac"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                disabled={classL4 === undefined ? true : false}
                marginBottom={true}
                // fetchApi={handleHSNDependency}
                fetchApi={fetchHSNList}
                debounceId={"hsn_sac_code"}
                debounceName={"hsn_sac_code"}
                debounceName2={"description"}
              />
            </Col>
            <Col sm={2} xs={2} style={{ margin: "auto" }}>
              <Tooltip title="Click to find HSN CODE from more data points" color="gold">
                <Button
                  icon={<QuestionCircleOutlined />}
                  type="link"
                  href="/home/products/product-request/hsn-code-finder"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </Tooltip>
            </Col>
          </Row>
        </Form>
      </Paper>
    </Spin>
  );
};

export default PlanningInfo;
