import Paper from "../../common/Paper";
import Cardtable from "../../CardTable";
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
    title: "Skip Reason",
    dataIndex: "reason",
    key: "reason"
  }
];

const SendToIat = () => {
  const [qcOrdersSendToIATData, setQCOrdersSendToIATData] = useState<QCOrdersPendingReceivedData>();
  const [loading, setLoading] = useState(true);

  const { picklistId, orderId } = useParams();

  const getQCSendToIATData = async (params: Record<string, unknown>) => {
    setLoading(true);
    await getQCOrdersStatus(picklistId, orderId, params, "iat")
      .then((res) => {
        setQCOrdersSendToIATData(res);
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
        getData={getQCSendToIATData}
        loading={loading}
        dataSource={qcOrdersSendToIATData?.data}
        columns={columns}
        showPagination={false}
        rowKey={(row: QCOrdersProps) => row.id}
      />
    </Paper>
  );
};

export default SendToIat;
