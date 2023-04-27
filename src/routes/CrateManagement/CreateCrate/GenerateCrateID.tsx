import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Row,
  Col,
  Typography,
  Card,
  Spin,
  InputNumber
} from "antd";
import style from "./enterDetails.module.css";

import { generateCrateIds, getTemplates } from "../../../api/crateAPI";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import Paper from "../../../Components/common/Paper";
import { PrintLabels } from "../../../Components/crateManagement/createCrate/PrintLabels";
import { patternRegex } from "../../../utils/regexValues";
const { Option } = Select;
const { TextArea } = Input;

const GenerateCrateID: React.FC = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printData, setPrintData] = useState([]);
  const [qrCount, setQrCount] = useState(0);

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // console.log("Received values of form: ", values);
    setQrCount(values?.count || 1);

    // console.log("Success:", values);
    setLoading(true);
    await generateCrateIds(values)
      .then((res) => {
        setLoading(false);
        console.log(res);
        setPrintData(res);
        Modal.confirm({
          icon: <CheckCircleOutlined style={{ color: "green" }} />,
          width: 500,
          title: `Crate ID${res.length > 1 && "s"} successfully created`,
          cancelText: "Done",
          okText: "Print Labels",
          onOk() {
            form.resetFields();
            handlePrint();
          },
          onCancel() {
            form.resetFields();
            console.log("Cancel");
          },
          content: (
            <Row gutter={[8, 8]}>
              {res.map((item: any, key: number) => (
                <Col key={key} span={8}>
                  <Card style={{ textAlign: "center" }} size="small">
                    <Typography.Text strong>{item.reference_id}</Typography.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.message) {
          message.error(err.response.data.message);
        } else {
          message.error("Something went wrong: ");
        }
      });

    // changeScreen(screens.START_SCREEN);
  };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log("Failed:", errorInfo);
  // };

  useEffect(() => {
    getTemplatesData();
  }, []);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const getTemplatesData = async () => {
    await getTemplates()
      .then((res: any) => {
        // console.log(res);
        setTemplates(res);
      })
      .catch((err) => {
        message.error(err);
      });
    setLoading(false);
  };

  return (
    <Paper>
      <Spin spinning={loading} tip="Generating Crate ID's...">
        <Form
          form={form}
          name="enterDetails"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item
            name="template_id"
            label="Template"
            rules={[{ required: true, message: "Please Select A Template!" }]}>
            <Select loading={loading} placeholder="Select Template" allowClear>
              {templates.map((template: any) => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="No of Crates"
            rules={[
              { required: true, message: `Please Enter No of Crates!` },
              {
                pattern: patternRegex.onlyPositive,
                message: `Please input valid number!`
              }
            ]}>
            <InputNumber placeholder="Enter Quantity" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Write discription"
            name="description"
            rules={[
              { required: true, message: "Please write a description!" },
              {
                validator: (rule: unknown, typedValue: string) => {
                  if (typedValue?.length > 32) {
                    return Promise.reject("Provided description is too long!");
                  }
                  return Promise.resolve();
                }
              }
            ]}>
            <TextArea placeholder="Enter Description text" rows={2} />
          </Form.Item>

          <Form.Item
            name="count"
            label="Qr Count To Print per crate"
            rules={[
              { required: true, message: "Please input a valid number" },
              {
                pattern: patternRegex.onlyPositive,
                message: `Please input whole number!`
              }
            ]}>
            <InputNumber />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 0, span: 16 }} className={style.label}>
            <Button type="primary" htmlType="submit">
              Proceed
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      <div style={{ display: "none" }}>
        <PrintLabels printData={printData} ref={componentRef} count={qrCount} />
      </div>
    </Paper>
  );
};

export default GenerateCrateID;
