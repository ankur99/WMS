import { Modal, Button, Form, Input, InputNumber, Space, Spin } from "antd";
import DebounceSelect from "../common/DebounceSelect";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  BundlingProp,
  ItemSendProp,
  RecipeCreateAndEditAccordingToFrontendProps,
  RecipeCreateSendData,
  RecipeCreateSendPayload
} from "../../types/bundlingTypes";
import {
  onErrorNotification,
  showErrorNotification,
  showSuccessToast
} from "../../utils/helperFunctions";
import { useCreateRecipe, useEditRecipe } from "../../hooks/useRQBundling";
import { fetchProductList } from "../../api/fetchListApi";

type BulkProps = {
  loading?: boolean;
  visible: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  title: "Recipe Create" | "Recipe Edit";
  initialValues?: BundlingProp | undefined;
};

const BundlingRecipeModal = ({
  loading = false,
  visible,
  handleOk,
  handleCancel,
  title,
  initialValues
}: BulkProps) => {
  const [form] = Form.useForm();

  const onSuccess = (msg: string) => {
    form.resetFields();
    showSuccessToast(msg);
    handleOk();
  };

  const { isLoading: recipeCreateLoading, mutate: recipeCreate } = useCreateRecipe({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const { isLoading: recipeEditLoading, mutate: recipeEdit } = useEditRecipe({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: RecipeCreateAndEditAccordingToFrontendProps) => {
    if (values?.items?.length === 0 || values.items === undefined) {
      // showErrorToast("Please add at least one item, by clicking Add More button");
      showErrorNotification({
        msg: "Error",
        desc: "Please add at least one item, by clicking Add More button"
      });
      return;
    }

    if (values?.items?.length === 1 && values.items?.[0].quantity < 2) {
      // showErrorToast("Bundling can't be made with less than 2 quantity for a single product");
      showErrorNotification({
        msg: "Error",
        desc: "Bundling can't be made with less than 2 quantity for a single product"
      });
      return;
    }

    if (title === "Recipe Create") {
      // const payload = formatDataForRecipe(values);
      const payload = formatAccordingToBackend(values);
      recipeCreate({ payload });
    } else {
      if (initialValues?.id) {
        const payload = formatAccordingToBackend(values) as unknown as RecipeCreateSendData;
        recipeEdit({ id: initialValues?.id, payload });
      }
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
      <Spin spinning={recipeCreateLoading || recipeEditLoading}>
        <Form
          form={form}
          name="recipe-modal"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={initialValues}>
          <Form.Item
            name="name"
            label="Bundle Name"
            rules={[{ required: true, message: "Missing Bundle Name" }]}>
            <Input />
          </Form.Item>
          {/* Adding URLS */}
          <Form.List name="instruction_link">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.name !== curValues.name || prevValues.items !== curValues.items
                      }>
                      {() => (
                        <Form.Item
                          {...field}
                          label="Instruction Url"
                          name={[field.name, "url"]}
                          rules={[
                            { required: false, message: "Missing Url" },
                            {
                              validator: (rule: unknown, typedValue: string) => {
                                if (
                                  typedValue &&
                                  typedValue?.trim()?.length > 0 &&
                                  (!typedValue.includes("google.com") ||
                                    !typedValue.includes("https://"))
                                ) {
                                  return Promise.reject("Provided Valid Google Drive Url");
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}>
                          <Input />
                        </Form.Item>
                      )}
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ fontSize: "1rem", color: "#cc003d" }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Instruction Urls From Google Drive
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          {/* Adding Products */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} style={{ display: "flex" }} align="baseline">
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.name !== curValues.name || prevValues.items !== curValues.items
                      }>
                      {() => (
                        <Form.Item
                          {...field}
                          label="Product ID"
                          name={[field.name, "product"]}
                          rules={[{ required: true, message: "Missing Product Name" }]}>
                          <DebounceSelect
                            placeholder="Select Product"
                            fetchOptions={fetchProductList}
                            style={{ width: "180px" }}
                          />
                        </Form.Item>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="Quantity"
                      name={[field.name, "quantity"]}
                      // rules={[{ required: true, message: "Missing Quantity" }]}>
                      rules={[
                        { required: true, message: "Missing Quantity" },
                        {
                          validator: (rule: unknown, typedValue: string) => {
                            if (+typedValue < 1) {
                              return Promise.reject("Provided Quantity can't be less than 1");
                            }
                            return Promise.resolve();
                          }
                        }
                      ]}>
                      <InputNumber />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ fontSize: "1rem", color: "#cc003d" }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add More Products
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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

export default BundlingRecipeModal;

const formatAccordingToBackend = (values: RecipeCreateAndEditAccordingToFrontendProps) => {
  const name = values.name;
  // const discount = values?.discount;

  let instruction_link = null;

  if (
    values?.instruction_link &&
    values?.instruction_link?.length > 0 &&
    values?.instruction_link[0]?.url !== undefined
  ) {
    instruction_link = values.instruction_link;
  }

  const items: ItemSendProp[] = values.items.map((item) => {
    return {
      // discount: discount,
      quantity: item.quantity,
      product_id: +item?.product?.key
    };
  });

  const payload: RecipeCreateSendPayload = {
    name,
    items
  };

  if (instruction_link) {
    payload.instruction_link = instruction_link;
  }

  return payload;
};
