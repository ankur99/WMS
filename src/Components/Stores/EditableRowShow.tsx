import { Form, Input, Switch, Select, InputNumber, DatePicker, Checkbox, Radio } from "antd";
// import fetchPinList from "../../api/fetchStoreLists";
import { ArrayData, EditableRowShowProps, RowShowInputTypes } from "../../types/updateStoreTypes";
import DebounceSelectOptionGroup from "../common/DebounceOptionsSelect";
import DebounceSelect from "../common/DebounceSelect";

const { Option } = Select;

const EditableRowShow = ({
  label,
  type,
  id,
  arrayData,
  required = true,
  disabled = false,
  pattern,
  fetchApi,
  labelToShow = false,
  marginBottom = false,
  mode,
  debounceId,
  debounceName,
  debounceName2,
  clearOptionsAfterSelect
}: EditableRowShowProps) => {
  switch (type) {
    case RowShowInputTypes.TEXT:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[{ required: required, message: `Please input your ${label}!` }]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Input disabled={disabled} />
        </Form.Item>
      );
    case RowShowInputTypes.NUMBER:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[{ required: required, message: `Please input valid ${label}!` }]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <InputNumber disabled={disabled} style={{ width: "100%" }} />
        </Form.Item>
      );
    case RowShowInputTypes.MULTI_TAGS:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          style={marginBottom ? {} : { marginBottom: 0 }}
          rules={[{ required: required, message: `Please input your ${label}!` }]}>
          <Select mode="multiple" disabled={disabled}>
            {arrayData &&
              arrayData.map((item: ArrayData) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      );
    case RowShowInputTypes.TAG:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          valuePropName="checked"
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Switch disabled={disabled} />
        </Form.Item>
      );

    case RowShowInputTypes.SINGLE_SELECT:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[{ required: required, message: `Please select a option from ${label}!` }]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Select
            placeholder="Select a option"
            allowClear
            disabled={disabled}
            showSearch
            filterOption={(input, option) =>
              (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }>
            {arrayData &&
              arrayData.map((item: ArrayData) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
      );

    case RowShowInputTypes.DATE:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          style={marginBottom ? {} : { marginBottom: 0 }}
          rules={[{ required: required, message: `Please select a ${label}!` }]}>
          <DatePicker format={"DD-MM-YYYY"} disabled={disabled} />
        </Form.Item>
      );
    case RowShowInputTypes.DEBOUNCE_SELECT:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          style={marginBottom ? {} : { marginBottom: 0 }}
          rules={[{ required: required, message: `Please select a ${label}!` }]}>
          <DebounceSelect
            placeholder={`Please search for ${label}`}
            fetchOptions={fetchApi}
            style={{ width: "100%" }}
            disabled={disabled}
            mode={mode}
            debounceId={debounceId}
            debounceName={debounceName}
            debounceName2={debounceName2}
            clearOptionsAfterSelect={clearOptionsAfterSelect}
          />
        </Form.Item>
      );
    case RowShowInputTypes.DEBOUNCE_SELECT_OPTION_GROUP:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          style={marginBottom ? {} : { marginBottom: 0 }}
          rules={[{ required: required, message: `Please select a ${label}!` }]}>
          <DebounceSelectOptionGroup
            placeholder={`Please search for ${label}`}
            fetchOptions={fetchApi}
            style={{ width: "100%" }}
            disabled={disabled}
            mode={mode}
          />
        </Form.Item>
      );
    case RowShowInputTypes.PINCODE:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          // rules={[{ required: required, message: `Please input valid ${label}!` }]}
          rules={[
            { required: required, message: `Please input valid ${label}!` },
            {
              validator: (rule: unknown, typedValue: string) => {
                if (typedValue.toString().length !== 6) {
                  return Promise.reject("Pincode should of 6 digits");
                }
                return Promise.resolve();
              }
            }
          ]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <InputNumber style={{ width: "100%" }} disabled={disabled} />
        </Form.Item>
      );
    case RowShowInputTypes.NUMBER_WITH_CUSTOM_RULE:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[
            { required: required, message: `Please input valid ${label}!` },
            {
              pattern: pattern,
              message: `Please input valid ${label}!`
            }
          ]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <InputNumber style={{ width: "100%" }} disabled={disabled} />
        </Form.Item>
      );
    case RowShowInputTypes.STRING_WITH_CUSTOM_RULE:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[
            { required: required, message: `Please input valid ${label}!` },
            {
              pattern: pattern,
              message: `Please input valid ${label}!`
            }
          ]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Input disabled={disabled} />
        </Form.Item>
      );
    case RowShowInputTypes.CHECKBOX:
      return (
        <Form.Item
          valuePropName="checked"
          name={id}
          rules={[{ required: required, message: `Please input your ${label}!` }]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Checkbox disabled={disabled}>{labelToShow ? label : ""}</Checkbox>
        </Form.Item>
      );

    case RowShowInputTypes.RADIO_BUTTON:
      return (
        <Form.Item
          label={labelToShow ? label : ""}
          name={id}
          rules={[{ required: required, message: `Please click ${label}` }]}
          style={marginBottom ? {} : { marginBottom: 0 }}>
          <Radio.Group disabled={disabled}>
            {arrayData &&
              arrayData.map((item: ArrayData) => (
                <Radio value={item.id} key={item.id}>
                  {item.name}
                </Radio>
              ))}
          </Radio.Group>
        </Form.Item>
      );

    default:
      return <>NOTE : Invalid Type, Please Check Inside EditableRowShowComponent</>;
  }
};

export default EditableRowShow;
