import { useState, useRef } from "react";
import { Button, Popconfirm, Space, Table } from "antd";

import { useParams, useLocation } from "react-router-dom";

import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";

import {
  useProductHoldListData,
  getAllAuditHoldListFilters,
  useHoldListSettle,
  useIndividualHoldListSettle
} from "../../hooks/Audit/useRQAuditHoldList";
import useTable from "../../hooks/useTable";

import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";

import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { FilterTypes, POPCONFIRM_TEXT } from "../../utils/constants";
import { downloadCSVReport } from "../../hooks/useRQCommon";
import {
  AuditReasonsType,
  ProductHoldListData,
  ProductHoldListReceivedData
} from "../../types/auditTypes";
import ProductHoldLisLogsModal from "../../Components/Audit/ProductHoldListLogsModal";
import SettleAuditModal from "../../Components/modals/Audit/SettleAuditModal";

const { Column } = Table;

const ProductHoldList = () => {
  const { product_id } = useParams();
  const { search } = useLocation();
  const product_name = new URLSearchParams(search).get("product_name");
  const dataRef = useRef<{ product_id: number; storage_id: number } | null>();
  const settleRef = useRef<{ audit_hold_item: number; reason: AuditReasonsType } | null>();

  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);

  const [isLogsModalVisible, setIsLogsModalVisible] = useState(false);
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
    data: productHoldListData
  }: // refetch
  {
    isLoading: boolean;
    data: ProductHoldListReceivedData | undefined;
    refetch: () => void;
  } = useProductHoldListData({
    currentPage,
    pageSize,
    product_id: product_id ? +product_id : undefined,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  const { isLoading: settleLoading, mutate: settleHoldList } = useHoldListSettle({
    onError: onErrorNotification,
    onSuccess: showSuccessToast,
    comingFrom: "ProductHoldList"
  });

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    setIsReasonModalVisible(false);
    return;
  };

  const { isLoading: individualSettleLoading, mutate: individualItemSettle } =
    useIndividualHoldListSettle({
      onError: onErrorNotification,
      onSuccess: onSuccess
    });

  const handleAuditSettle = (product_id: string | undefined) => {
    // console.log({ handleAuditSettle });
    if (product_id) {
      settleHoldList({ product_id: +product_id });
    }
  };

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/hold-list/${product_id}/download-csv`;
    const filters = getAllAuditHoldListFilters(filtersValue);
    if (filters) {
      uri += `?filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `Product HoldList(${product_id})`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  const handleViewLog = (rowData: ProductHoldListData) => {
    dataRef.current = {
      product_id: rowData.product_id,
      storage_id: rowData.storage_id
    };
    setIsLogsModalVisible(true);
  };

  const handleIndividualItemSettle = ({
    // product_id,
    // storage_id
    audit_hold_item,
    variance
  }: {
    // product_id: number;
    // storage_id: number;
    audit_hold_item: number;
    variance: number;
  }) => {
    // individualItemSettle({ audit_hold_item, reason_id: 1 });
    settleRef.current = {
      audit_hold_item,
      reason: variance > 0 ? AuditReasonsType.excess : AuditReasonsType.loss
    };

    setIsReasonModalVisible(true);
  };

  const handleAuditHoldSettle = ({
    reason_id,
    audit_item_id
  }: {
    reason_id?: number;
    audit_item_id: number | undefined;
  }) => {
    if (reason_id && audit_item_id) {
      individualItemSettle({ audit_hold_item: audit_item_id, reason_id });
    }
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          <Popconfirm title={POPCONFIRM_TEXT} onConfirm={() => handleAuditSettle(product_id)}>
            <Button type="primary" loading={settleLoading}>
              Settle All
            </Button>
          </Popconfirm>
          {productHoldListData?.results?.data && productHoldListData?.results?.data?.length > 0 && (
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
        rowKey="storage_id"
        size="small"
        loading={isLoading || individualSettleLoading}
        dataSource={productHoldListData?.results?.data}
        onChange={handleTableChange}
        title={() => (
          <h3 style={{ marginBottom: 0 }}>{`${
            product_name ? product_name : ""
          } (${product_id})`}</h3>
        )}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: productHoldListData ? productHoldListData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="Audit Id"
          dataIndex="audit_id"
          key="audit_id"
          filteredValue={filtersValue?.audit_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "audit_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.audit_id && filtersValue.audit_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.audit_id[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Storage Id"
          dataIndex="storage_id"
          key="storage_id"
          filteredValue={filtersValue?.storage_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "storage_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
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
          title="Storage Label"
          dataIndex="storage"
          key="storage_label"
          filteredValue={filtersValue?.storage_label || null}
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
            if (filtersValue.storage_label && filtersValue.storage_label[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.storage_label[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column title="Variance" dataIndex="variance" />
        <Column
          title="Action"
          key="id"
          align="center"
          render={(row: ProductHoldListData) => {
            const requiredPermission = productHoldListData?.results?.can_manage_hold_list;
            return (
              <Space size={"small"}>
                {requiredPermission && +row?.variance > 0 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      handleIndividualItemSettle({
                        // product_id: row.product_id,
                        // storage_id: row.storage_id
                        audit_hold_item: row.hold_item_id,
                        variance: +row.variance
                      })
                    }>
                    Mark Excess
                  </Button>
                )}

                {requiredPermission && +row?.variance < 0 && (
                  <Button
                    type="link"
                    size="small"
                    danger
                    onClick={() =>
                      handleIndividualItemSettle({
                        // product_id: row.product_id,
                        // storage_id: row.storage_id
                        audit_hold_item: row.hold_item_id,
                        variance: +row.variance
                      })
                    }>
                    Mark Loss
                  </Button>
                )}

                <Button type="link" size="small" onClick={() => handleViewLog(row)}>
                  View Log
                </Button>
              </Space>
            );
          }}
        />
      </Table>
      {isLogsModalVisible && (
        <ProductHoldLisLogsModal
          visible={isLogsModalVisible}
          handleCancel={() => setIsLogsModalVisible(false)}
          handleOk={() => setIsLogsModalVisible(false)}
          title="Logs"
          product_id={dataRef.current?.product_id}
          storage_id={dataRef.current?.storage_id}
        />
      )}
      {isReasonModalVisible && (
        <SettleAuditModal
          id={settleRef?.current?.audit_hold_item as number}
          visible={isReasonModalVisible}
          handleOk={handleAuditHoldSettle}
          handleCancel={() => setIsReasonModalVisible(false)}
          loading={individualSettleLoading}
          auditReasonType={settleRef?.current?.reason as AuditReasonsType | null}
        />
      )}
    </>
  );
};

export default ProductHoldList;
