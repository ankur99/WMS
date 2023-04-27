import { Modal, Button, Form, InputNumber, Table, Spin, Space } from "antd";
import { useExecuteRecipe } from "../../hooks/useRQBundling";
import { BundlingProp } from "../../types/bundlingTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
const { Column } = Table;

type BulkProps = {
  loading?: boolean;
  visible: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  title: string;
  data: BundlingProp | undefined;
};
interface Values {
  numberOfBundles: number;
}

const BundlingExecuteModal = ({
  loading = false,
  visible,
  handleOk,
  handleCancel,
  title,
  data
}: BulkProps) => {
  const [form] = Form.useForm();

  const onSuccess = (msg: string) => {
    form.resetFields();
    showSuccessToast(msg);
    handleOk();
  };

  const { isLoading: recipeExecuteLoading, mutate: executeCreate } = useExecuteRecipe({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: Values) => {
    if (values?.numberOfBundles && data?.id) {
      executeCreate({ id: data?.id, numberOfBundles: values.numberOfBundles });
    }
  };
  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={title}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      <Spin spinning={recipeExecuteLoading}>
        <Form form={form} name="recipe-modal" onFinish={onFinish} autoComplete="off">
          <h2>Bundle Name : {data?.name}</h2>
          {data?.instruction_link && data?.instruction_link?.length > 0 ? (
            <Space direction="vertical">
              <h2 style={{ marginBottom: 0 }}>Links:</h2>
              {data?.instruction_link?.map((link, index) => (
                <a href={link?.url} key={index} target="_blank" rel="noopener noreferrer">
                  Link {index + 1}
                </a>
              ))}
            </Space>
          ) : (
            <h3 style={{ color: "deeppink" }}>No Instruction Url Present</h3>
          )}

          <Form.Item
            name="numberOfBundles"
            label="Number of Bundles"
            rules={[
              { required: true, message: "Missing Number of Bundles" },
              {
                validator: (rule: unknown, typedValue: string) => {
                  if (+typedValue < 1) {
                    return Promise.reject("Provided number can't be less than 1");
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create
            </Button>
            <Button key="back" onClick={handleCancel} style={{ marginLeft: "1rem" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
        <Table dataSource={data?.items} pagination={false} rowKey="id">
          <Column
            key={"id"}
            dataIndex={"product"}
            title={"PID"}
            render={(value) => {
              return value?.key;
            }}
          />
          <Column
            key={"product"}
            dataIndex={"product"}
            title={"Product Name"}
            render={(value) => {
              return value?.label;
            }}
          />
          <Column
            key={"quantity"}
            dataIndex={"quantity"}
            title={"Quantity"}
            render={(value) => {
              return value;
            }}
          />
          {/* <Column
            key={"discount"}
            dataIndex={"discount"}
            title={"Discount"}
            render={(value) => {
              return value;
            }}
          /> */}
        </Table>
      </Spin>
    </Modal>
  );
};

export default BundlingExecuteModal;
