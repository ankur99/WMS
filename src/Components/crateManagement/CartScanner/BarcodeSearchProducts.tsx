import { Space, Typography, Divider, Button, Col, Row, Card } from "antd";
import { ProductType, ProductVariantType } from "../../../types/crateQCTypes";

import style from "./barcodeSearchProducts.module.css";

const { Text } = Typography;

type propType = {
  product: ProductType;
  showAddItemModal: () => void;
  setSelectedVariant: (id: number) => void;
};

const BarcodeProducts = ({ product, showAddItemModal, setSelectedVariant }: propType) => {
  return (
    <>
      <div>
        <Space size={"large"}>
          {/* <Avatar
            shape="square"
            size="large"
            src="https://m.media-amazon.com/images/I/81L04BWRkHL._SL1500_.jpg"
          /> */}
          <img
            src={product.image}
            alt="product Image"
            className={style.productImage}
            width="120px"
            height="80px"
          />
          <Text>
            <Text strong type="secondary">
              PID: {product.product_id} | Stock: {product.stock} | Barcode: {product.barcode}
            </Text>
            <br />
            <Text strong>{product.name}</Text>
            <br />
            <Text type="secondary">{product.brand}</Text>
            <br />
          </Text>
        </Space>
      </div>
      <br />
      <Row gutter={[10, 20]}>
        {product.variants.map((item, key) => (
          <ProductCard
            setSelectedVariant={setSelectedVariant}
            showAddItemModal={showAddItemModal}
            key={key}
            item={item}
          />
        ))}
      </Row>

      <Divider />
    </>
  );
};

export default BarcodeProducts;

const ProductCard = ({
  item,
  showAddItemModal,
  setSelectedVariant
}: {
  item: ProductVariantType;
  showAddItemModal: () => void;
  setSelectedVariant: (id: number) => void;
}) => {
  return (
    <Col span={8}>
      <div className={style.card}>
        <div className={style.center}>
          ₹<Text>{parseFloat(item.price).toFixed(2)}</Text>
        </div>
        <div className={style.prodcutCardWrapper}>
          <div>
            <Text style={{ textTransform: "capitalize" }}>{item.value}</Text>
            {""}
            <Text style={{ fontSize: 10 }}>({item.quantity}pcs)</Text>
          </div>
          <VerticalDivider />
          <div>MOQ : {item.moq}</div>
        </div>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            setSelectedVariant(item.id);
            showAddItemModal();
          }}>
          Add Item
        </Button>
      </div>
    </Col>
  );
};

const VerticalDivider = () => {
  return <div style={{ padding: "0px 10px" }}>|</div>;
};
