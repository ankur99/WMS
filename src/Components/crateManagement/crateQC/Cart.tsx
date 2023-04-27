import { Row, Col, Divider, Card, Typography, Empty, Button, message, Skeleton } from "antd";
import { CartCratesType, CartType } from "../../../types/crateQCTypes";
import CartItem from "./CartItem";
import { useNavigate, useParams } from "react-router-dom";
import { completeQcOrder, crateInvoiceDownload } from "../../../api/crateAPI";
import { onErrorNotification } from "../../../utils/helperFunctions";
import { useState } from "react";

type urlParams = {
  picklistId: string;
  orderId: string;
};

type PropType = {
  cartData: CartType | null;
  loadCart: () => void;
  cartLoading: boolean;
};

function Cart({ cartData, loadCart, cartLoading }: PropType) {
  const urlParams = useParams() as urlParams;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const completeOrder = async () => {
    const params = {
      picklist_id: urlParams.picklistId,
      order_id: urlParams.orderId
    };
    setLoading(true);
    await completeQcOrder(params)
      .then(() => {
        crateInvoiceDownload(+urlParams.orderId)
          .then(() => {
            console.log("i was successful in first atttempt");
            message.success("Order Completed Successfully");
            navigate(`/home/crate-management/qc`);
          })
          .catch(async () => {
            navigate(`/home/crate-management/qc`);
            console.log("looping start");
            message.success(
              "Order Completed Successfully, Please wait while we generate your invoice",
              10
            );

            for (let i = 0; i < 10; i++) {
              console.log("looping");
              crateInvoiceDownload(+urlParams.orderId)
                .then(() => {
                  i = 10;
                  console.log("looping success");
                })
                .catch((err) => {
                  console.log("err in downloading invoice trying again!", err);
                });
              await timer(3000);
            }
          });
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

  return cartData ? (
    loading || cartLoading ? (
      <Card>
        <Skeleton />
      </Card>
    ) : (
      <div style={{ background: "white" }}>
        <Card bordered={false}>
          <Row gutter={[0, 10]}>
            <Col span={12}>
              <Typography.Text strong={true}>No. of Crates Used</Typography.Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Typography.Text strong={true}>{cartData.crate_used}</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong={true}>Picked Items</Typography.Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Typography.Text strong>
                {" "}
                QTY: {cartData.picked_qty} | Items: {cartData.picked_items}
              </Typography.Text>
            </Col>

            <Col span={12}>
              <Typography.Text>Sub Total</Typography.Text> <br />
              <Typography.Text>Tax</Typography.Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Typography.Text> ₹{cartData.subtotal}</Typography.Text>
              <br />
              <Typography.Text> ₹{cartData.tax}</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong={true}>Total</Typography.Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Typography.Text>₹{cartData.total}</Typography.Text>
            </Col>
          </Row>
        </Card>

        <Divider plain style={{ margin: "10px 0" }} />
        {cartData.items.map((item: CartCratesType, key) => (
          <>
            <CartItem loadCart={loadCart} key={key} cartItem={item} />
            <Divider plain style={{ margin: 0 }} />
          </>
        ))}

        <Card bodyStyle={{ textAlign: "right" }} bordered={false}>
          <Button loading={loading} onClick={completeOrder} disabled={!cartData} type="primary">
            Proceed
          </Button>
        </Card>
      </div>
    )
  ) : (
    <>
      {loading || cartLoading ? (
        <Card>
          <Skeleton />
        </Card>
      ) : (
        <Row gutter={[10, 10]} style={{ background: "white", padding: 15 }}>
          <Col span={24}>
            <Empty />
          </Col>
        </Row>
      )}
    </>
  );
}

export default Cart;
