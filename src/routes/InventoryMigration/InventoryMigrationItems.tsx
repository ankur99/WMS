import { Button, Space, Table, Tag } from "antd";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import { useParams } from "react-router-dom";
import {
  FilterTypes,
  formatDate,
  InventoryMigrationItemsStatus,
  tagsColor
} from "../../utils/constants";
import { InventoryMigrationItemsData } from "../../types/inventoryMigrationTypes";
import useInventoryMigrationItems from "../../hooks/useInventoryMigrationItems";
import BulkAssignModal from "../../Components/modals/BulkAssignModal";

const { Column } = Table;

const InventoryMigrationItems = () => {
  const { inventoryMigrationId } = useParams();

  const {
    setSearchText,
    setSearchedColumn,
    currentPage,
    pageSize,
    searchInputRef,
    filtersValue,
    singleAssignModalVisible,
    handleSingleAssignModal,
    bulkAssignModalVisible,
    handleBulkAssignModal,
    reAssignDataRef,
    selectedRowKeys,
    onSelectRowKeysChange,
    handleTableChange,
    isLoading,
    inventoryMigrationItemsData,
    handleReAssign,
    handleBulkReAssign,
    handleReset,
    csvDownloadLoading,
    downloadCSV,
    singleAssignLoading,
    bulkAssignLoading
  } = useInventoryMigrationItems(inventoryMigrationId);

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          {selectedRowKeys.length > 0 && (
            <Button onClick={() => handleBulkAssignModal(true)}>Bulk ReAssign</Button>
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
        size="small"
        rowKey={"id"}
        loading={isLoading || singleAssignLoading || bulkAssignLoading}
        dataSource={inventoryMigrationItemsData?.results}
        onChange={handleTableChange}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRowKeysChange,
          getCheckboxProps: (record) => {
            return {
              disabled: record.status !== InventoryMigrationItemsStatus.PENDING ? true : false
            };
          }
        }}
        scroll={{ x: 1800 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: inventoryMigrationItemsData ? inventoryMigrationItemsData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          title="ID"
          dataIndex={"id"}
          filteredValue={filtersValue?.id || null}
          width={200}
          {...getColumnSearchPropsForTable({
            dataIndex: "Id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
        />
        <Column
          title="PID"
          dataIndex={"product"}
          key="product_id"
          filteredValue={filtersValue?.product_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "Product Id",
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
            dataIndex: "Product Name",
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
        <Column title="SKU" dataIndex={"sku"} />
        <Column
          title="From Storage"
          dataIndex={"from_storage"}
          key="from_storage_name"
          filteredValue={filtersValue?.from_storage_name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "From Storage",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.from_storage_name && filtersValue.from_storage_name[0]) {
              return (
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.from_storage_name[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column
          title="To Storage"
          dataIndex={"to_storage"}
          key="to_storage_name"
          filteredValue={filtersValue?.to_storage_name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "To Storage",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.to_storage_name && filtersValue.to_storage_name[0]) {
              return (
                <HighlightText
                  text={value?.name}
                  highlight={filtersValue.to_storage_name[0] as string}
                />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column title="Quantity" dataIndex={"quantity"} />
        <Column title="Picked Qty" dataIndex={"picked_quantity"} />
        <Column
          title="Completed At"
          dataIndex={"completed_at"}
          render={(value) => {
            return formatDate(value);
          }}
        />
        <Column
          dataIndex={"employee"}
          title={"Assigned To"}
          filteredValue={filtersValue.employee || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "Assigned At",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.employee && filtersValue.employee[0]) {
              return (
                <HighlightText text={value?.name} highlight={filtersValue.employee[0] as string} />
              );
            }
            return <>{value?.name}</>;
          }}
        />
        <Column
          dataIndex={"status"}
          title={"Status"}
          filters={[
            {
              text: "Pending",
              value: InventoryMigrationItemsStatus.PENDING
            },
            {
              text: "Processing",
              value: InventoryMigrationItemsStatus.PROCESSING
            },
            // {
            //   text: "Partially Completed",
            //   value: InventoryMigrationItemsStatus.PARTIAL
            // },
            {
              text: "Completed",
              value: InventoryMigrationItemsStatus.COMPLETED
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            // return record.status.indexOf(value) === 0;
            return true;
          }}
          render={(value: string) => {
            if (value === InventoryMigrationItemsStatus.PENDING) {
              return <Tag color={tagsColor.activeTagColor}>Pending</Tag>;
            } else if (value === InventoryMigrationItemsStatus.PROCESSING) {
              return <Tag color={tagsColor.warningTagColor}>Processing</Tag>;
            } else if (value === InventoryMigrationItemsStatus.PARTIAL) {
              return <Tag color={tagsColor.warningTagColor}>Partial</Tag>;
            } else if (value === InventoryMigrationItemsStatus.COMPLETED) {
              return <Tag color={tagsColor.successTagColor}>Completed</Tag>;
            }
            return <Tag color={tagsColor.inactiveTagColor}>Invalid</Tag>;
          }}
        />
        <Column
          title={"Action"}
          dataIndex={"action"}
          align="center"
          fixed="right"
          render={(_, row: InventoryMigrationItemsData) => {
            return (
              <Space size={"small"}>
                {row.status === InventoryMigrationItemsStatus.PENDING ? (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      handleSingleAssignModal(true);
                      reAssignDataRef.current = row.id;
                    }}>
                    ReAssign
                  </Button>
                ) : (
                  "--"
                )}
              </Space>
            );
          }}
        />
      </Table>
      {singleAssignModalVisible && (
        <BulkAssignModal
          visible={singleAssignModalVisible}
          handleCancel={() => handleSingleAssignModal(false)}
          handleOk={handleReAssign}
          loading={false}
          title="Re Assign"
        />
      )}
      {bulkAssignModalVisible && (
        <BulkAssignModal
          visible={bulkAssignModalVisible}
          handleCancel={() => handleBulkAssignModal(false)}
          handleOk={handleBulkReAssign}
          loading={false}
          title="Bulk Re Assign"
        />
      )}
    </>
  );
};

export default InventoryMigrationItems;
