import { Button, Form, InputNumber, Modal, Space } from "antd";
import { patternRegex } from "../../utils/regexValues";

interface GetValueModalProps {
  isModalVisible: boolean;
  title: string;
  handleCancel: () => void;
  handleOk: (value: number) => void;
}

const GetValueModal = ({ isModalVisible, title, handleCancel, handleOk }: GetValueModalProps) => {
  const onFinish = (values: { count: number }) => {
    handleOk(values.count);
  };
  return (
    <>
      <Modal visible={isModalVisible} title={title} onCancel={handleCancel} footer={null}>
        <Form name="enterDetails" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="count"
            label="Number of Labels To Print"
            rules={[
              { required: true, message: "Please input a valid number" },
              {
                pattern: patternRegex.onlyPositive,
                message: `Please input whole number!`
              }
            ]}>
            <InputNumber />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Generate
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GetValueModal;
