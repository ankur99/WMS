import { Modal, Input, Button, Form } from "antd";
import { useState } from "react";
import ScanBarcode from "./ScanBarcode";

interface PropType {
  isQtyVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

function QtyPicked({ isQtyVisible, handleOk, handleCancel }: PropType) {
  const [isBarCodeVisible, setIsBarCodeVisible] = useState(false);
  const ShowBarcode = () => {
    setIsBarCodeVisible(true);
  };
  const handleScanOk = () => {
    setIsBarCodeVisible(false);
  };

  const handleScanCancel = () => {
    setIsBarCodeVisible(false);
  };
  return (
    <>
      <Modal title="Enter Qty Picked" visible={isQtyVisible} onCancel={handleCancel} footer={null}>
        <Form name="basic" onFinish={ShowBarcode}>
          <Form.Item
            label="Qty Picked"
            name="quantity"
            rules={[{ required: true, message: "Please input your Qty Picked!" }]}>
            <Input placeholder="Qty Picked" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <ScanBarcode
        isBarCodeVisible={isBarCodeVisible}
        handleScanOk={handleScanOk}
        handleScanCancel={handleScanCancel}
      />
    </>
  );
}

export default QtyPicked;
