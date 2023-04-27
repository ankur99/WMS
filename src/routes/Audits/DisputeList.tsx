import { useEffect, useState, useRef } from "react";
import { Button, Space, Table } from "antd";

import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import {
  getDisputeListFilters,
  useDisputeListCreateAudit,
  UseDisputeListData
} from "../../hooks/useRQDisputeList";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { CSV_DOWNLOAD_LIMIT } from "../../utils/constants";
import useTable from "../../hooks/useTable";
import { downloadCSVReport } from "../../hooks/useRQCommon";
import {
  DisputeListAuditCreateFormProps,
  DisputeListData,
  DisputeListReceivedData
} from "../../types/auditTypes";
import DisputeListCreateAuditModal from "../../Components/modals/DisputeListCreateAuditModal";
const { Column } = Table;

const DisputeList = () => {
  const [isCreateAuditModalVisible, setIsCreateAuditModalVisible] = useState(false);
  const [isBulkCreateAuditModalVisible, setIsBulkCreateAuditModalVisible] = useState(false);
  const dataRef = useRef<{
    storage_id: number;
    product_id: number;
  } | null>(null);

  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleTableChange,
    selectedRowKeys,
    onSelectRowKeysChange,
    csvDownloadLoading,
    handleCSVLoading,
    handleReset
  } = useTable();

  const {
    isLoading,
    data: disputeListData,
    refetch
  }: {
    isLoading: boolean;
    data: DisputeListReceivedData | undefined;
    refetch: () => void;
  } = UseDisputeListData({
    currentPage,
    filtersValue: filtersValue,
    onError: onErrorNotification,
    pageSize: pageSize
  });
  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/download-csv?&limit=${CSV_DOWNLOAD_LIMIT}&csv_type=dispute_list`;
    const filters = getDisputeListFilters(filtersValue);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `DisputeList`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    setIsCreateAuditModalVisible(false);
  };

  const { isLoading: createAuditLoading, mutate: disputeListCreateAudit } =
    useDisputeListCreateAudit({
      onError: onErrorNotification,
      onSuccess: onSuccess
    });

  const handleAssign = (data: DisputeListAuditCreateFormProps) => {
    const payload = {
      ...data,
      data: [
        {
          storage_id: dataRef.current?.storage_id as number,
          product_id: dataRef.current?.product_id as number
        }
      ]
    };
    // console.log("bulk Dismiss", payload);
    disputeListCreateAudit(payload);
  };

  const handleCreateAudit = () => {
    setIsCreateAuditModalVisible(true);
  };

  const handleBulkAuditAssign = (values: DisputeListAuditCreateFormProps) => {
    // console.log({ selectedRowKeys });
    const data = [];

    for (let i = 0; i < selectedRowKeys.length; i++) {
      const rowKey = (selectedRowKeys[i] as string).split("-");
      const product_id = +rowKey[0];
      const storage_id = +rowKey[1];

      data.push({
        storage_id,
        product_id
      });
    }

    const payload = {
      ...values,
      data
    };
    disputeListCreateAudit(payload);
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          {selectedRowKeys.length > 0 && (
            <Button onClick={() => setIsBulkCreateAuditModalVisible(true)}>
              Bulk Create Audit
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button icon={<ExportOutlined />} onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Export
          </Button>
        </Space>
      </div>

      <Table
        scroll={{ x: 1200 }}
        size="small"
        // rowKey={"id"}
        rowKey={(record) => record.product_id + "-" + record.storage_id}
        loading={isLoading}
        dataSource={disputeListData?.results}
        rowSelection={{ selectedRowKeys, onChange: onSelectRowKeysChange }}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: disputeListData ? disputeListData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="PID"
          dataIndex={"product_id"}
          {...getColumnSearchPropsForTable({
            dataIndex: "product_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.product_id && filtersValue.product_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.product_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Product Name"
          dataIndex={"product_name"}
          {...getColumnSearchPropsForTable({
            dataIndex: "product_name",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.product_name && filtersValue.product_name[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.product_name[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Storage ID"
          dataIndex={"storage_id"}
          {...getColumnSearchPropsForTable({
            dataIndex: "storage_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.storage_id && filtersValue.storage_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.storage_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Storage Name"
          dataIndex={"storage_label"}
          {...getColumnSearchPropsForTable({
            dataIndex: "storage_label",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.storage_name && filtersValue.storage_name[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.storage_name[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column title="Quantity" dataIndex={"quantity"} />
        <Column
          title="Action"
          align="center"
          fixed="right"
          width={150}
          render={(row: DisputeListData) => {
            return (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  const { product_id, storage_id } = row;
                  dataRef.current = { product_id, storage_id };
                  handleCreateAudit();
                }}
                disabled={row.in_audit === true ? true : false}>
                {row.in_audit === true ? "In Audit" : "Create Audit"}
              </Button>
            );
          }}
        />
      </Table>
      {isCreateAuditModalVisible && (
        <DisputeListCreateAuditModal
          visible={isCreateAuditModalVisible}
          handleOk={handleAssign}
          handleCancel={() => setIsCreateAuditModalVisible(false)}
          loading={createAuditLoading}
          title="Create Audit"
        />
      )}
      {isBulkCreateAuditModalVisible && (
        <DisputeListCreateAuditModal
          visible={isBulkCreateAuditModalVisible}
          handleOk={handleBulkAuditAssign}
          handleCancel={() => setIsBulkCreateAuditModalVisible(false)}
          loading={createAuditLoading}
          title="Create Bulk Audit"
        />
      )}
    </>
  );
};

export default DisputeList;
