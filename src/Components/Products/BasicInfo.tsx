import { useEffect, useState } from "react";
import { Form, Col, Row, Typography, Button, Spin } from "antd";

import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useNavigate } from "react-router-dom";

import styles from "./basicInfo.module.css";
import EditableRowShow from "../Stores/EditableRowShow";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import Paper from "../common/Paper";
import {
  fetchBrandsList,
  fetchHSNList,
  // fetchPlacementList,
  fetchProductTagsList,
  fetchTaxClassList
} from "../../api/fetchLists";
import {
  ProductDataSend,
  KeyValueLabel,
  ProductBasicInfoForm,
  ProductComingFrom,
  ProductData
} from "../../types/ProductTypes";
import { ActualUomTypes } from "../../utils/constants";
import {
  useCreateProduct,
  useUpdateProductDetails,
  useAssignBarcodeProduct
} from "../../hooks/useRQProducts";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { patternRegex } from "../../utils/regexValues";

const { Title } = Typography;

interface BasicInfoProps {
  comingFrom: ProductComingFrom;
  productData?: ProductBasicInfoForm | undefined;
  productId?: string;
}

const BasicInfo = ({ comingFrom, productData, productId }: BasicInfoProps) => {
  const [form] = Form.useForm();
  const [richTextValue, setRichTextValue] = useState("");

  const navigate = useNavigate();

  const onSuccess = (data: ProductData, comingFrom: ProductComingFrom) => {
    // form.resetFields();
    if (comingFrom === ProductComingFrom.CREATE) {
      showSuccessToast("Product has been created successfully");
      if (data.id) {
        // redirecting to 2nd tab of update product
        navigate(`/home/products/${data?.id}?key=2`);
      }
      return;
    }
    // for update
    showSuccessToast("Product Basic Info has been updated successfully");
  };

  const { isLoading: createLoading, mutate: createProduct } = useCreateProduct({
    onError: onErrorNotification,
    onSuccess
  });

  const { isLoading: updateLoading, mutate: updateProduct } = useUpdateProductDetails({
    onError: onErrorNotification,
    onSuccess
  });

  const { isLoading: assignBarcodeLoading, mutate: assignBarcode } = useAssignBarcodeProduct({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  // storing the description data from backend if coming from is update once
  useEffect(() => {
    if (
      comingFrom === ProductComingFrom.UPDATE &&
      richTextValue?.length === 0 &&
      productData &&
      productData?.description
    ) {
      setRichTextValue(productData?.description);
    }
  }, [productData]);

  const onFinish = (values: ProductBasicInfoForm) => {
    const payload: ProductDataSend | Record<string, unknown> = {};

    // Apis list from basic info
    payload.name = values?.name;
    payload.description = richTextValue;
    payload.type = values?.type;
    payload.hsn_sac_code = values?.hsn_sac?.value;
    payload.brand_id = values?.brand?.value;
    payload.tax_class_id = values?.taxClass?.value;
    payload.tags = values?.tags ? getFilteredValues(values?.tags) : null;
    // payload.status = values?.status;
    payload.barcode = values?.barcode;
    payload.code = values?.code;
    // payload.allow_back_orders = values?.allow_back_orders === true ? 1 : 0;
    payload.uom = values?.uom;
    // payload.racks = values?.racks ? getFilteredValues(values?.racks) : null;

    if (comingFrom === ProductComingFrom.CREATE) {
      payload.mrp = values?.mrp;
      payload.min_price = values?.min_price;
    }

    if (comingFrom === ProductComingFrom.CREATE) {
      createProduct(payload as unknown as ProductDataSend);
    } else if (comingFrom === ProductComingFrom.UPDATE) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      updateProduct({ productId, payload });
    }
  };

  const handleRichTextChange = (value: string) => {
    setRichTextValue(value);
  };

  const productType = Form.useWatch("type", form);

  return (
    <Spin spinning={createLoading || updateLoading || assignBarcodeLoading}>
      <Paper>
        <Form
          form={form}
          name="product_basic_info"
          // initialValues={{ remember: true }}
          initialValues={productData}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
          <Row gutter={24}>
            <Col xs={12}>
              <Title level={3}> Basic Info</Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>

            <Col span={24}>
              <EditableRowShow
                label={"PRODUCT NAME"}
                id={"name"}
                type={RowShowInputTypes.TEXT}
                labelToShow={true}
                marginBottom={true}
              />
            </Col>
            <Col span={24}>
              <h4>DESCRIPTION</h4>
              <SimpleMdeReact
                className={styles.quill}
                value={richTextValue}
                onChange={handleRichTextChange}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"PRODUCT TYPE"}
                id={"type"}
                type={RowShowInputTypes.SINGLE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                arrayData={[
                  { id: "product", name: "Product" },
                  { id: "service", name: "Service" }
                ]}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"HSN/SAC Code"}
                id={"hsn_sac"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchHSNList}
                debounceId={"hsn_sac_code"}
                debounceName={"hsn_sac_code"}
                debounceName2={"description"}
              />
            </Col>
            {productType !== "service" && (
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
            )}

            <Col sm={12} xs={24}>
              <EditableRowShow
                label="TAX CLASS"
                id="taxClass"
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={true}
                labelToShow={true}
                marginBottom={true}
                // arrayData={taxClassData}
                fetchApi={fetchTaxClassList}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label="TAGS"
                id="tags"
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchProductTagsList}
                mode="multiple"
              />
            </Col>
            {/* <Col sm={12} xs={24}>
              <EditableRowShow
                label="STATUS"
                id="status"
                type={RowShowInputTypes.SINGLE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                arrayData={[
                  { id: 1, name: "Active" },
                  { id: 0, name: "Inactive" }
                ]}
              />
            </Col> */}
            {productType !== "service" && (
              <>
                <Col sm={12} xs={24}>
                  {comingFrom === ProductComingFrom.CREATE || productData?.barcode ? (
                    <EditableRowShow
                      label="BARCODE"
                      id="barcode"
                      type={RowShowInputTypes.TEXT}
                      required={false}
                      labelToShow={true}
                      marginBottom={true}
                    />
                  ) : (
                    <Button
                      type="primary"
                      // loading={assignBarcodeLoading}
                      onClick={() => assignBarcode({ productId: productId })}>
                      Assign Barcode
                    </Button>
                  )}
                </Col>
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label="MARKETER CODE"
                    id="code"
                    type={RowShowInputTypes.TEXT}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col>
                {/* <Col sm={12} xs={24}>
                  <EditableRowShow
                    label="ALLOW BACK ORDERS (JIT)"
                    id="allow_back_orders"
                    type={RowShowInputTypes.TAG}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                  />
                </Col> */}
                <Col sm={12} xs={24}>
                  <EditableRowShow
                    label="UOM"
                    id="uom"
                    type={RowShowInputTypes.SINGLE_SELECT}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                    arrayData={[
                      { id: ActualUomTypes.pc, name: ActualUomTypes.pc },
                      { id: ActualUomTypes.kg, name: ActualUomTypes.kg },
                      { id: ActualUomTypes.l, name: ActualUomTypes.l },
                      { id: ActualUomTypes.m, name: ActualUomTypes.m },
                      { id: ActualUomTypes.ea, name: ActualUomTypes.ea }
                    ]}
                  />
                </Col>
                {/* <Col sm={12} xs={24}>
                  <EditableRowShow
                    label="Placement"
                    id="racks"
                    type={RowShowInputTypes.DEBOUNCE_SELECT}
                    required={false}
                    labelToShow={true}
                    marginBottom={true}
                    fetchApi={fetchPlacementList}
                    mode="multiple"
                    debounceId="key"
                    debounceName="label"
                  />
                </Col> */}
              </>
            )}
            {comingFrom === ProductComingFrom.CREATE && (
              <Col sm={12} xs={24}>
                <EditableRowShow
                  label={"MRP"}
                  id={"mrp"}
                  required={true}
                  labelToShow={true}
                  marginBottom={true}
                  type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                  pattern={patternRegex.postiveNumber}
                />
              </Col>
            )}

            {comingFrom === ProductComingFrom.CREATE && (
              <Col sm={12} xs={24}>
                <EditableRowShow
                  label={"Min Price"}
                  id={"min_price"}
                  type={RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE}
                  required={true}
                  labelToShow={true}
                  marginBottom={true}
                  pattern={patternRegex.postiveNumber}
                />
              </Col>
            )}
          </Row>
        </Form>
      </Paper>
    </Spin>
  );
};

export default BasicInfo;

const getFilteredValues = (data: KeyValueLabel[]) => {
  //return array of value
  return data.map((item) => +item.key);
};
