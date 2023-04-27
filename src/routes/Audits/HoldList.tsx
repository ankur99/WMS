// import { useEffect } from "react";
import { Button, Popconfirm, Space, Table } from "antd";

import { Link } from "react-router-dom";

import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";

import {
  useAuditHoldListData,
  getAllAuditHoldListFilters,
  useHoldListSettle
} from "../../hooks/Audit/useRQAuditHoldList";
import useTable from "../../hooks/useTable";

import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";

import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { downloadCSVReport } from "../../hooks/useRQCommon";
import { AuditHoldListData, AuditHoldListReceivedData } from "../../types/auditTypes";
import { FilterTypes, POPCONFIRM_TEXT } from "../../utils/constants";

const { Column } = Table;

const HoldList = () => {
  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleTableChange,
    handleReset,
    csvDownloadLoading,
    handleCSVLoading
  } = useTable();

  const {
    isLoading,
    data: holdListData
  }: // refetch
  {
    isLoading: boolean;
    data: AuditHoldListReceivedData | undefined;
    refetch: () => void;
  } = useAuditHoldListData({
    currentPage,
    pageSize,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  const { isLoading: settleLoading, mutate: settleHoldList } = useHoldListSettle({
    onError: onErrorNotification,
    onSuccess: showSuccessToast,
    comingFrom: "HoldList"
  });

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/download-csv/hold-list`;
    const filters = getAllAuditHoldListFilters(filtersValue);
    if (filters) {
      uri += `?filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `HoldList`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  const handleAuditSettle = (product_id: number) => {
    // console.log({ product_id });
    settleHoldList({ product_id });
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          {holdListData?.results && holdListData?.results?.length > 0 && (
            <Button icon={<ExportOutlined />} onClick={downloadCSV} loading={csvDownloadLoading}>
              CSV Export
            </Button>
          )}

          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </div>
      <Table
        rowKey="product_id"
        size="small"
        loading={isLoading || settleLoading}
        dataSource={holdListData?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: holdListData ? holdListData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="Product Id"
          dataIndex="product_id"
          filteredValue={filtersValue?.product_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "product_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
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
          dataIndex="product_name"
          key="product_name"
          filteredValue={filtersValue?.product_name || null}
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
        <Column title="Items on Hold" dataIndex="variance" />
        <Column
          title="Action"
          key="id"
          align="center"
          render={(row: AuditHoldListData) => (
            <Space size={"small"}>
              <Link to={`${row.product_id}?product_name=${row.product_name}`}>
                <Button type="link" size="small">
                  View
                </Button>
              </Link>
              <Popconfirm
                title={POPCONFIRM_TEXT}
                onConfirm={() => handleAuditSettle(row?.product_id)}>
                <Button type="link" size="small">
                  Settle
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default HoldList;
