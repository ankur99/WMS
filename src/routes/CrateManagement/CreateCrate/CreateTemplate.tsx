import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  Tag,
  Space,
  Modal,
  message,
  Spin,
  InputNumber
} from "antd";
import style from "./enterDetails.module.css";

import { basicColorsList } from "../../../utils/constants";
import { createTemplate } from "../../../api/crateAPI";
import { useNavigate } from "react-router-dom";
import Paper from "../../../Components/common/Paper";
import { patternRegex } from "../../../utils/regexValues";
const { Option } = Select;
const { TextArea } = Input;

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const formData: any = {};

    formData.name = values.name;
    formData.width = values.dimension.width;
    formData.height = values.dimension.height;
    formData.length = values.dimension.length;
    formData.color = values.crate_color;
    formData.item_type = values.type;
    formData.material = values.material;
    formData.is_temporary = values.is_temporary ? 1 : 0;
    formData.description = values.description;

    setLoading(true);
    await createTemplate(formData)
      .then((res) => {
        Modal.success({
          title: `Template Name - ${formData.name}`,
          content: "Crate Template is successfully created"
        });
        navigate("/home/crate-management/template");
      })
      .catch((err) => {
        if (err.response.data.errors.name) {
          err.response.data.errors.name.map((error: any) => {
            message.error(error);
          });
        }
        if (err.response.data.message) {
          message.error(err.response.data.message);
        } else {
          message.error("Something went wrong: ");
        }
      });
    setLoading(false);

    // changeScreen(screens.START_SCREEN);
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <Paper>
      <Spin spinning={loading} tip="Creating Crate Template...">
        <Form
          requiredMark={false}
          name="enterDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                pattern: new RegExp(/^[a-zA-Z0-9/-]+$/),
                message: "No Space or Special Caracters Allowed"
              },
              { required: true, message: "Please Enter A Name!" }
            ]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Crate Dimension (in inches)">
            <Input.Group>
              <Space direction="horizontal">
                <Form.Item
                  name={["dimension", "length"]}
                  rules={[
                    { required: true, message: `Length is required` },
                    {
                      pattern: patternRegex.postiveNumberAboveZero,
                      message: `Please input valid number!`
                    }
                  ]}
                  style={{ marginBottom: 0 }}>
                  <InputNumber placeholder="length" />
                </Form.Item>
                <Form.Item
                  name={["dimension", "width"]}
                  rules={[
                    { required: true, message: `Width is required` },
                    {
                      pattern: patternRegex.postiveNumberAboveZero,
                      message: `Please input valid number!`
                    }
                  ]}
                  style={{ marginBottom: 0 }}>
                  <InputNumber placeholder="width" />
                </Form.Item>
                <Form.Item
                  name={["dimension", "height"]}
                  rules={[
                    { required: true, message: `height is required` },
                    {
                      pattern: patternRegex.postiveNumberAboveZero,
                      message: `Please input valid number!`
                    }
                  ]}
                  style={{ marginBottom: 0 }}>
                  <InputNumber placeholder="height" />
                </Form.Item>
              </Space>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="crate_color"
            label="Color"
            rules={[{ required: true, message: "Please Select A Color!" }]}>
            <Select placeholder="Select a Color" allowClear>
              {basicColorsList.map((el) => (
                <Option value={el.label} key={el.color}>
                  <Tag color={el.hexCode}>{el.label}</Tag>
                  {el.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="material"
            label="Material"
            rules={[{ required: true, message: "Please Select Material!" }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Item Type"
            rules={[{ required: true, message: "Please Select A Type!" }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="Write discription"
            name="description"
            rules={[{ required: false, message: "Please write a description!" }]}>
            <TextArea placeholder="Enter Description text" rows={2} />
          </Form.Item>

          <Form.Item
            name="is_temporary"
            label="This is a Temporary crate"
            wrapperCol={{ span: 12 }}
            labelCol={{ span: 12 }}>
            <Switch defaultChecked={false} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 16 }} className={style.label}>
            <Button type="primary" htmlType="submit">
              Proceed
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Paper>
  );
};

export default CreateTemplate;
