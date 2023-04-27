import { useEffect, useRef, useState } from "react";
import { Button, Space, Table, Tag } from "antd";

import { Link } from "react-router-dom";

import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import CreateNewAuditModal from "../../Components/modals/CreateNewAuditModal";
import CancelAuditModal from "../../Components/modals/Audit/CancelAuditModal";
import FormatText from "../../Components/common/FormatText";

import {
  useAuditsData,
  useAuditReasons,
  useAuditStatus,
  getAllAuditFilters
} from "../../hooks/Audit/useRQAudits";
import useTable from "../../hooks/useTable";

import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";

import { onErrorNotification } from "../../utils/helperFunctions";
import { CSV_DOWNLOAD_LIMIT, formatDate, tagsColor } from "../../utils/constants";

import {
  AuditReasonsAllData,
  AuditReasonsType,
  AuditsReceivedData,
  AuditStatusData,
  AuditTableProps,
  AuditType
} from "../../types/auditTypes";
import { getAuditReasons, getAuditStatus } from "../../Components/Audit/auditUtils";
import { downloadCSVReport } from "../../hooks/useRQCommon";

const { Column } = Table;

const Audits = () => {
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

  const [isNewAuditModalVisible, setIsNewAuditModalVisible] = useState(false);
  const [isAuditCancelModalVisible, setIsAuditCancelModalVisible] = useState(false);
  const auditIdRef = useRef<number>();

  const {
    isLoading,
    data: auditsData,
    refetch
  }: {
    isLoading: boolean;
    data: AuditsReceivedData | undefined;
    refetch: () => void;
  } = useAuditsData({
    currentPage,
    pageSize,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  // Audit Reasons
  const {
    isLoading: auditCreateReasonLoading,
    data: auditCreateReasonData
  }: {
    isLoading: boolean;
    data: AuditReasonsAllData | undefined;
  } = useAuditReasons({
    onError: onErrorNotification,
    reasonType: AuditReasonsType.create
  });

  // Audit Status
  const {
    isLoading: auditStatusLoading,
    data: auditStatusData
  }: {
    isLoading: boolean;
    data: AuditStatusData | undefined;
  } = useAuditStatus({
    onError: onErrorNotification
  });

  const handleNewAuditModal = () => {
    setIsNewAuditModalVisible(true);
  };

  const handleAuditCancel = (auditId: number) => {
    auditIdRef.current = auditId;
    setIsAuditCancelModalVisible(true);
  };

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/download-csv?&limit=${CSV_DOWNLOAD_LIMIT}&csv_type=audit_list`;
    const filters = getAllAuditFilters(filtersValue);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `Audit`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          <Button icon={<ExportOutlined />} onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Export
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button type="primary" onClick={handleNewAuditModal}>
            Create New Audit
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        size="small"
        loading={isLoading || auditCreateReasonLoading || auditStatusLoading}
        dataSource={auditsData?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: auditsData ? auditsData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="Audit ID"
          dataIndex="id"
          filteredValue={filtersValue?.id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.id && filtersValue.id[0]) {
              return <HighlightText text={value} highlight={filtersValue.id[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Audit Name"
          dataIndex="name"
          key="name"
          filteredValue={filtersValue?.name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "name",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.name && filtersValue.name[0]) {
              return <HighlightText text={value} highlight={filtersValue.name[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Created At"
          dataIndex="created_at"
          key="created_at"
          render={(value) => {
            return formatDate(value);
          }}
        />
        <Column
          title="Completed At"
          dataIndex="end_time"
          key="end_time"
          render={(value) => {
            return formatDate(value);
          }}
        />
        <Column
          dataIndex={"type"}
          title={"Type"}
          filters={[
            {
              text: AuditType.Product,
              value: AuditType.ProductId
            },
            {
              text: AuditType.Location,
              value: AuditType.LocationId
            },
            {
              text: AuditType.Shelf_Life_Product,
              value: AuditType.Shelf_Life_Product_Id
            },
            {
              text: AuditType.Shelf_Life_Location,
              value: AuditType.Shelf_Life_Location_Id
            }
          ]}
          filteredValue={filtersValue.type || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
        />
        <Column title="No. Of Items" dataIndex="no_of_items" key="no_of_items" />
        <Column
          title="Created By"
          dataIndex="created_by"
          key="created_by"
          filteredValue={filtersValue?.created_by || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "created_by",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.created_by && filtersValue.created_by[0]) {
              return (
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.created_by[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column
          dataIndex={"reason"}
          title={"Audit Reason"}
          filters={getAuditReasons(auditCreateReasonData)}
          filteredValue={filtersValue.reason || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
          render={(value: string) => {
            return <FormatText text={value} />;
          }}
        />
        <Column
          title="Auto Settle"
          dataIndex={"auto_settle"}
          render={(value: 1 | 0) => {
            return value === 1 ? "True" : "False";
          }}
        />
        <Column
          dataIndex={"status"}
          title={"Status"}
          filters={getAuditStatus(auditStatusData)}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
          render={(value: { id: number; name: string }) => {
            if (value.id === 0) {
              return <Tag color={tagsColor.activeTagColor}>Generated</Tag>;
            } else if (value.id === 1) {
              return <Tag color={tagsColor.successTagColor}>Confirmed</Tag>;
            } else if (value.id === 2) {
              return <Tag color={tagsColor.activeTagColor}>Started</Tag>;
            } else if (value.id === 3) {
              return <Tag color={tagsColor.successTagColor}>Approved</Tag>;
            } else if (value.id === 4) {
              return <Tag color={tagsColor.completedTagColor}>Completed</Tag>;
            } else if (value.id === 5) {
              return <Tag color={tagsColor.dangerTagColor}>Cancelled</Tag>;
            }
            return <Tag color={tagsColor.disabledTagColor}>{value?.name}</Tag>;
          }}
        />
        <Column
          title="Action"
          key="id"
          align="center"
          render={(row: AuditTableProps) => (
            <Space size={"small"}>
              <Link to={`${row.id}`}>
                <Button type="link" size="small" disabled={row?.no_of_items === 0 ? true : false}>
                  View
                </Button>
              </Link>
              {(row?.status?.name === "Generated" ||
                row?.status?.name === "Confirmed" ||
                row?.status?.name === "Started") && (
                <Button type="link" size="small" danger onClick={() => handleAuditCancel(row?.id)}>
                  Cancel
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
      {isNewAuditModalVisible && (
        <CreateNewAuditModal
          visible={isNewAuditModalVisible}
          handleOk={() => setIsNewAuditModalVisible(false)}
          handleCancel={() => setIsNewAuditModalVisible(false)}
        />
      )}
      {isAuditCancelModalVisible && (
        <CancelAuditModal
          id={auditIdRef?.current as number}
          visible={isAuditCancelModalVisible}
          handleOk={() => setIsAuditCancelModalVisible(false)}
          handleCancel={() => setIsAuditCancelModalVisible(false)}
          cancelType={"Audit"}
        />
      )}
    </>
  );
};

export default Audits;
