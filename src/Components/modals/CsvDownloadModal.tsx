import { Button, Col, Form, Modal, Row } from "antd";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import EditableRowShow from "../Stores/EditableRowShow";

interface CsvModalProps {
  visible: boolean;
  handleCancel: () => void;
}

const CsvDownloadModal = ({ visible, handleCancel }: CsvModalProps) => {
  const [form] = Form.useForm();

  const onFinish = (values: { start_range: number; end_range: number }) => {
    console.log(values);
  };
  return (
    <div>
      <Modal
        title=" Select Range for CSV Download"
        visible={visible}
        onCancel={handleCancel}
        footer={null}>
        <Form form={form} onFinish={onFinish} name="csvdownload_limit" layout="vertical">
          <Row>
            <Col span={10}>
              <Form.Item
                label="Start Range"
                name="start_range"
                // rules={[{ required: true, message: "Select Start Range" }]}
                style={{
                  width: "100%"
                }}>
                <EditableRowShow
                  label={"ID Range Start"}
                  id={"start_range"}
                  type={RowShowInputTypes.NUMBER}
                />
              </Form.Item>
            </Col>
            <Col span={10} offset={4}>
              <Form.Item
                label="End Range"
                name="end_range"
                // rules={[{ required: true, message: "Select End Range" }]}
                style={{
                  width: "100%"
                }}>
                <EditableRowShow
                  label={"ID Range End"}
                  id={"end_range"}
                  type={RowShowInputTypes.NUMBER}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Confirm
            </Button>
            <Button style={{ marginLeft: "1rem" }} onClick={handleCancel}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CsvDownloadModal;
