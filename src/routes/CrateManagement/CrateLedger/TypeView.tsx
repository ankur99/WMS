import { Col, Row, Skeleton, Space, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCrateLedgerStatusProducts } from "../../../api/crateAPI";
import Cardtable from "../../../Components/CardTable";
import Paper from "../../../Components/common/Paper";
import { onErrorNotification } from "../../../utils/helperFunctions";

type UrlParams = {
  taskId: string;
  crateId: string;
  taskType: string;
};

export default function LedgerTypeView() {
  const [ledgerTypeData, setLedgerTypeData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const urlParams = useParams() as UrlParams;

  const getLedgerDetail = async (params: any) => {
    setLoading(true);
    await getCrateLedgerStatusProducts(
      urlParams.taskId,
      urlParams.taskType,
      params,
      urlParams.crateId
    )
      .then((res) => {
        console.log(res);
        console.log("table data", res);
        setLedgerTypeData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const navigate = useNavigate();

  const columns = [
    {
      title: "Crate Id",
      dataIndex: "crate_id",
      key: "crate_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "product_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: any, record: any) => moment(text).format("lll"),
      showSearch: true,
      type: "date"
    }
  ];
  return (
    <Space size="large" direction="vertical" style={{ width: "100%" }}>
      <Paper>
        <Cardtable
          total={ledgerTypeData.meta && ledgerTypeData.meta.total}
          getData={getLedgerDetail}
          loading={loading}
          dataSource={ledgerTypeData.data}
          columns={columns}
          showPagination
          rowKey={(row: any) => row.id}
        />
      </Paper>
    </Space>
  );
}
