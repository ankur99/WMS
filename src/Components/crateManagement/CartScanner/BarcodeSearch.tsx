import { Form, Input, Button, Typography } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { useParams } from "react-router-dom";
import { BarcodeSearchProps } from "../../../types/crateQCTypes";

type urlParms = {
  picklistId: string;
  orderId: string;
};

const BarcodeSearch = ({
  onSearchBarcode,
  form
}: {
  onSearchBarcode: (values: BarcodeSearchProps) => void;
  form: FormInstance<any>;
}) => {
  const urlParms = useParams() as urlParms;

  const onFinish = (values: { barcode: string }) => {
    const searchParams: BarcodeSearchProps = {
      barcode: values.barcode,
      picklist_id: urlParms.picklistId,
      order_id: urlParms.orderId
    };
    onSearchBarcode(searchParams);
  };

  return (
    <>
      <Typography.Title level={5}>Scan Products By Barcode</Typography.Title>

      <Form style={{ width: "100%", marginTop: 10 }} onFinish={onFinish} form={form}>
        <Form.Item
          style={{ marginBottom: "12px" }}
          name="barcode"
          rules={[{ required: true, message: "Please input your barcode!" }]}>
          <Input placeholder="Enter Barcode" />
        </Form.Item>
      </Form>
    </>
  );
};

export default BarcodeSearch;
