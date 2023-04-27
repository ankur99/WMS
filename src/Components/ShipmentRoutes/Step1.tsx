import { Button, Form, Input } from "antd";
import { Dispatch, SetStateAction } from "react";
import { searchWarehouse } from "../../api/Search";
import DebounceSelect from "../common/DebounceSelect";

type PropType = {
  setScreen: () => void;
  setRouteDetail: Dispatch<SetStateAction<Record<string, unknown>>>;
  routeDetail: Record<string, unknown>;
};
export default function Step1({ setScreen, setRouteDetail, routeDetail }: PropType) {
  const onFinish = (values: any) => {
    setRouteDetail(values);
    setScreen();
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      initialValues={routeDetail}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off">
      <Form.Item
        label="Enter the name of the route :"
        name="route_name"
        rules={[{ required: true, message: "Please input route  name!" }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Select Starting Point :"
        name="starting_point"
        rules={[{ required: true, message: "Please input starting point!" }]}>
        <DebounceSelect
          placeholder="Select Assignee"
          fetchOptions={searchWarehouse}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16 }} style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
