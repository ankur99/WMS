import { Modal, Table } from "antd";
import useTable from "../../hooks/useTable";
import { useProductHoldListLogsData } from "../../hooks/Audit/useRQAuditHoldList";
import { onError } from "../../utils/helperFunctions";
import { ProductHoldListLogsReceivedData } from "../../types/auditTypes";
import { formatDate } from "../../utils/constants";

const { Column } = Table;

type ProductHoldLisLogsModalProps = {
  visible: boolean;
  handleCancel: () => void;
  handleOk: (userId: number) => void;
  title: string;
  product_id: number | undefined;
  storage_id: number | undefined;
};

const ProductHoldLisLogsModal = ({
  visible,
  handleCancel,
  title,
  product_id,
  storage_id
}: ProductHoldLisLogsModalProps) => {
  const { currentPage, pageSize, handleTableChange } = useTable();

  const {
    isLoading,
    data: productHoldListLogsData
  }: {
    isLoading: boolean;
    data: ProductHoldListLogsReceivedData | undefined;
  } = useProductHoldListLogsData({
    currentPage,
    pageSize,
    onError,
    product_id,
    storage_id
  });

  return (
    <Modal
      destroyOnClose={true}
      visible={visible}
      title={`${title}, ProductId: ${product_id}, Storage: ${storage_id}  `}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={null}>
      <Table
        rowKey="storage_id"
        size="small"
        loading={isLoading}
        dataSource={productHoldListLogsData?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: productHoldListLogsData ? productHoldListLogsData?.count : 15,
          showSizeChanger: true
        }}>
        <Column title="Audit Id" dataIndex="audit_id" />
        <Column title="Variance" dataIndex="variance" />
        <Column
          title="Created At"
          dataIndex="created_at"
          render={(value) => {
            return <>{formatDate(value)}</>;
          }}
        />
      </Table>
    </Modal>
  );
};

export default ProductHoldLisLogsModal;
