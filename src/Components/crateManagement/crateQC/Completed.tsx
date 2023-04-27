import Paper from "../../../Components/common/Paper";
import Cardtable from "../../../Components/CardTable";
import { useState } from "react";
import { getQCOrdersStatus } from "../../../api/crateAPI";
import { QCOrdersPendingReceivedData, QCOrdersProps } from "../../../types/crateQCTypes";

import { useParams } from "react-router-dom";
import { onErrorNotification } from "../../../utils/helperFunctions";

const columns = [
  {
    title: "PID",
    dataIndex: "product_id",
    key: "product_id",
    showSearch: true,
    type: "input"
  },
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    showSearch: true,
    type: "input"
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity"
  },
  {
    title: "CrateId",
    dataIndex: "crate_id",
    key: "crate_id",
    showSearch: true,
    type: "input"
  }
];

const Pending = () => {
  const [qcOrdersCompletedData, setQCOrdersCompletedData] = useState<QCOrdersPendingReceivedData>();
  const [loading, setLoading] = useState(true);

  const { picklistId, orderId } = useParams();

  const getQCCompletedData = async (params: Record<string, unknown>) => {
    setLoading(true);
    await getQCOrdersStatus(picklistId, orderId, params, "completed")
      .then((res) => {
        setQCOrdersCompletedData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  return (
    <Paper>
      <Cardtable
        // total={qcOrdersPendingData?.meta && qcOrdersPendingData?.meta?.total}
        getData={getQCCompletedData}
        loading={loading}
        dataSource={qcOrdersCompletedData?.data}
        columns={columns}
        showPagination={false}
        rowKey={(row: QCOrdersProps) => row.id}
      />
    </Paper>
  );
};

export default Pending;
