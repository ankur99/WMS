import { Col, Form, Row, Typography, Button, Spin } from "antd";

import EditableRowShow from "../Stores/EditableRowShow";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import Paper from "../common/Paper";
import { MiscInfoForm } from "../../types/ProductTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { useUpdateProductDetails } from "../../hooks/useRQProducts";
import { useWatch } from "antd/lib/form/Form";
const { Title } = Typography;

interface MiscInfoProps {
  productId: string;
  productData: MiscInfoForm | undefined;
}

const MiscInfo = ({ productId, productData }: MiscInfoProps) => {
  const [form] = Form.useForm();
  const account = useWatch("account", form);
  const onSuccess = () => {
    showSuccessToast("Misc Info has been created successfully");
  };

  const { isLoading: updateLoading, mutate: updateProduct } = useUpdateProductDetails({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: MiscInfoForm) => {
    const temp = { ...values };
    if (!account) {
      delete temp["misc_info"];
    }

    updateProduct({ productId, payload: temp });
  };

  return (
    <Spin spinning={updateLoading}>
      <Paper>
        <Form
          name="misc"
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={productData}>
          <Row>
            <Col span={12}>
              <Title level={3}> Misc Info</Title>
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
          <Row gutter={24}>
            <Col sm={8} xs={24}>
              <h3>SALEABILITY INFORMATION</h3>
              <EditableRowShow
                label={"SALEABILITY IN POS"}
                id={"is_pos_saleable"}
                type={RowShowInputTypes.CHECKBOX}
                labelToShow={true}
                marginBottom={false}
                required={false}
              />
              <EditableRowShow
                label={"SALEABLE IN APP"}
                id={"is_app_saleable"}
                type={RowShowInputTypes.CHECKBOX}
                labelToShow={true}
                marginBottom={false}
                required={false}
              />
              <EditableRowShow
                label={"RETURNABLE (PRIMARY)"}
                id={"is_returnable"}
                type={RowShowInputTypes.CHECKBOX}
                labelToShow={true}
                marginBottom={false}
                required={false}
              />
            </Col>
            <Col sm={8} xs={24}>
              <h3>PURCHASE INFORMATION</h3>
              <EditableRowShow
                label="ACCOUNT"
                id="account"
                type={RowShowInputTypes.SINGLE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                arrayData={[
                  { id: "Expense Account", name: "Expense Account" },
                  { id: "Cogs", name: "Cogs" }
                ]}
              />
              <EditableRowShow
                label={"MISC INFO"}
                id={"misc_info"}
                type={RowShowInputTypes.TEXT}
                labelToShow={true}
                marginBottom={true}
                required={account ? true : false}
              />
            </Col>
            <Col sm={8} xs={24}>
              <EditableRowShow
                label="SALES INFORMATION"
                id="sales_info"
                type={RowShowInputTypes.SINGLE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                arrayData={[
                  { id: "Sales", name: "Sales" },
                  { id: "Interest Income", name: "Interest Income" },
                  { id: "Other Income", name: "Other Income" }
                ]}
              />
            </Col>
          </Row>
        </Form>
      </Paper>
    </Spin>
  );
};

export default MiscInfo;
