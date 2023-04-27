import { Modal, Space, Button, Select, Typography, Tag } from "antd";

interface PropType {
  isQrVisible: boolean;
  handleQrOk: () => void;
  handleQrCancel: () => void;
}
const { Text } = Typography;
const { Option } = Select;
function QrInactive({ isQrVisible, handleQrOk, handleQrCancel }: PropType) {
  function onChange(value: string) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val: string) {
    console.log("search:", val);
  }
  return (
    <Modal
      title="Select Crate Template"
      visible={isQrVisible}
      onOk={handleQrOk}
      onCancel={handleQrCancel}
      footer={
        <Space size={"large"}>
          <Button key="back" type="primary" onClick={handleQrOk}>
            Submit
          </Button>
        </Space>
      }>
      {
        <Select
          showSearch
          style={{ width: 400 }}
          placeholder=""
          optionFilterProp="children"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onSearch={onSearch}>
          <Option value="active">
            
          </Option>

          <Option value="inactive">
            {" "}
            {<Text>Template Name -{<Text strong> Crate Template ID</Text>}</Text>}
            <br />
            {<Tag color="#0052cc">Permanent</Tag>}
          </Option>
          <Option value="disable">
            {<Text>Template Name -{<Text strong> Crate Template ID</Text>}</Text>}
            <br />
            {<Tag color="#0052cc">Permanent</Tag>}
          </Option>
        </Select>
      }
      {}
    </Modal>
  );
}

export default QrInactive;
