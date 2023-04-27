import { Button, Space } from "antd";
import moment from "moment";
import { Key, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { getQcCrateLedger } from "../../../api/crateAPI";
import Cardtable from "../../../Components/CardTable";
import { PrintLabels } from "../../../Components/crateManagement/createCrate/PrintLabels";
import { QCcrateLedgerItemType } from "../../../types/crateQCTypes";
import { onErrorNotification } from "../../../utils/helperFunctions";
import GetValueModal from "../../../Components/modals/GetValueModal";

const CrateLedger = () => {
  const [ledgerData, setLedgerData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelecteditems] = useState<Key[]>([]);
  const [printData, setPrintData] = useState<QCcrateLedgerItemType[]>([]);
  const [qrCount, setQrCount] = useState(0);
  const componentRef = useRef(null);
  const [isPrintCountModalVisible, setIsPrintCountModalVisible] = useState(false);

  const columns = [
    {
      title: "Crate Type",
      dataIndex: "is_temporary",
      key: "is_temporary",
      render: (text: any) => (text == 1 ? "Temporary" : "Permanent"),
      showSearch: true,
      type: "select",
      options: [
        { id: "1", name: "Temporary" },
        { id: "0", name: "Permanent" }
      ]
    },
    {
      title: "Crate ID",
      dataIndex: "reference_id",
      key: "reference_id",
      showSearch: true,
      type: "input"
    },
    {
      title: "Dimension (l w h)",
      dataIndex: "template",
      key: "template.dimension",
      render: (text: any) => text && text.dimensions
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: any) => moment(text).format("lll")
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      showSearch: true,
      type: "select",
      options: [
        { id: "picking", name: "picking" },
        { id: "billing", name: "billing" },
        { id: "unassigned", name: "unassigned" }
      ]
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
        <a onClick={() => navigate(`/home/crate-management/ledger/${record.id}`)}>View</a>
      )
    }
  ];

  const getLedgerData = async (params: any) => {
    setLoading(true);
    await getQcCrateLedger(params)
      .then((res) => {
        setLedgerData(res);
        // setTotalItems(res.meta.total);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelecteditems(selectedRowKeys);
    }
  };

  // const printLabels = async () => {
  // const data = ledgerData.data.filter(function (item: QCcrateLedgerItemType) {
  //   return selectedItems.includes(item.id);
  // });
  // await setPrintData(data);
  //   handlePrint();
  // };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const handleOpenPrintModal = () => {
    const data = ledgerData.data.filter(function (item: QCcrateLedgerItemType) {
      return selectedItems.includes(item.id);
    });
    setPrintData(data);
    setIsPrintCountModalVisible(true);
  };

  const handlePrintValueModal = async (count: number) => {
    await setQrCount(count);
    setIsPrintCountModalVisible(false);
    handlePrint();
  };

  const navigate = useNavigate();
  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      {selectedItems.length != 0 && (
        <Button style={{ textAlign: "right" }} onClick={handleOpenPrintModal} type="primary">
          Print Crate Label ({selectedItems.length})
        </Button>
      )}
      <Cardtable
        rowSelection={{
          type: "checkbox",
          ...rowSelection
        }}
        total={ledgerData.meta && ledgerData.meta.total}
        getData={getLedgerData}
        loading={loading}
        dataSource={ledgerData.data}
        columns={columns}
        showPagination
        rowKey={(row: any) => row.id}
      />
      <GetValueModal
        isModalVisible={isPrintCountModalVisible}
        title="Generate QR Code"
        handleCancel={() => setIsPrintCountModalVisible(false)}
        handleOk={handlePrintValueModal}
      />
      <div style={{ display: "none" }}>
        <PrintLabels printData={printData} ref={componentRef} count={qrCount} />
      </div>
    </Space>
  );
};

export default CrateLedger;
