import { Modal, Button, Form, Spin, Radio } from "antd";
import DebounceSelect from "../common/DebounceSelect";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { usePublishRecipe } from "../../hooks/useRQBundling";
import { fetchBrandIds, fetchGroupIds } from "../../api/fetchListApi";

type BulkProps = {
  visible: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  title: "Recipe Publish";
  id: number;
};

interface PubslishRecipeProp {
  gidtype: "NEW" | "OLD";
  gid?: {
    key: string;
    value: number;
    label: string;
  };
  brand_id?: {
    key: string;
    value: number;
    label: string;
  };
}

const BundlingPublishModal = ({ visible, handleOk, handleCancel, title, id }: BulkProps) => {
  const [form] = Form.useForm();

  const onSuccess = (msg: string) => {
    form.resetFields();
    showSuccessToast(msg);
    handleOk();
  };

  const onFinish = (values: PubslishRecipeProp) => {
    if (values.gidtype === "NEW") {
      const brand_id = values?.brand_id?.key;
      publishCrate({ id, brand_id });
      return;
    } else if (values.gidtype === "OLD") {
      const group_id = values?.gid?.key;
      publishCrate({ id, group_id });
      return;
    }
  };

  const { isLoading: recipePublishLoading, mutate: publishCrate } = usePublishRecipe({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={title}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      <Spin spinning={recipePublishLoading}>
        <Form form={form} name="publish-recipe" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="gidtype"
            label="Select GID Selection Type"
            rules={[{ required: true, message: "Missing GID Type" }]}>
            <Radio.Group>
              <Radio value={"NEW"}>Create New GID</Radio>
              <Radio value={"OLD"}>Select From Existing GID</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.gidtype !== currentValues.gidtype
            }>
            {({ getFieldValue }) =>
              getFieldValue("gidtype") === "OLD" ? (
                <Form.Item
                  label="GID"
                  name={"gid"}
                  rules={[{ required: true, message: "Missing GID" }]}>
                  <DebounceSelect
                    placeholder="Select GID"
                    fetchOptions={fetchGroupIds}
                    style={{ width: "200px" }}
                  />
                </Form.Item>
              ) : (
                getFieldValue("gidtype") === "NEW" && (
                  <Form.Item
                    label="Brand ID"
                    name={"brand_id"}
                    rules={[{ required: true, message: "Missing Brand ID" }]}>
                    <DebounceSelect
                      placeholder="Select Brandh ID"
                      fetchOptions={fetchBrandIds}
                      style={{ width: "200px" }}
                    />
                  </Form.Item>
                )
              )
            }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button key="back" onClick={handleCancel} style={{ marginLeft: "1rem" }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BundlingPublishModal;
