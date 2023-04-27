import { Table, Button, Space, Tag } from "antd";
import { ReloadOutlined, CaretDownOutlined } from "@ant-design/icons";
import { FilterTypes } from "../../utils/constants";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import { useNavigate } from "react-router-dom";
import {
  InvoiceStatusType,
  NonInventoryInvoicingsType,
  NonInventoryInvoicingType
} from "../../types/nonInventoryInvoicingTypes";
import useTable from "../../hooks/useTable";
import {
  useDownloadNonInventoryInvoicePDF,
  useNonInventoryInvoicingsData
} from "../../hooks/useRQNonInventoryInvoicing";
import { downloadPdfFromLink, onError } from "../../utils/helperFunctions";

const { Column } = Table;

const NonInventoryInvoicing = () => {
  const navigate = useNavigate();

  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleTableChange,
    handleReset
  } = useTable();

  const {
    isLoading,
    data: nonInventoryInvoicingData
  }: {
    isLoading: boolean;
    isFetching: boolean;
    data: NonInventoryInvoicingsType | undefined;
  } = useNonInventoryInvoicingsData({
    currentPage,
    pageSize,
    filtersValue,
    onError
  });

  const onSuccessPDFDownload = (link: string) => {
    downloadPdfFromLink(link, "Non Inventory Invoice.pdf");
  };

  const { isLoading: isPDFDownloadLoading, mutate: downloadPDF } =
    useDownloadNonInventoryInvoicePDF({
      onError,
      onSuccess: onSuccessPDFDownload
    });

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          {/* <Button
            icon={<ExportOutlined />}
            // onClick={downloadCSV} loading={csvDownloadLoading}
          >
            CSV Export
          </Button> */}
          <Button type="primary" onClick={() => navigate("create-invoice")}>
            Create Invoice
          </Button>
        </Space>
      </div>
      <Table
        dataSource={nonInventoryInvoicingData?.results}
        rowKey={"id"}
        size="small"
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: nonInventoryInvoicingData ? nonInventoryInvoicingData?.count : 15,
          showSizeChanger: true
        }}
        loading={isLoading || isPDFDownloadLoading}>
        <Column
          dataIndex={"id"}
          title={"Order ID"}
          width={140}
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
            return value;
          }}
        />
        <Column
          dataIndex={"vendor_id"}
          title={"Vendor ID"}
          width={140}
          filteredValue={filtersValue.vendor_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "vendor_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.vendor_id && filtersValue.vendor_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.vendor_id[0] as string} />;
            }
            return value;
          }}
        />
        <Column dataIndex={"vendor_name"} title={"Vendor Name"} width={140} />
        <Column dataIndex={"subtotal"} title={"Subtotal"} width={140} />
        <Column
          dataIndex={"total"}
          title={"Total"}
          width={140}
          render={(value) => <>{parseFloat(value).toFixed(2)}</>}
        />
        <Column
          dataIndex={"status"}
          title={"Status"}
          width={200}
          filters={[
            { text: "Pending", value: InvoiceStatusType.pending },
            { text: "Approved", value: InvoiceStatusType.approved }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          filterIcon={<CaretDownOutlined style={{ minWidth: "1rem" }} />}
          onFilter={() => {
            return true;
          }}
          render={(value: string) => {
            if (value === InvoiceStatusType.pending) {
              return (
                <Tag color="red" style={{ textTransform: "capitalize" }}>
                  {value}
                </Tag>
              );
            }
            if (value === InvoiceStatusType.approved) {
              return (
                <Tag color="green" style={{ textTransform: "capitalize" }}>
                  {value}
                </Tag>
              );
            }
          }}
        />

        <Column
          title={"Action"}
          dataIndex={"action"}
          align="center"
          render={(_, row: NonInventoryInvoicingType) => {
            return (
              <Space size={"small"}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    navigate(`view/${row.id}`);
                  }}>
                  View
                </Button>
                {row?.status === InvoiceStatusType.approved && (
                  <Button type="link" size="small" onClick={() => downloadPDF(row?.id.toString())}>
                    Download
                  </Button>
                )}
              </Space>
            );
          }}
        />
      </Table>
    </>
  );
};

export default NonInventoryInvoicing;
