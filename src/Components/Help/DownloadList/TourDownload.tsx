import { useState } from "react";
import { Table, Space, Button, TablePaginationConfig } from "antd";

import Joyride from "react-joyride";

import { formatDate } from "../../../utils/constants";
import { DownloadApiProps } from "../../../types/downloadTypes";
import staticDataDownload from "./staticDataDownload";
import useTourBulkDownload from "../../../hooks/useTourDownloadList";
import { sampleDownload } from "../../../utils/helperFunctions";

const { Column } = Table;

function TourDownload() {
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownload = () => {
    sampleDownload();
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
  };

  const {
    lastRef,
    run,
    steps,
    stepIndex,
    refRun,
    handleJoyrideCallback,
    handleStepIndexChange,
    handleRun
  } = useTourBulkDownload();

  return (
    <>
      <div ref={lastRef} />
      <Joyride
        continuous={true}
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        scrollToFirstStep={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            overlayColor: "#00000099",
            primaryColor: "#000000D9",
            zIndex: 10000000
          }
        }}
      />
      <Table
        rowKey="id"
        dataSource={staticDataDownload?.data}
        pagination={{
          current: currentPage,
          pageSize: 15,
          total: staticDataDownload && staticDataDownload?.total ? staticDataDownload?.total : 15,
          showSizeChanger: false
        }}
        onChange={handleTableChange}
        style={{ padding: "1rem" }}
        loading={false}
        className="bulk-download-table"
        rowClassName={(_, index) => (index === 0 ? "bulk-download-table-row1" : "")}>
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
                  <Button
                    className="bulk-download-button"
                    onClick={() => {
                      handleDownload();
                      if (refRun.current !== "stop") {
                        const element = lastRef.current;
                        if (element) {
                          element.className = "mock-last-step";
                        }
                      }
                      if (!run && refRun.current === 0) {
                        handleRun(true);
                        handleStepIndexChange(4);
                        refRun.current = 1;
                      }
                    }}
                    type="primary">
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
}

export default TourDownload;
