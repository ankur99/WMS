import { Button, Popconfirm, Space, Table } from "antd";
import Column from "antd/lib/table/Column";
import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import { ProductVariant } from "../../types/ProductTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import { useDeleteVariant, useRestoreVariant } from "../../hooks/useRQProducts";
import { Link } from "react-router-dom";
interface VariantTabProps {
  variantData: undefined | ProductVariant[];
  productId: string;
}

const Variants = ({ variantData, productId }: VariantTabProps) => {
  const { isLoading: isDeleteLoading, mutate: deleteMutate } = useDeleteVariant({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const { isLoading: isRestoreLoading, mutate: restoreMutate } = useRestoreVariant({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const handleDeleteVariant = (id: number) => {
    deleteMutate({ productId, variantId: id });
  };

  const handleRestoreVariant = (id: number) => {
    restoreMutate({ variantId: id });
  };

  return (
    <>
      <Table
        dataSource={variantData}
        rowKey="id"
        loading={isDeleteLoading || isRestoreLoading}
        scroll={{ x: 1600 }}>
        <Column title="Id" dataIndex={"id"} align="center" />
        <Column title="Type" dataIndex={"value"} align="center" />
        <Column title="MOQ" dataIndex={"moq"} align="center" />
        <Column title="SKU" dataIndex={"sku"} align="center" />
        <Column title="Quantity" dataIndex={"quantity"} align="center" />
        <Column
          title="mrp"
          dataIndex={"mrp"}
          align="center"
          render={(value) => {
            return filterNumber(value);
          }}
        />
        <Column
          title="Price"
          dataIndex={"price"}
          align="center"
          render={(value) => {
            return filterNumber(value);
          }}
        />
        <Column
          title="Min & Max"
          dataIndex={"minMax"}
          align="center"
          render={(_, row: ProductVariant) => {
            return `${filterNumber(row?.min_price)} & ${filterNumber(row?.max_price)}`;
          }}
        />
        <Column title="Length" dataIndex={"length"} align="center" />
        <Column title="Width" dataIndex={"width"} align="center" />
        <Column title="Height" dataIndex={"height"} align="center" />
        <Column title="Weight" dataIndex={"weight"} align="center" />
        <Column
          title=" Action"
          align="center"
          fixed="right"
          render={(_, row: ProductVariant) => (
            <Space size="middle">
              <Link to={`variants/update/${row.id}`}>
                <Button size="small" type="link">
                  <EditOutlined style={{ minWidth: "1rem" }} />
                </Button>
              </Link>
              {row.deleted_at ? (
                <Popconfirm
                  title="Are you sure you want to restore this variant? This action cannot be reversed."
                  onConfirm={() => {
                    handleRestoreVariant(row.id);
                  }}>
                  <Button type="link" style={{ background: "#379237", color: "white" }}>
                    <UndoOutlined style={{ minWidth: "1rem" }} />
                  </Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Are you sure you want to delete this variant? This action cannot be reversed."
                  onConfirm={() => {
                    handleDeleteVariant(row.id);
                  }}>
                  <Button type="link" danger>
                    <DeleteOutlined style={{ minWidth: "1rem" }} />
                  </Button>
                </Popconfirm>
              )}
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default Variants;

const filterNumber = (value: string) => {
  try {
    return Number(value);
  } catch (error) {
    console.log("filter number error", error);
  }
  return value;
};
