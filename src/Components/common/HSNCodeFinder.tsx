import { useEffect } from "react";
import { Spin, Form, Row, Col, Button, Typography, Table } from "antd";
import Column from "antd/lib/table/Column";
import {
  fetchClass1,
  fetchClass2,
  fetchClass3,
  fetchClass4,
  fetchProductGroups,
  fetchProductSeach
} from "../../api/fetchLists";
import { useHSNFindersList } from "../../hooks/useRQProductRequest";
import useTable from "../../hooks/useTable";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import { onError } from "../../utils/helperFunctions";
import EditableRowShow from "../Stores/EditableRowShow";
import Paper from "./Paper";

const { Title } = Typography;

const HSNCodeFinder = () => {
  const [form] = Form.useForm();

  const { currentPage, handleTableChange } = useTable();

  const hsnValue = Form.useWatch("hsn_sac_code", form);
  const groupValue = Form.useWatch("group", form);
  const productValue = Form.useWatch("product", form);
  const cl4Value = Form.useWatch("cl4", form);
  const cl1Value = Form.useWatch("cl1", form);
  const cl2Value = Form.useWatch("cl2", form);
  const cl3Value = Form.useWatch("cl3", form);

  const { isLoading, data, refetch } = useHSNFindersList({
    currentPage,
    onError,
    hsn: hsnValue,
    cl4_id: cl4Value ? cl4Value.key : undefined,
    product_id: productValue ? productValue?.key : undefined,
    group_id: groupValue ? groupValue?.key : undefined,
    cl1_id: cl1Value ? cl1Value?.key : undefined,
    cl2_id: cl2Value ? cl2Value?.key : undefined,
    cl3_id: cl3Value ? cl3Value?.key : undefined
  });

  const onFinish = () => {
    if (hsnValue || groupValue || productValue || cl4Value || cl1Value || cl2Value || cl3Value) {
      refetch();
    }
  };

  useEffect(() => {
    if (hsnValue || groupValue || productValue || cl4Value || cl1Value || cl2Value || cl3Value) {
      refetch();
    }
  }, [currentPage]);

  return (
    <Spin spinning={isLoading}>
      <Paper>
        <Form
          name="hsn-code-finder"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          form={form}>
          <Row gutter={24}>
            <Col xs={12}>
              <Title level={3}>HSN Finder</Title>
            </Col>
            <Col xs={12} style={{ textAlign: "right" }}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button htmlType="submit" type="primary" size="small">
                  Search
                </Button>
              </Form.Item>
            </Col>

            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"HSN Code"}
                id="hsn_sac_code"
                type={RowShowInputTypes.NUMBER}
                labelToShow={true}
                marginBottom={true}
                required={false}
              />
            </Col>

            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"Product Group"}
                id={"group"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={false}
                // disabled={hsnValue !== undefined ? false : true}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchProductGroups}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"Product Name"}
                id={"product"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                // disabled={hsnValue !== undefined ? false : true}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchProductSeach}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"CL1"}
                id={"cl1"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchClass1}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"CL2"}
                id={"cl2"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchClass2}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"CL3"}
                id={"cl3"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchClass3}
              />
            </Col>
            <Col sm={12} xs={24}>
              <EditableRowShow
                label={"CL4"}
                id={"cl4"}
                type={RowShowInputTypes.DEBOUNCE_SELECT}
                // disabled={hsnValue !== undefined ? false : true}
                required={false}
                labelToShow={true}
                marginBottom={true}
                fetchApi={fetchClass4}
              />
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="hsn_sac_code"
          size="small"
          dataSource={data?.results}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: 15,
            total: data && data?.count ? data?.count : 15,
            // total: data ? data?.count : 5,
            showSizeChanger: false
          }}
          // loading={tableLoading}
          loading={false}>
          <Column title="Name" dataIndex={"name"} align="center" />
          <Column title="GID" dataIndex={"group_id"} align="center" />
          <Column title="HSN CODE" dataIndex={"hsn_sac_code"} align="center" />
          <Column title="CL1 ID" dataIndex={"newcat_l1_id"} align="center" />
          <Column title="CL1 Name" dataIndex={"newcat_l1_name"} align="center" />
          <Column title="CL2 ID" dataIndex={"newcat_l2_id"} align="center" />
          <Column title="CL2 Name" dataIndex={"newcat_l2_name"} align="center" />
          <Column title="CL3 ID" dataIndex={"newcat_l3_id"} align="center" />
          <Column title="CL3 Name" dataIndex={"newcat_l3_name"} align="center" />
          <Column title="CL4 ID" dataIndex={"cl4_id"} align="center" />
          <Column title="CL4 Name" dataIndex={"newcat_l4_name"} align="center" />
        </Table>
      </Paper>
    </Spin>
  );
};
export default HSNCodeFinder;
