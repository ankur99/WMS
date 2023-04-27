import { Modal, Input, Space, Button } from "antd";
import { useState } from "react";
import QrInactive from "./QrInactive";

interface PropType {
  isBarCodeVisible: boolean;
  handleScanOk: () => void;
  handleScanCancel: () => void;
}

function ScanBarcode({ isBarCodeVisible, handleScanOk, handleScanCancel }: PropType) {
  const [isQrVisible, setIsQrVisible] = useState(false);

  const ShowQr = () => {
    setIsQrVisible(true);
  };
  const handleQrOk = () => {
    setIsQrVisible(false);
  };

  const handleQrCancel = () => {
    setIsQrVisible(false);
  };
  return (
    <>
      <Modal
        title="Scan Barcode"
        visible={isBarCodeVisible}
        //   onOk={handleScanOk}
        onCancel={handleScanCancel}
        footer={
          <Space size={"large"}>
            <Button key="back" type="primary" onClick={ShowQr}>
              Submit
            </Button>
          </Space>
        }>
        {<Input placeholder=" Barcode" />}
      </Modal>
      <QrInactive
        isQrVisible={isQrVisible}
        handleQrOk={handleQrOk}
        handleQrCancel={handleQrCancel}
      />
    </>
  );
}
export default ScanBarcode;
