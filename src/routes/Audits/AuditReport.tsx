import { useEffect, useState, useRef } from "react";
import { Button, Space, Table } from "antd";
import { getAuditReportFilters, UseAuditReportData } from "../../hooks/Audit/useRQAuditReport";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import { onErrorNotification } from "../../utils/helperFunctions";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import {
  changeDDMMYYYYToYYYYMMDD,
  CSV_DOWNLOAD_LIMIT,
  FilterTypes,
  formatDate
} from "../../utils/constants";
import useTable from "../../hooks/useTable";
import { downloadCSVReport } from "../../hooks/useRQCommon";
import { AuditReportData, AuditReportReceivedData, AuditType } from "../../types/auditTypes";
import ExpiryModal from "../../Components/modals/Audit/ExpiryModal";
const { Column } = Table;

const AuditReport = () => {
  const [isExpiryModalVisible, setIsExpiryModalVisible] = useState(false);
  const expiryModalRef = useRef<{ productId: number; storageId: string }>();

  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleReset,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading
  } = useTable();

  const {
    isLoading: auditReportLoading,
    data: auditReportData,
    refetch
  }: {
    isLoading: boolean;
    data: AuditReportReceivedData | undefined;
    refetch: () => void;
  } = UseAuditReportData({
    currentPage,
    pageSize,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/admin/audits/download-csv?&limit=${CSV_DOWNLOAD_LIMIT}&csv_type=audit_report`;
    const formattedFiltersValues = { ...filtersValue };

    if (filtersValue.timestamp && filtersValue.timestamp[0]) {
      const newTimestamp = changeDDMMYYYYToYYYYMMDD(filtersValue.timestamp[0] as string);
      formattedFiltersValues.timestamp = [newTimestamp];
    }
    const filters = getAuditReportFilters(formattedFiltersValues);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `AuditReport`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  const handleExpiryModal = ({
    productId,
    storageId
  }: {
    productId: number;
    storageId: string;
  }) => {
    expiryModalRef.current = { productId, storageId };
    setIsExpiryModalVisible(true);
  };
  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button icon={<ExportOutlined />} onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Export
          </Button>
        </Space>
      </div>
      <Table
        rowKey={(record) => record.audit_id + "-" + record.product_id + "-" + record.storage_id}
        size="small"
        scroll={{ x: 2200 }}
        loading={auditReportLoading}
        dataSource={auditReportData?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: auditReportData ? auditReportData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="Audit ID"
          dataIndex={"audit_id"}
          filteredValue={filtersValue?.audit_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "audit_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
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
        <Column title="Audit Name" dataIndex={"audit_name"} />
        <Column title="Audit Item Id" dataIndex={"audit_item_id"} />
        <Column
          dataIndex={"audit_type"}
          title={"Audit Type"}
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
          filteredValue={filtersValue.audit_type || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
          render={(value: number) => {
            const text = getAuditNameFromId(value) as string;

            if (filtersValue.audit_type && typeof filtersValue.audit_type[0] === "number") {
              return <HighlightText text={text} highlight={text} />;
            }
            return text;
          }}
        />
        <Column
          title="Product ID"
          dataIndex={"product_id"}
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
                <HighlightText text={value} highlight={filtersValue.product_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column title="Product Name" dataIndex={"product_name"} />
        <Column
          title="Storage ID"
          dataIndex={"storage_id"}
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
                <HighlightText text={value} highlight={filtersValue.storage_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Storage Label"
          dataIndex={"storage_label"}
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
        <Column
          title="Employee ID"
          dataIndex={"employee_id"}
          filteredValue={filtersValue?.employee_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "employee_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.employee_id && filtersValue.employee_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.employee_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Employee Name"
          dataIndex={"employee_name"}
          filteredValue={filtersValue?.employee_name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "employee_name",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.employee_name && filtersValue.employee_name[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.employee_name[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="Created At"
          dataIndex="start_time"
          key="start_time"
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
        <Column title="System Qty" dataIndex={"system_quantity"} key="system_quantity" />
        <Column title="Actual Qty" dataIndex={"actual_quantity"} key="actual_quantity" />
        <Column title="Damaged Qty" dataIndex={"damaged_quantity"} key="damaged_quantity" />
        <Column title="Expired Qty" dataIndex={"expired_quantity"} key="expired_quantity" />
        <Column title="Good Qty" dataIndex={"good_quantity"} key="good_quantity" />
        <Column
          title="Action"
          width={160}
          align="center"
          fixed="right"
          render={(row: AuditReportData) => {
            const auditType = row?.audit_type;
            const productId = row?.product_id;
            const storageId = row?.storage_id;
            if (auditType === 1 || auditType === 3) {
              return (
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleExpiryModal({ productId, storageId })}>
                  View Detail
                </Button>
              );
            }
            return (
              <Button type="link" size="small" disabled>
                No Data Available
              </Button>
            );
          }}
        />
      </Table>
      {isExpiryModalVisible && (
        <ExpiryModal
          productId={expiryModalRef.current?.productId as number}
          storageId={expiryModalRef.current?.storageId as string}
          visible={isExpiryModalVisible}
          handleOk={() => setIsExpiryModalVisible(false)}
          handleCancel={() => setIsExpiryModalVisible(false)}
        />
      )}
    </>
  );
};

export default AuditReport;

const getAuditNameFromId = (value: number) => {
  if (value === 0) {
    return AuditType.Product;
  }
  if (value === 1) {
    return AuditType.Location;
  }
  if (value === 2) {
    return AuditType.Shelf_Life_Product;
  }
  if (value === 3) {
    return AuditType.Shelf_Life_Location;
  }
  return value;
};
