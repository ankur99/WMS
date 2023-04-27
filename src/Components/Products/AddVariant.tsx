import { Form, Col, Row, Typography, Button, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import EditableRowShow from "../Stores/EditableRowShow";
import { useEffect } from "react";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import Paper from "../common/Paper";
import { uomTypes } from "../../utils/constants";
import { ProductVariant } from "../../types/ProductTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { useProductData, useCreateVariant, useUpdateVariant } from "../../hooks/useRQProducts";
import { patternRegex } from "../../utils/regexValues";

const { Title } = Typography;

// if params.variantId means edit page, else create page

const getVariantData = ({
  variantData,
  variantId
}: {
  variantData: ProductVariant[];
  variantId: string;
}) => {
  if (variantId) {
    return variantData.find((variant) => variant.id === +variantId);
  }
  return {};
};

const AddVariant = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();

  const onSuccess = (msg: string) => {
    form.resetFields();
    showSuccessToast(msg);

    navigate(-1);
  };

  const { isLoading, data: productData } = useProductData({
    productId: params.id,
    onError: onErrorNotification
  });

  const { isLoading: createLoading, mutate: createVariant } = useCreateVariant({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const { isLoading: updateLoading, mutate: updateVariant } = useUpdateVariant({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: ProductVariant) => {
    if (!params.variantId) {
      //means create variant
      createVariant({ productId: params?.id as string, payload: values });
      return;
    }
    updateVariant({
      productId: params?.id as string,
      variantId: params?.variantId,
      payload: values
    });
  };

  const variantType = Form.useWatch("value", form);

  // changin sku on basis of changing variant type
  useEffect(() => {
    if (variantType) {
      form.setFieldsValue({ sku: `${params.id}-${variantType}` });
    }
  }, [variantType]);

  return (
    <Spin spinning={isLoading}>
      {isLoading ? (
        <></>
      ) : (
        <Spin spinning={createLoading || updateLoading}>
          <Paper>
            <Form
              form={form}
              name="add-variant"
              initialValues={
                params?.variantId
                  ? Array.isArray(productData?.variants)
                    ? getVariantData({
                        variantData: productData?.variants,
                        variantId: params?.variantId
                      })
                    : {}
                  : {}
              }
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off">
              <Row gutter={24}>
                <Col xs={12}>
                  <Title level={3}> Options & Pricing</Title>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"TYPE"}
                    id={"value"}
                    type={RowShowInputTypes.SINGLE_SELECT}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                    arrayData={[
                      { id: uomTypes.unit, name: uomTypes.unit },
                      { id: uomTypes.case, name: uomTypes.case },
                      { id: uomTypes.outer, name: uomTypes.outer },
                      { id: uomTypes.each, name: uomTypes.each }
                    ]}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"SKU"}
                    id={"sku"}
                    type={RowShowInputTypes.TEXT}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                    disabled={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"MRP"}
                    id={"mrp"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Price"}
                    id={"price"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Min Price"}
                    id={"min_price"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Max Price"}
                    id={"max_price"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Quantity"}
                    id={"quantity"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.wholePositive}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"MOQ"}
                    id={"moq"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.wholePositive}
                    required={true}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Weight(kg)"}
                    id={"weight"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    // required={true}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Length(cm)"}
                    id={"length"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    // required={true}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Width(cm)"}
                    id={"width"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    // required={true}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label={"Height(cm)"}
                    id={"height"}
                    type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                    pattern={patternRegex.postiveNumber}
                    // required={true}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
              </Row>
            </Form>
          </Paper>
        </Spin>
      )}
    </Spin>
  );
};

export default AddVariant;
