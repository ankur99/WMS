import { useEffect, useState, useRef, useMemo } from "react";
import { Button, Row, Space, Table, Tag } from "antd";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import {
  getAuditViewFilters,
  useApproveAudit,
  useAssignAudit,
  UseAuditViewData,
  useConfirmAudit,
  useStartAudit
} from "../../hooks/Audit/useRQAuditView";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import useTable from "../../hooks/useTable";
import { useParams } from "react-router-dom";
import { CSV_DOWNLOAD_LIMIT, formatDate, tagsColor } from "../../utils/constants";
import { downloadCSVReport } from "../../hooks/useRQCommon";
import styles from "./audits.module.css";
import {
  AuditItemsStatusType,
  AuditResultProps,
  AuditStatusType,
  AuditViewDataItems,
  AuditViewProps
} from "../../types/auditTypes";
import ArrayText from "../../Components/common/ArrayText";
import CancelAuditModal from "../../Components/modals/Audit/CancelAuditModal";
import BulkAssignModal from "../../Components/modals/BulkAssignModal";
import AuditViewActionColumn from "../../Components/Audit/AuditViewActionColumn";
import ObjectTexts from "../../Components/common/ObjectsText";

const { Column } = Table;

const AuditsView = () => {
  const { auditId } = useParams();

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
    handleReset,
    handleCSVLoading
  } = useTable();

  const [isAuditAssignOrReassignModalVisible, setIsAuditAssignOrReassignModalVisible] =
    useState(false);
  const [isAuditBulkAssignOrReassignModalVisible, setIsAuditBulkAssignOrReassignModalVisible] =
    useState(false);

  const [isAuditCancelModalVisible, setIsAuditCancelModalVisible] = useState(false);
  const [isAuditItemCancelModalVisible, setIsAuditItemCancelModalVisible] = useState(false);
  const [isAuditItemsCancelModalVisible, setIsAuditItemsCancelModalVisible] = useState(false);

  const auditItemIdRef = useRef<number | null>();

  const {
    isLoading,
    data: auditsViewData,
    refetch
  }: {
    isLoading: boolean;
    data: AuditViewProps | undefined;
    refetch: () => void;
  } = UseAuditViewData({
    currentPage,
    pageSize,
    auditId,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const auditStatus = useMemo(
    () => auditsViewData?.results?.data?.status?.name,
    [auditsViewData]
  ) as AuditStatusType | undefined;

  const isAuditAutoSettle = useMemo(
    () => (auditsViewData?.results?.data?.auto_settle === 1 ? true : false),
    [auditsViewData]
  ) as boolean | undefined;

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/download-csv?audit_id=${auditId}&limit=${CSV_DOWNLOAD_LIMIT}&csv_type=audit_view`;
    const filters = getAuditViewFilters(filtersValue);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `AuditView(${auditId})`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  //Audit Start
  const { isLoading: auditStartLoading, mutate: auditStartMutate } = useStartAudit({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  //Audit Approve
  const { isLoading: auditApproveLoading, mutate: auditApproveMutate } = useApproveAudit({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  // Audit Confirm
  const { isLoading: auditConfirmLoading, mutate: auditConfirmMutate } = useConfirmAudit({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const auditAssignSuccess = ({ type }: { type: "Assign" | "BulkAssign" }) => {
    if (type === "Assign") {
      showSuccessToast("Audit Assigned/Reassign Successfully");
      setIsAuditAssignOrReassignModalVisible(false);
    }

    if (type === "BulkAssign") {
      onSelectRowKeysChange([]);
      setIsAuditBulkAssignOrReassignModalVisible(false);
      showSuccessToast("Bulk Audit Assigned/Reassign Successfully");
    }
  };

  //Audit Assign
  const { isLoading: assignLoading, mutate: assignAuditItem } = useAssignAudit({
    onError: onErrorNotification,
    onSuccess: auditAssignSuccess,
    type: "Assign"
  });

  //Bulk Assign
  const { isLoading: bulkAssignLoading, mutate: bulkAssignAuditItem } = useAssignAudit({
    onError: onErrorNotification,
    onSuccess: auditAssignSuccess,
    type: "BulkAssign"
  });

  const handleAssignOrReAssign = (userId: number) => {
    const payload = {
      audit_item_ids: [auditItemIdRef.current] as number[],
      assigned_to: userId,
      audit_id: auditId ? +auditId : auditId
    };
    assignAuditItem(payload);
  };

  const handleBulkAssigOrReassign = (userId: number) => {
    // console.log({ userId });

    const payload = {
      audit_item_ids: selectedRowKeys as number[],
      assigned_to: userId,
      audit_id: auditId ? +auditId : auditId
    };

    bulkAssignAuditItem(payload);
  };

  const handleCancelAudit = (auditItemId: number) => {
    auditItemIdRef.current = auditItemId;
    setIsAuditItemCancelModalVisible(true);
  };

  const handleAssignReassignAuditItem = (auditItemId: number) => {
    auditItemIdRef.current = auditItemId;
    setIsAuditAssignOrReassignModalVisible(true);
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          {(auditStatus === "Generated" ||
            auditStatus === "Confirmed" ||
            auditStatus === "Started") && (
            <Button danger onClick={() => setIsAuditCancelModalVisible(true)}>
              Cancel Audit
            </Button>
          )}

          {auditStatus === "Generated" && (
            <Button
              type="primary"
              loading={auditConfirmLoading}
              onClick={() =>
                auditConfirmMutate({ audit_id: typeof auditId === "string" ? +auditId : auditId })
              }>
              Confirm Audit
            </Button>
          )}
          {auditStatus === "Confirmed" && (
            <Button
              type="primary"
              loading={auditStartLoading}
              onClick={() =>
                auditStartMutate({ audit_id: typeof auditId === "string" ? +auditId : auditId })
              }>
              Start Audit
            </Button>
          )}
          {auditsViewData?.results?.can_approve_audit && auditStatus === "Started" && (
            <Button
              type="primary"
              loading={auditApproveLoading}
              onClick={() =>
                auditApproveMutate({ audit_id: typeof auditId === "string" ? +auditId : auditId })
              }>
              Approve
            </Button>
          )}
        </Space>
      </div>
      <Space className={styles.auditViewButtons}>
        {selectedRowKeys.length > 0 && (
          <>
            <Button danger onClick={() => setIsAuditItemsCancelModalVisible(true)}>
              Bulk Cancel
            </Button>
            {auditsViewData?.results?.data?.status?.name !== "Generated" && (
              <Button onClick={() => setIsAuditBulkAssignOrReassignModalVisible(true)}>
                Bulk Assign
              </Button>
            )}
          </>
        )}
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
        <Button icon={<ExportOutlined />} onClick={downloadCSV} loading={csvDownloadLoading}>
          CSV Export
        </Button>
      </Space>
      <Table
        size="small"
        rowKey={"audit_item_id"}
        loading={isLoading}
        dataSource={auditsViewData?.results?.data?.audit_items}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRowKeysChange,
          getCheckboxProps: (record) => {
            return {
              disabled:
                record?.status?.name === "Cancelled" ||
                record?.status?.name === "Pending Approval" ||
                record?.status?.name === "Pending Action" ||
                record?.status?.name === "Resolved"
                  ? true
                  : false
            };
          }
        }}
        onChange={handleTableChange}
        scroll={{ x: 2600 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: auditsViewData ? auditsViewData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="Audit Item ID"
          dataIndex={"audit_item_id"}
          filteredValue={filtersValue?.audit_item_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "audit_item_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.audit_item_id && filtersValue.audit_item_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.audit_item_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="PID"
          dataIndex={"product"}
          key="product_id"
          filteredValue={filtersValue?.product_id || null}
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
                <HighlightText text={value?.id} highlight={filtersValue.product_id[0] as string} />
              );
            }
            return <>{value?.id}</>;
          }}
        />
        <Column
          title="Product"
          dataIndex={"product"}
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
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.product_name[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column
          title="Storage ID"
          dataIndex={"storage"}
          key="storage_id"
          filteredValue={filtersValue?.storage_id || null}
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
                <HighlightText text={value?.id} highlight={filtersValue.storage_id[0] as string} />
              );
            }
            return <>{value?.id}</>;
          }}
        />
        <Column
          title="Storage"
          dataIndex={"storage"}
          key="storage_name"
          filteredValue={filtersValue.storage_name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "storage_name",
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
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.storage_name[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column title="System Qty" dataIndex={"system_quantity"} key="system_quantity" />
        <Column title="Actual Qty" dataIndex={"actual_quantity"} key="actual_quantity" />
        <Column title="Damaged Qty" dataIndex={"damaged_quantity"} key="damaged_quantity" />
        <Column title="Expired Qty" dataIndex={"expired_quantity"} key="expired_quantity" />
        <Column title="Good Qty" dataIndex={"good_quantity"} key="good_quantity" />
        <Column
          dataIndex={"status"}
          title={"Status"}
          filters={[
            {
              text: "Generated",
              value: 0
            },
            {
              text: "Assigned",
              value: 1
            },
            {
              text: "Pending Approval",
              value: 2
            },
            {
              text: "Pending Action",
              value: 3
            },
            {
              text: "Resolved",
              value: 4
            },
            {
              text: "Cancelled",
              value: 5
            },
            {
              text: "In Progress",
              value: 6
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
          render={(value: { id: number; name: string }) => {
            if (value.id === 0) {
              return <Tag color={tagsColor.activeTagColor}>{value?.name}</Tag>;
            } else if (value.id === 1) {
              return <Tag color={tagsColor.activeTagColor}>{value?.name}</Tag>;
            } else if (value.id === 2) {
              return <Tag color={tagsColor.warningTagColor}>{value?.name}</Tag>;
            } else if (value.id === 3) {
              return <Tag color={tagsColor.warningTagColor}>{value?.name}</Tag>;
            } else if (value.id === 4) {
              return <Tag color={tagsColor.successTagColor}>{value?.name}</Tag>;
            } else if (value.id === 5) {
              return <Tag color={tagsColor.dangerTagColor}>{value?.name}</Tag>;
            } else if (value.id === 6) {
              return <Tag color={tagsColor.warningTagColor}>{value?.name}</Tag>;
            }
            return <Tag color={tagsColor.disabledTagColor}>{value?.name}</Tag>;
          }}
        />
        <Column
          title="Assigned To"
          dataIndex={"assigned_to"}
          key="assigned_to"
          filteredValue={filtersValue?.assigned_to || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "assigned_to",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.assigned_to && filtersValue.assigned_to[0]) {
              return (
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.assigned_to[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />

        <Column
          title="Assigned By"
          dataIndex={"assignee"}
          key="assignee"
          filteredValue={filtersValue?.assignee || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "assignee",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.assignee && filtersValue.assignee[0]) {
              return (
                <HighlightText text={value?.name} highlight={filtersValue.assignee[0] as string} />
              );
            }
            return <>{value?.name}</>;
          }}
        />

        <Column
          title="Start Time"
          dataIndex={"start_time"}
          render={(value: Date) => <>{formatDate(value)}</>}
        />

        <Column
          title="End Time"
          dataIndex={"end_time"}
          render={(value: Date) => <>{formatDate(value)}</>}
        />

        <Column title="Reported Variance" dataIndex={"reported_variance"} />
        <Column title="Final Variance" dataIndex={"final_variance"} />
        <Column
          title="System Action"
          dataIndex={"system_action"}
          render={(value: Record<string, string>) => <ObjectTexts value={value} />}
        />
        <Column
          title="Action Taken"
          dataIndex={"action_taken"}
          render={(value: AuditResultProps) => <ArrayText value={value} />}
        />
        <Column
          title="Action"
          width={200}
          align="center"
          fixed="right"
          render={(row: AuditViewDataItems) => {
            const auditItemStatus = row?.status?.name as AuditItemsStatusType;

            return (
              <AuditViewActionColumn
                auditItemId={row.id}
                auditStatus={auditStatus}
                isAuditAutoSettle={isAuditAutoSettle}
                auditItemStatus={auditItemStatus}
                handleCancelAudit={handleCancelAudit}
                handleAssignReassignAuditItem={handleAssignReassignAuditItem}
                finalVariance={row.final_variance}
              />
            );
          }}
        />
      </Table>
      {/* Audit Cancel */}
      {isAuditCancelModalVisible && auditId && (
        <CancelAuditModal
          id={+auditId}
          visible={isAuditCancelModalVisible}
          handleOk={() => setIsAuditCancelModalVisible(false)}
          handleCancel={() => setIsAuditCancelModalVisible(false)}
          cancelType={"Audit"}
        />
      )}
      {/* Single Audit Item Cancel */}
      {isAuditItemCancelModalVisible && auditId && (
        <CancelAuditModal
          id={auditItemIdRef.current as number}
          visible={isAuditItemCancelModalVisible}
          handleOk={() => setIsAuditItemCancelModalVisible(false)}
          handleCancel={() => setIsAuditItemCancelModalVisible(false)}
          cancelType={"SingleAuditItem"}
        />
      )}
      {/* Bulk Audit Items Cancel */}
      {isAuditItemsCancelModalVisible && auditId && (
        <CancelAuditModal
          id={+auditId}
          visible={isAuditItemsCancelModalVisible}
          handleOk={() => {
            setIsAuditItemsCancelModalVisible(false);
            onSelectRowKeysChange([]);
          }}
          handleCancel={() => setIsAuditItemsCancelModalVisible(false)}
          cancelType={{
            type: "BulkAuditItems",
            auditItemIds: selectedRowKeys as number[]
          }}
        />
      )}
      {/* Single Assign */}
      {isAuditAssignOrReassignModalVisible && (
        <BulkAssignModal
          visible={isAuditAssignOrReassignModalVisible}
          handleCancel={() => setIsAuditAssignOrReassignModalVisible(false)}
          handleOk={handleAssignOrReAssign}
          loading={assignLoading}
          title="Assign / Reassign"
          apiType="nodeInstance"
        />
      )}
      {/* Bulk Assign */}
      {isAuditBulkAssignOrReassignModalVisible && (
        <BulkAssignModal
          visible={isAuditBulkAssignOrReassignModalVisible}
          handleCancel={() => setIsAuditBulkAssignOrReassignModalVisible(false)}
          handleOk={handleBulkAssigOrReassign}
          loading={bulkAssignLoading}
          title="Bulk Assign / Bulk ReAssign"
          apiType="nodeInstance"
        />
      )}
    </>
  );
};

export default AuditsView;
