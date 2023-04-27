import { Card, Row, Col, Space, Avatar, Typography, Button, Popconfirm, message } from "antd";
import { CartCratesType, CartItemType } from "../../../types/crateQCTypes";
import { FileImageOutlined, DeleteFilled } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { removeQcItem } from "../../../api/crateAPI";
import { onErrorNotification } from "../../../utils/helperFunctions";

type PropType = { cartItem: CartCratesType; loadCart: () => void };

type urlParams = {
  picklistId: string;
  orderId: string;
};

export default function CartItem({ cartItem, loadCart }: PropType) {
  const urlParams = useParams() as urlParams;
  const [removing, setRemoving] = useState<boolean>(false);

  const removeItem = async (id: number, quantity: number) => {
    const params = {
      id: id,
      quantity: quantity,
      picklist_id: urlParams.picklistId,
      order_id: urlParams.orderId
    };
    setRemoving(true);
    await removeQcItem(params)
      .then((res) => {
        message.success("Item Removed Successfully");
        loadCart();
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setRemoving(false);
  };

  return (
    <>
      <Card bordered={false}>
        <Typography.Title level={5}>{cartItem.crate_code}</Typography.Title>
        {cartItem.items.map((item, key) => (
          <Row style={{ marginBottom: 15 }} key={key}>
            <Col span={20}>
              <Space size="middle">
                {item.image ? (
                  <Avatar
                    style={{ border: "solid 1px #d9d9d9" }}
                    shape="square"
                    size="large"
                    src={item.image}
                  />
                ) : (
                  <FileImageOutlined />
                )}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography.Text>{item.name}</Typography.Text>

                  <Typography.Text style={{ textTransform: "capitalize" }}>
                    {item.variant}
                  </Typography.Text>

                  <Space direction="horizontal">
                    <Typography.Text strong>PID:</Typography.Text>
                    <Typography.Text>{item.product_id}</Typography.Text>
                  </Space>

                  <Space direction="horizontal">
                    <Typography.Text strong>Barcode: </Typography.Text>
                    <Typography.Text>{item.barcode}</Typography.Text>
                  </Space>

                  <Space direction="horizontal">
                    <Typography.Text strong> QTY Picked:</Typography.Text>
                    {<Typography.Text>{item.quantity} </Typography.Text>}
                  </Space>
                </div>
              </Space>
            </Col>
            <Col
              span={4}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "space-around"
              }}>
              <Typography.Text strong type="secondary">
                ₹{item.price}
              </Typography.Text>
              <Popconfirm
                placement="top"
                title="Are you sure to remove item?"
                onConfirm={() => {
                  removeItem(item.id, item.quantity);
                }}
                okText="Yes"
                cancelText="No">
                <Button
                  loading={removing}
                  type="link"
                  icon={<DeleteFilled style={{ color: "red" }} />}
                />
              </Popconfirm>
            </Col>
          </Row>
        ))}
      </Card>
    </>
  );
}
