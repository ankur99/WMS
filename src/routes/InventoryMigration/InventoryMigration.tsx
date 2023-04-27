import { Table, Tag, Button, Space } from "antd";

// import BulkAssignModal from "../../Components/modals/BulkAssignModal";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";

import {
  FilterTypes,
  InventoryMigrationStatus,
  InventoryMigrationType,
  tagsColor
} from "../../utils/constants";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import useInventoryMigration from "../../hooks/useInventoryMigration";
import { Link } from "react-router-dom";
import { InventoryMigrationsData } from "../../types/inventoryMigrationTypes";

const { Column } = Table;

const InventoryMigration = () => {
  const {
    setSearchText,
    setSearchedColumn,
    currentPage,
    pageSize,
    searchInputRef,
    filtersValue,
    handleTableChange,
    isLoading,
    inventoryMigrationData,
    handleReset,
    csvDownloadLoading,
    downloadCSV
  } = useInventoryMigration();

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
        dataSource={inventoryMigrationData?.results}
        rowKey={"id"}
        size="small"
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: inventoryMigrationData ? inventoryMigrationData?.count : 15,
          showSizeChanger: true
        }}
        loading={isLoading}>
        <Column
          dataIndex={"id"}
          title={"ID"}
          filteredValue={filtersValue.id || null}
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
          render={(value) => {
            if (filtersValue.id && filtersValue.id[0]) {
              return <HighlightText text={value} highlight={filtersValue.id[0] as string} />;
            }
            return value;
          }}
        />
        <Column
          dataIndex={"migration_type"}
          title={"Migration Type"}
          filters={[
            {
              text: "Putaway",
              value: InventoryMigrationType.PUTAWAY
            },
            {
              text: "Migration",
              value: InventoryMigrationType.MIGRATION
            },
            {
              text: "Putaway Return",
              value: InventoryMigrationType.PUTAWAY_RETURN
            },
            {
              text: "Putaway STO",
              value: InventoryMigrationType.PUTAWAY_STO
            },
            {
              text: "Putaway RTO",
              value: InventoryMigrationType.PUTAWAY_RTO
            }
            // {
            //   text: "Null",
            //   value: InventoryMigrationType.NULL
            // }
          ]}
          filteredValue={filtersValue.migration_type || null}
          filterMultiple={false}
          onFilter={() => {
            // return record.status.indexOf(value) === 0;
            return true;
          }}
        />
        <Column
          dataIndex={"status"}
          title={"Status"}
          filters={[
            {
              text: "Open",
              value: InventoryMigrationStatus.OPEN
            },
            {
              text: "Closed",
              value: InventoryMigrationStatus.CLOSED
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            // return record.status.indexOf(value) === 0;
            return true;
          }}
          render={(value: string) => {
            if (value === InventoryMigrationStatus.CLOSED) {
              return <Tag color={tagsColor.dangerTagColor}>Closed</Tag>;
            } else if (value === InventoryMigrationStatus.OPEN) {
              return <Tag color={tagsColor.warningTagColor}>Open</Tag>;
            }
            return <Tag color={tagsColor.inactiveTagColor}>Invalid</Tag>;
          }}
        />
        <Column
          dataIndex={"employee"}
          title={"Created By"}
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
          title={"Action"}
          dataIndex={"action"}
          align="center"
          render={(_, row: InventoryMigrationsData) => {
            return (
              <Space size={"small"}>
                <Link to={`${row.id}`}>
                  <Button type="link" size="small">
                    View Items
                  </Button>
                </Link>
              </Space>
            );
          }}
        />
      </Table>
    </>
  );
};

export default InventoryMigration;
