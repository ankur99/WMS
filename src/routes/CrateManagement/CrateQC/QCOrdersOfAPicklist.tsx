import Paper from "../../../Components/common/Paper";
import Cardtable from "../../../Components/CardTable";
import { useState } from "react";
import { getQCOrdersOfAPicklist } from "../../../api/crateAPI";
import { QCOrdersOfAPicklistReceivedData, QCOrdersProps } from "../../../types/crateQCTypes";

import { useNavigate, useParams } from "react-router-dom";
import { onErrorNotification } from "../../../utils/helperFunctions";
import { Typography } from "antd";

import style from "./qcOrdersPicklist.module.css";

const QCOrdersOfAPicklist = () => {
  const [qcOrdersData, setQCOrdersData] = useState<QCOrdersOfAPicklistReceivedData>();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { picklistId } = useParams();

  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
      showSearch: true,
      type: "input",
      render: (value: number, row: QCOrdersProps) => (
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate(`/home/crate-management/qc/${picklistId}/${row.id}`);
          }}>
          {value}
        </a>
      )
    },
    {
      title: "Action",
      render: (_: unknown, row: QCOrdersProps) => (
        <a
          onClick={(e) => {
            e.preventDefault();
            navigate(`/home/crate-management/qc/${picklistId}/${row.id}`);
          }}>
          Proceed
        </a>
      )
    }
  ];

  const getQCData = async (params: Record<string, unknown>) => {
    setLoading(true);
    await getQCOrdersOfAPicklist(picklistId, params)
      .then((res) => {
        setQCOrdersData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  return (
    <Paper>
      <div className={style.pickedWrapper}>
        <Typography.Text type="secondary" className={style.pickedBy}>
          Picked By: {qcOrdersData?.data?.[0]?.picked_by}
        </Typography.Text>
      </div>
      <Cardtable
        // total={qcOrdersData?.meta && qcOrdersData?.meta?.total}
        getData={getQCData}
        loading={loading}
        dataSource={qcOrdersData?.data?.[0]?.orders}
        columns={columns}
        showPagination={false}
        rowKey={(row: QCOrdersProps) => row.id}
      />
    </Paper>
  );
};

export default QCOrdersOfAPicklist;
