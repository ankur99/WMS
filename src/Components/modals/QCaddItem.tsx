import { Button, Form, Input, InputNumber, Modal, Tag, Typography } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { QcSearchCrate, searchTemplates } from "../../api/crateAPI";
import { QCaddItemType } from "../../types/crateQCTypes";
import { onErrorNotification } from "../../utils/helperFunctions";
import DebounceSelect from "../common/DebounceSelect";

type PropType = {
  visible: boolean;
  onCancel: () => void;
  addItem: (values: QCaddItemType) => void;
  selectedVariant: number | null;
};

type urlParms = {
  picklistId: string;
  orderId: string;
};

enum addItemSteps {
  QUANTITY_MODAL,
  SCAN_CRATE_MODAL,
  SELECT_TEMPLATE_MODAL,
  EXPIRY_MODAL_MODAL
}

function QCaddItem({ visible, onCancel, addItem, selectedVariant }: PropType) {
  const [screen, setScreen] = useState(addItemSteps.QUANTITY_MODAL);
  const [searchingTemplates, setSearchingTemplates] = useState(false);
  const [form] = Form.useForm();
  const urlParms = useParams() as urlParms;

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        switch (screen) {
          case addItemSteps.QUANTITY_MODAL:
            setScreen(addItemSteps.SCAN_CRATE_MODAL);
            break;
          case addItemSteps.SCAN_CRATE_MODAL:
            {
              searchBarcode();
            }
            break;
          case addItemSteps.SELECT_TEMPLATE_MODAL:
            submitData();

            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchBarcode = async () => {
    setSearchingTemplates(true);
    await QcSearchCrate(form.getFieldValue("barcode"), urlParms.picklistId, urlParms.orderId)
      .then((res) => {
        console.log(res.data.template);
        if (res.data.template) {
          form.setFieldsValue({ template_id: res.data });
          form.setFieldsValue({ crate_id: res.data.id });
          submitData();
        } else {
          form.setFieldsValue({ crate_id: res.data.id });
          setScreen(addItemSteps.SELECT_TEMPLATE_MODAL);
        }
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setSearchingTemplates(false);
    return;
  };

  const submitData = () => {
    const values = form.getFieldsValue();
    delete values["barcode"];
    values.picklist_id = urlParms.picklistId;
    values.order_id = urlParms.orderId;
    values.template_id = values.template_id.template_id
      ? values.template_id.template_id
      : values.template_id.value;
    values.variant_id = selectedVariant;
    console.log("final values", values);
    addItem(values);
    closeForm();
  };

  const closeForm = () => {
    form.resetFields();
    setScreen(addItemSteps.QUANTITY_MODAL);
    onCancel();
  };

  return (
    <Modal
      title={<Typography.Text>Add Item</Typography.Text>}
      visible={visible}
      onCancel={closeForm}
      destroyOnClose={true}
      footer={null}>
      <Form form={form} layout="vertical" name="basic">
        <Form.Item
          hidden={screen !== addItemSteps.QUANTITY_MODAL}
          label="Qty Picked"
          name="quantity"
          rules={[
            {
              required: screen === addItemSteps.QUANTITY_MODAL,
              message: "Please input your Qty Picked!"
            }
          ]}>
          <InputNumber placeholder="Qty Picked" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          hidden={screen !== addItemSteps.SCAN_CRATE_MODAL}
          label="Scan Crate QR Code"
          name="barcode"
          rules={[
            { required: screen === addItemSteps.SCAN_CRATE_MODAL, message: "Please input barcode!" }
          ]}>
          <Input placeholder="Scan Crate QR Code" />
        </Form.Item>

        <Form.Item
          hidden={screen !== addItemSteps.SELECT_TEMPLATE_MODAL}
          label="Select Crate Template"
          name="template_id"
          rules={[
            {
              required: screen === addItemSteps.SELECT_TEMPLATE_MODAL,
              message: "Please select template!"
            }
          ]}>
          <DebounceSelect
            customOption={(value) => {
              return (
                <div>
                  {
                    <Typography.Text type="secondary">
                      Template Name -{<Typography.Text strong> {value.name}</Typography.Text>}
                    </Typography.Text>
                  }
                  <br />
                  {<Tag color={value.is_temporary ? "#89F3FA" : "#466FFF"}>Temporary</Tag>}
                </div>
              );
            }}
            fetchOptions={searchTemplates}
          />
        </Form.Item>

        <Form.Item hidden={true} name="crate_id" rules={[{ required: false }]}>
          <Input placeholder="Crate id" />
        </Form.Item>

        <br />

        <Button loading={searchingTemplates} onClick={() => handleNext()} type="primary">
          Submit
        </Button>
      </Form>
    </Modal>
  );
}

export default QCaddItem;
