import { useRef, useState } from "react";
import { Table } from "antd";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";

import { useProcessOrders } from "../../hooks/useRQBundling";
import { onErrorNotification } from "../../utils/helperFunctions";
import { FilterTypes, formatDate } from "../../utils/constants";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";

const { Column } = Table;

const BundlingProcessOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef<HTMLInputElement>();
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    id: null,
    bundle_recipe_name: null,
    executed_by: null
  });

  const { isLoading, data: processOrdersData } = useProcessOrders({
    currentPage,
    id: filtersValue.id && (filtersValue.id[0] as string | null),
    bundle_recipe_name:
      filtersValue.bundle_recipe_name && (filtersValue.bundle_recipe_name[0] as string | null),
    executed_by: filtersValue.executed_by && (filtersValue.executed_by[0] as string | null),
    onError: onErrorNotification
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);
  };

  return (
    <Table
      rowKey="id"
      className="m1-t"
      dataSource={processOrdersData?.data}
      onChange={handleTableChange}
      pagination={{
        current: currentPage,
        pageSize: 15,
        total:
          processOrdersData && processOrdersData?.meta.total ? processOrdersData?.meta.total : 15,
        showSizeChanger: false
      }}
      loading={isLoading}>
      <Column
        dataIndex={"id"}
        title={"ID"}
        align="center"
        filteredValue={filtersValue.id || null}
        {...getColumnSearchPropsForTable({
          dataIndex: "id",
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
          return <>{value}</>;
        }}
      />
      <Column
        dataIndex={"bundle_recipe_id"}
        title={"Bundle Recipe Id"}
        render={(value) => {
          return <>{value}</>;
        }}
      />
      <Column
        dataIndex={"bundle_recipe_name"}
        title={"Recipe Name"}
        align="center"
        filteredValue={filtersValue.bundle_recipe_name || null}
        {...getColumnSearchPropsForTable({
          dataIndex: "bundle_recipe_name",
          searchInputRef,
          setSearchText,
          setSearchedColumn
        })}
        onFilter={() => {
          return true;
        }}
        render={(value) => {
          if (filtersValue.bundle_recipe_name && filtersValue.bundle_recipe_name[0]) {
            return (
              <HighlightText
                text={value}
                highlight={filtersValue.bundle_recipe_name[0] as string}
              />
            );
          }
          return <>{value}</>;
        }}
      />
      <Column
        dataIndex={"no_of_bundles"}
        title={"No. of Bundles"}
        render={(value) => {
          return <>{value}</>;
        }}
      />
      <Column
        dataIndex={"executed_at"}
        title={"Executed At"}
        render={(value) => {
          return <>{value ? formatDate(value) : "--"}</>;
        }}
      />
      <Column
        dataIndex={"executed_by"}
        title={"Executed By"}
        align="center"
        filteredValue={filtersValue.executed_by || null}
        {...getColumnSearchPropsForTable({
          dataIndex: "executed_by",
          searchInputRef,
          setSearchText,
          setSearchedColumn
        })}
        onFilter={() => {
          return true;
        }}
        render={(value) => {
          if (filtersValue.executed_by && filtersValue.executed_by[0]) {
            return <HighlightText text={value} highlight={filtersValue.executed_by[0] as string} />;
          }
          return <>{value}</>;
        }}
      />
    </Table>
  );
};

export default BundlingProcessOrders;
