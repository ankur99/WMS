import { Table, Typography } from "antd";
import Column from "antd/lib/table/Column";
import { ProductData } from "../../types/ProductTypes";

import Paper from "../common/Paper";
const { Title } = Typography;
const Inventory = ({ productData }: { productData: ProductData | undefined }) => {
  return (
    <Paper>
      <Title level={4}> Inventory</Title>
      <Table
        dataSource={
          productData && productData?.inventoryCount?.[0]?.stock
            ? [
                {
                  orders_count: productData?.blockedInventoryCount[0]?.orders_count,
                  stock: productData?.inventoryCount[0]?.stock
                }
              ]
            : undefined
        }
        rowKey="id">
        <Column title="Current Stock" dataIndex={"stock"} align="center" />
        <Column title="Inventory Assigned To Orders" dataIndex={"orders_count"} align="center" />
      </Table>
    </Paper>
  );
};

export default Inventory;
