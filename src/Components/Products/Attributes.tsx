import { Button, Col, Divider, Form, Input, Space, Row, Spin, Typography } from "antd";
import Paper from "../common/Paper";
import DebounceSelect from "../common/DebounceSelect";

import { useUpdateProductDetails } from "../../hooks/useRQProducts";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAttributesList } from "../../api/fetchLists";
import { ProductAttributesForm } from "../../types/ProductTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";

const { Title } = Typography;

interface AttributesProps {
  attributesData: undefined | { attributes: ProductAttributesForm[] };
  productId: string;
}

const Attributes = ({ attributesData, productId }: AttributesProps) => {
  const onSuccess = () => {
    showSuccessToast("Product Attributes has been created successfully");
  };

  const { isLoading: updateLoading, mutate: updateProduct } = useUpdateProductDetails({
    onError: onErrorNotification,
    onSuccess: onSuccess,
    shouldInvalidate: false
  });

  const onFinish = (values: { attributes: ProductAttributesForm[] }) => {
    // console.log(values);
    const payload = filterDataToSendToBackend(values);
    updateProduct({ productId, payload });
  };

  return (
    <Spin spinning={updateLoading}>
      <Paper>
        <Form
          name="add-attribute"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={attributesData}>
          <Row>
            <Col span={12}>
              <Title level={3}> Attributes</Title>
              <p>Add attributes like color, material etc. for this product.</p>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Adding Attributes */}
          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ width: "100%" }} wrap>
                    <Form.Item
                      {...field}
                      label="Attribute"
                      name={[field.name, "attribute"]}
                      rules={[{ required: true, message: "Missing Attribute" }]}>
                      <DebounceSelect
                        placeholder="Search Attribute"
                        fetchOptions={fetchAttributesList}
                        style={{ width: "300px" }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Value"
                      name={[field.name, "value"]}
                      rules={[{ required: true, message: "Missing Value" }]}>
                      <Input style={{ width: "100%" }} />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ color: "#cc003d" }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Attributes
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Paper>
    </Spin>
  );
};

export default Attributes;

const filterDataToSendToBackend = (values: { attributes: ProductAttributesForm[] }) => {
  const res = values?.attributes?.map((value: ProductAttributesForm) => {
    return {
      id: value.attribute.key ? parseInt(value.attribute.key) : null,
      value: value.value
    };
  });

  return { attributes: res };
};
