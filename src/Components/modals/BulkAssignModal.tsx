import { Modal, Button, Form } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import DebounceSelect from "../common/DebounceSelect";
import fetchUserList, { fetchNodeUserList } from "../../api/fetchUserList";

type BulkProps = {
  loading?: boolean;
  visible: boolean;
  handleCancel: () => void;
  handleOk: (userId: number) => void;
  title: string;
  apiType?: "phpInstance" | "nodeInstance";
};

interface Value {
  value: number;
}
interface Values {
  username: Value;
}

const BulkAssignModal = ({
  loading = false,
  visible,
  handleOk,
  handleCancel,
  title,
  apiType = "phpInstance"
}: BulkProps) => {
  const onFinish = (values: Values) => {
    console.log("Received values of form: ", values);

    handleOk(values.username.value);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={title}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      <div style={{ marginBottom: "0.5rem" }}>Assign To</div>
      <Form
        name="basic"
        preserve={false}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Missing assign person name!" }]}>
          <DebounceSelect
            placeholder="Select Assignee"
            fetchOptions={apiType === "phpInstance" ? fetchUserList : fetchNodeUserList}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button key="back" onClick={handleCancel} style={{ marginLeft: "1rem" }}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BulkAssignModal;
