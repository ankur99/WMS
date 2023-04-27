import { Space, Menu, Dropdown, Divider, Typography } from "antd";
import Paper from "../../../Components/common/Paper";
import { DownOutlined } from "@ant-design/icons";
import Cardtable from "../../../Components/CardTable";
import { useState } from "react";
import { getQCDataBackend } from "../../../api/crateAPI";
import { formatDate } from "../../../utils/constants";
import { ContainerProps, QCDataProps, QCRecevied } from "../../../types/crateQCTypes";

import { useNavigate } from "react-router-dom";
import { onErrorNotification } from "../../../utils/helperFunctions";

const { Text } = Typography;

const hoverMenu = (containers: ContainerProps[]) => {
  return (
    <Menu>
      {containers?.map((el, index) => (
        <Menu.Item key={el.id}>
          <Space direction="vertical">
            <Space>
              <Text type="secondary">Template Name :-</Text>
              <Text>{el.template_name}</Text>
            </Space>
            <Space>
              <Text type="secondary">ContainerId :-</Text>
              <Text>{el.crate_code}</Text>
            </Space>
          </Space>
          {containers.length - 1 != index && <Divider style={{ margin: 5 }} />}
        </Menu.Item>
      ))}
      {(!containers || containers?.length === 0) && <Menu.Item>No Containers Present</Menu.Item>}
    </Menu>
  );
};

const CrateQC = () => {
  const [qcData, setQCData] = useState<QCRecevied>();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Picklist ID",
      dataIndex: "id",
      key: "id",
      showSearch: true,
      type: "input",
      render: (value: number, row: QCDataProps) => (
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate(`/home/crate-management/qc/${row.id}`);
          }}>
          {value}
        </a>
      )
    },
    {
      title: "No. of Orders in picklist",
      dataIndex: "order_count",
      key: "order_count"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => <>{formatDate(value)}</>
    },
    {
      title: "Picked By",
      dataIndex: "picked_by",
      key: "picked_by",
      showSearch: true,
      type: "input"
    },
    {
      title: "Action",
      render: (_: unknown, row: QCDataProps) => (
        <Space size="large">
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate(`/home/crate-management/qc/${row.id}`);
            }}>
            Proceed
          </a>
          <Dropdown overlay={() => hoverMenu(row.containers)}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Containers <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      )
    }
  ];

  const getQCData = async (params: Record<string, unknown>) => {
    setLoading(true);
    await getQCDataBackend(params)
      .then((res) => {
        setQCData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  return (
    <Paper>
      <Cardtable
        total={qcData?.meta && qcData?.meta?.total}
        getData={getQCData}
        loading={loading}
        dataSource={qcData?.data}
        columns={columns}
        showPagination
        rowKey={(row: QCDataProps) => row.id}
      />
    </Paper>
  );
};

export default CrateQC;
