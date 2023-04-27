import { useState } from "react";
import { Table } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";

import { useParams } from "react-router-dom";

import { useExecution } from "../../hooks/useRQBundling";
import { onError } from "../../utils/helperFunctions";
import { formatDate } from "../../utils/constants";

const { Column } = Table;

const BundlingExecution = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data: executionData } = useExecution({
    currentPage,
    onError,
    id
  });

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
  };

  return (
    <Table
      rowKey="id"
      className="m1-t"
      dataSource={executionData?.data}
      onChange={handleTableChange}
      pagination={{
        current: currentPage,
        pageSize: 15,
        total: executionData && executionData?.meta.total ? executionData?.meta.total : 15,
        showSizeChanger: false
      }}
      loading={isLoading}>
      <Column
        dataIndex={"id"}
        title={"ID"}
        render={(value) => {
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
        render={(value) => {
          return <>{value}</>;
        }}
      />
    </Table>
  );
};

export default BundlingExecution;
