import { Space, Button, Spin, Row, Col, Divider, Table, Typography } from "antd";
import Column from "antd/lib/table/Column";
import { useNavigate, useParams } from "react-router-dom";
import Paper from "../../Components/common/Paper";
import {
  useDiscardNonInventoryInvoicing,
  useDownloadNonInventoryInvoicePDF,
  useNonInventoryInvoicingData,
  useUpdateNonInventoryStatus
} from "../../hooks/useRQNonInventoryInvoicing";
import {
  InvoiceStatusType,
  NonInventoryInvoicingDataType
} from "../../types/nonInventoryInvoicingTypes";
import { downloadPdfFromLink, onError, showSuccessToast } from "../../utils/helperFunctions";

const { Title } = Typography;

const ViewNonInventoryInvoice = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const {
    isLoading,
    data: invoiceData
  }: {
    isLoading: boolean;
    data: NonInventoryInvoicingDataType | undefined;
  } = useNonInventoryInvoicingData({
    invoiceId,
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

  const onSuccess = () => {
    showSuccessToast("Status Updated Successfully");
  };

  const { isLoading: statusUpdateLoading, mutate: updateNonInventoryInvoicingStatus } =
    useUpdateNonInventoryStatus({
      onError,
      onSuccess
    });
  const handleApprove = () => {
    updateNonInventoryInvoicingStatus(invoiceId);
  };

  const onSuccessDiscard = () => {
    navigate(-1);
    showSuccessToast("Non Inventory Invoice Discarded Successfully");
  };

  const { isLoading: discardLoading, mutate: discardNonInventoryInvoicing } =
    useDiscardNonInventoryInvoicing({
      onError,
      onSuccessDiscard
    });
  const handleDiscard = () => {
    discardNonInventoryInvoicing(invoiceId);
  };

  return (
    <>
      {invoiceData?.order_status === InvoiceStatusType.approved && (
        <div className="buttonWrapper">
          <Space className="buttons">
            <Button
              type="primary"
              onClick={() => downloadPDF(invoiceId)}
              loading={isPDFDownloadLoading}>
              Download Invoice
            </Button>
          </Space>
        </div>
      )}
      <Spin spinning={isLoading || statusUpdateLoading || discardLoading}>
        <Paper>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} className="m1-b">
              <Title level={5}>Order Id</Title>
              <div>#{invoiceId}</div>
            </Col>
            <Col xs={24} sm={12} md={8} className="m1-b">
              <Title level={5}>Vendor ID</Title>
              <div>{invoiceData?.vendor?.vendor_id}</div>
            </Col>
            <Col xs={24} sm={12} md={8} className="m1-b">
              <Title level={5}>Vendor Name</Title>
              <div>{invoiceData?.vendor?.vendor_name}</div>
            </Col>
            <Col xs={24} sm={12} md={8} className="m1-b">
              <Title level={5}>Vendor Shipping Address</Title>
              <div>{invoiceData?.vendor?.vendor_billing_address}</div>
            </Col>
            <Col xs={24} sm={12} md={8} className="m1-b">
              <Title level={5}>Vendor Billing Address</Title>
              <div>{invoiceData?.vendor?.vendor_shipping_address}</div>
            </Col>
          </Row>
        </Paper>

        <Divider orientation="left">Order Details</Divider>
        <Table
          className="m1-t"
          dataSource={invoiceData?.products}
          pagination={false}
          loading={false}
          rowKey={"id"}
          size="small">
          <Column dataIndex={"product_id"} title={"PID"} />
          <Column dataIndex={"product_name"} title={"Product Name"} />
          <Column dataIndex={"mrp"} title={"MRP"} />
          <Column dataIndex={"selling_price"} title={"Selling Price"} />
          <Column dataIndex={"quantity"} title={"Quantity"} />
          {invoiceData?.products.length &&
            Object.prototype.hasOwnProperty.call(invoiceData?.products[0], "igst") && (
              <Column
                dataIndex={"igst"}
                title={"IGST"}
                render={(value) => (
                  <div className="flex-between" style={{ minWidth: "100px" }}>
                    <div>{value?.percentage}%</div>
                    <div>&#x20b9;{value?.value}</div>
                  </div>
                )}
              />
            )}
          {invoiceData?.products.length &&
            Object.prototype.hasOwnProperty.call(invoiceData?.products[0], "cgst") && (
              <Column
                dataIndex={"cgst"}
                title={"CGST"}
                render={(value) => (
                  <div className="flex-between" style={{ minWidth: "100px" }}>
                    <div>{value?.percentage}%</div>
                    <div>&#x20b9;{value?.value}</div>
                  </div>
                )}
              />
            )}
          {invoiceData?.products.length &&
            Object.prototype.hasOwnProperty.call(invoiceData?.products[0], "sgst") && (
              <Column
                dataIndex={"sgst"}
                title={"SGST"}
                render={(value) => (
                  <div className="flex-between" style={{ minWidth: "100px" }}>
                    <div>{value?.percentage}%</div>
                    <div>&#x20b9;{value?.value}</div>
                  </div>
                )}
              />
            )}
          <Column dataIndex={"rate"} title={"Rate"} />
          <Column dataIndex={"subtotal"} title={"Sub Total"} />
          <Column dataIndex={"amount"} title={"Amount"} />
        </Table>

        {invoiceData?.order_status === InvoiceStatusType.pending && (
          <Space style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
            <Button type="default" htmlType="submit" onClick={handleDiscard}>
              Discard
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleApprove}>
              Approve
            </Button>
          </Space>
        )}
      </Spin>
    </>
  );
};

export default ViewNonInventoryInvoice;
