import { Col, Row, Skeleton, Space, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCrateData,
  getLedgerDetailStats,
  getQcCrateLedger,
  getQcCrateLedgerDetail
} from "../../../api/crateAPI";
import Cardtable from "../../../Components/CardTable";
import Paper from "../../../Components/common/Paper";

type UrlParams = {
  id: string;
};

export default function LedgerView() {
  const [ledgerData, setLedgerData] = useState<any>([]);
  const [cardData, setCardData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const urlParams = useParams() as UrlParams;

  useEffect(() => {
    getCardData();
  }, []);

  const getCardData = async () => {
    setLoading(true);
    await getLedgerDetailStats(urlParams.id)
      .then((res) => {
        console.log("card data", res.data);
        setCardData(res.data);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const getLedgerDetail = async (params: any) => {
    setLoading(true);
    await getQcCrateLedgerDetail(params, urlParams.id)
      .then((res) => {
        console.log(res);
        console.log("table data", res);
        setLedgerData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const navigate = useNavigate();

  const columns = [
    {
      title: "WH ID",
      dataIndex: "warehouse_id",
      key: "warehouse_id",
      customIndex: "w_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "Task Type",
      dataIndex: "task_type",
      key: "task_type",
      showSearch: true,
      type: "input"
    },
    {
      title: "Task ID",
      dataIndex: "task_id",
      key: "task_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "Employee Name",
      dataIndex: "assigned_to",
      key: "assigned_to"
    },
    {
      title: "Started at",
      dataIndex: "assigned_at",
      key: "assigned_at",
      render: (text: any, record: any) => moment(text).format("lll"),
      showSearch: true,
      type: "date"
    },
    {
      title: "Completed At",
      dataIndex: "completed_at",
      key: "completed_at"
    },
    {
      title: "Time Taken",
      dataIndex: "time_taken",
      key: "time_taken"
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right" as const,
      width: 100,
      render: (text: string, record: any) => (
        <a
          onClick={() =>
            navigate(
              `/home/crate-management/ledger/${record.task_id}/${record.crate_id}/${record.task_type}`
            )
          }>
          View
        </a>
      )
    }
  ];
  return (
    <Space size="large" direction="vertical" style={{ width: "100%" }}>
      <Paper>
        {!cardData.template || loading ? (
          <Skeleton />
        ) : (
          <Row>
            <Col span={4} className="center">
              <Typography.Title level={5}>Crate Id</Typography.Title>
              <Typography.Text>{cardData.reference_id}</Typography.Text>
            </Col>
            <Col span={4} className="center">
              <Typography.Title level={5}>Color</Typography.Title>
              <Typography.Text>{cardData.template.color}</Typography.Text>
            </Col>
            <Col span={4} className="center">
              <Typography.Title level={5}>Dimensions</Typography.Title>
              <Typography.Text>{cardData.template.dimensions}</Typography.Text>
            </Col>
            <Col span={4} className="center">
              <Typography.Title level={5}>Type</Typography.Title>
              <Typography.Text>{cardData.is_temporary ? "Temporary" : "Permanent"}</Typography.Text>
            </Col>
            <Col span={4} className="center">
              <Typography.Title level={5}>Created By</Typography.Title>
              <Typography.Text>{cardData.created_by}</Typography.Text>
            </Col>
            <Col span={4} className="center">
              <Typography.Title level={5}>Created At</Typography.Title>
              <Typography.Text>{moment(cardData.created_at).format("lll")}</Typography.Text>
            </Col>
          </Row>
        )}
      </Paper>
      <Paper>
        <Cardtable
          total={ledgerData.meta && ledgerData.meta.total}
          getData={getLedgerDetail}
          loading={loading}
          dataSource={ledgerData.data}
          columns={columns}
          showPagination
          rowKey={(row: any) => row.id}
        />
      </Paper>
    </Space>
  );
}
function onErrorNotification(err: any) {
  throw new Error("Function not implemented.");
}
