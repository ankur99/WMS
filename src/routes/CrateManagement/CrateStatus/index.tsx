import { Badge, Col, message, Row, Space, Table, TablePaginationConfig, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCrateStatus, getCrateStatusStats, getTaskTypes } from "../../../api/crateAPI";
import Cardtable from "../../../Components/CardTable";
import Paper from "../../../Components/common/Paper";
import { onErrorNotification } from "../../../utils/helperFunctions";

const CreateStatus = () => {
  const [statusData, setStatusData] = useState<any>([]);
  const [cardData, setCardData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [taskTypes, setTaskTypes] = useState([]);

  const columns = [
    {
      title: "Task Type",
      dataIndex: "task_type",
      key: "task_type",
      type: "select",
      showSearch: true,
      options: taskTypes
    },
    {
      title: "Task ID",
      dataIndex: "task_id",
      key: "task_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "No. of crates used",
      dataIndex: "crate_count",
      key: "crate_count"
    },
    {
      title: "Assigned at",
      dataIndex: "assigned_at",
      key: "assigned_at",
      showSearch: true,
      type: "date",
      render: (text: any, record: any) => moment(text).format("lll")
    },
    {
      title: "Completed at",
      dataIndex: "completed_at",
      key: "completed_at",
      showSearch: true,
      type: "date",
      render: (text: any, record: any) =>
        text ? (
          moment(text).format("lll")
        ) : (
          <Typography.Text type="secondary">Not completed</Typography.Text>
        )
    },
    {
      title: "Time taken",
      dataIndex: "time_taken",
      key: "time_taken"
    },
    {
      title: "Assigned to",
      dataIndex: "assigned_to",
      key: "assigned_to",
      render: (text: any, record: any) =>
        text ? text : <Typography.Text type="secondary">Not assigned</Typography.Text>
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text: string) => <Badge color="#98f52d" text={text} />
    // },

    {
      title: "Action",
      key: "operation",
      fixed: "right" as const,
      width: 100,
      render: (text: string, record: any) => (
        <a
          onClick={() =>
            navigate(`/home/crate-management/crate-status/${record.task_id}/${record.task_type}`)
          }>
          View
        </a>
      )
    }
  ];

  useEffect(() => {
    loadCardData();
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    await getTaskTypes()
      .then((res) => {
        const options: any = [];
        res.data.forEach((element: any) => {
          options.push({
            id: element.type,
            name: element.type
          });
        });
        setTaskTypes(options);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
  };

  const loadCardData = async () => {
    await getCrateStatusStats()
      .then((res) => {
        setCardData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
  };

  const getStatusData = async (params: any) => {
    setLoading(true);
    await getCrateStatus(params)
      .then((res) => {
        setStatusData(res);
        // setTotalItems(res.meta.total);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const navigate = useNavigate();
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Paper>
        <Row>
          <Col span={12}>
            <Typography.Title level={5}>
              Average Time taken in completion of a task
            </Typography.Title>
            <Typography.Text>{cardData?.total_time}</Typography.Text>
          </Col>
          <Col span={12}>
            <Typography.Title level={5}>Average no of crates used per task</Typography.Title>
            <Typography.Text>{cardData?.average_crate}</Typography.Text>
          </Col>
        </Row>
      </Paper>

      <Paper>
        <Cardtable
          total={statusData.meta && statusData.meta.total}
          getData={getStatusData}
          loading={loading}
          dataSource={statusData.data}
          columns={columns}
          showPagination
          rowKey={(row: any) => row.id}
        />
      </Paper>
    </Space>
  );
};

export default CreateStatus;
