import { Table, Space, Button } from "antd";
import { useDownloadAllData } from "../../hooks/useRQDownload";
import { onError, showErrorNotification } from "../../utils/helperFunctions";
import { formatDate } from "../../utils/constants";
import { DownloadApiProps } from "../../types/downloadTypes";
import useTable from "../../hooks/useTable";

const { Column } = Table;

const Download = () => {
  const { pageSize, handleTableChange, currentPage } = useTable();

  const { isLoading, data: downloadData } = useDownloadAllData({
    currentPage,
    pageSize,
    onError
  });

  const handleDownload = (url: string) => {
    try {
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("Download Error", error);
      showErrorNotification;
    }
  };

  return (
    <>
      <Table
        rowKey="id"
        dataSource={downloadData?.results}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: downloadData && downloadData?.count ? downloadData?.count : 15,
          showSizeChanger: true
        }}
        onChange={handleTableChange}
        style={{ padding: "1rem" }}
        loading={isLoading}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="User ID" dataIndex="user_id" key="user_id" />
        <Column title="Report Type" dataIndex="report_type" key="report_type" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Created At"
          dataIndex="created_at"
          key="created_at"
          render={(value) => {
            return formatDate(value);
          }}
        />

        <Column
          title="Action"
          key="action"
          render={(_, row: DownloadApiProps) => {
            if (row.status === "completed") {
              return (
                <Space size="middle">
                  <Button onClick={() => handleDownload(row?.url)} type="primary">
                    Download
                  </Button>
                </Space>
              );
            }
            return (
              <Button type="primary" disabled>
                Download
              </Button>
            );
          }}
        />
      </Table>
    </>
  );
};

export default Download;
