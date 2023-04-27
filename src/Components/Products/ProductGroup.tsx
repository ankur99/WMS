import { Button, Col, Form, Row, Spin, Typography } from "antd";

import EditableRowShow from "../Stores/EditableRowShow";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import Paper from "../common/Paper";
import { fetchClass4, fetchProductGroups } from "../../api/fetchLists";
import { ProductGroupForm } from "../../types/ProductTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { useUpdateProductDetails } from "../../hooks/useRQProducts";
const { Title } = Typography;

interface ProductGroupProps {
  productId: string;
  productData: ProductGroupForm | undefined;
}

const ProductGroup = ({ productId, productData }: ProductGroupProps) => {
  const onSuccess = () => {
    showSuccessToast("Product Group has been created successfully");
  };

  const { isLoading: updateLoading, mutate: updateProduct } = useUpdateProductDetails({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: ProductGroupForm) => {
    // console.log(values);

    const payload = {
      group_id: values.group.key ? parseInt(values.group.key) : null,
      // cl2_id: values.cl2.key ? parseInt(values.cl2.key) : null,
      cl4_id: values.cl4.key ? parseInt(values.cl4.key) : null
    };

    updateProduct({ productId, payload });
  };
  return (
    <Spin spinning={updateLoading}>
      <Paper>
        <Form
          name="service_Group"
          onFinish={onFinish}
          layout="vertical"
          initialValues={productData}>
          <Row>
            <Col span={12}>
              <Title level={3}> Product Group </Title>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {/* <Divider /> */}
          <EditableRowShow
            label={"SELECT GROUP"}
            id={"group"}
            type={RowShowInputTypes.DEBOUNCE_SELECT}
            required={true}
            labelToShow={true}
            marginBottom={true}
            fetchApi={fetchProductGroups}
          />
          {/* <EditableRowShow
            label={"SELECT CL2"}
            id={"cl2"}
            type={RowShowInputTypes.DEBOUNCE_SELECT}
            required={true}
            labelToShow={true}
            marginBottom={true}
            fetchApi={fetchClass2}
          /> */}
          <EditableRowShow
            label={"SELECT CL4"}
            id={"cl4"}
            type={RowShowInputTypes.DEBOUNCE_SELECT}
            required={true}
            labelToShow={true}
            marginBottom={true}
            fetchApi={fetchClass4}
          />
        </Form>
      </Paper>
    </Spin>
  );
};

export default ProductGroup;
