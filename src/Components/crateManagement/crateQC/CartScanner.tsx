import { Row, Col, Divider, Skeleton, Empty, message, Card, Form } from "antd";
import { useEffect, useState } from "react";
import BarcodeSearch from "../CartScanner/BarcodeSearch";
import { BarcodeSearchProps, CartType, QCaddItemType } from "../../../types/crateQCTypes";
import { onErrorNotification } from "../../../utils/helperFunctions";
import { getCart, getProductsFromBarcode, QcAddItem } from "../../../api/crateAPI";
import BarcodeProducts from "../CartScanner/BarcodeSearchProducts";
import QCaddItem from "../../modals/QCaddItem";
import Cart from "./Cart";
import { useParams } from "react-router-dom";
type urlParams = {
  picklistId: string;
  orderId: string;
};

function CartScanner() {
  const [addItemVisible, setAddItemVisible] = useState(false);
  const [barcodeSearchProducts, setBarcodeSearchProducts] = useState<[]>([]);
  const [barcodeSearchLoading, setBarcodeSearchLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartData, setCartData] = useState<CartType | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    loadCart();
  }, []);

  const urlParams = useParams() as urlParams;

  const loadCart = async () => {
    const params = {
      picklist_id: urlParams.picklistId,
      order_id: urlParams.orderId
    };
    setCartLoading(true);
    await getCart(params)
      .then((res) => {
        setCartData(res);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setCartLoading(false);
  };

  const showAddItemModal = () => {
    setAddItemVisible(true);
  };

  const handleCancel = () => {
    setAddItemVisible(false);
  };

  const onSearchBarcode = async (values: BarcodeSearchProps) => {
    setBarcodeSearchLoading(true);
    await getProductsFromBarcode(values)
      .then((res) => {
        setBarcodeSearchProducts(res.data);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setBarcodeSearchLoading(false);
  };

  const addItem = async (values: QCaddItemType) => {
    setCartLoading(true);
    await QcAddItem(values)
      .then(() => {
        message.success("Item added successfully");
        loadCart();
        //clearing the form
        form.resetFields();
        setBarcodeSearchProducts([]);
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setCartLoading(false);
  };
  return (
    <>
      <Row gutter={[25, 10]}>
        <Col span={13}>
          <Card>
            <BarcodeSearch onSearchBarcode={onSearchBarcode} form={form} />
            <Divider style={{ borderBottom: "solid	#B8B8B8 1px", margin: "20px 0 30px 0" }} />

            {barcodeSearchLoading ? (
              <Skeleton />
            ) : (
              <>
                {barcodeSearchProducts.length == 0 ? (
                  <Empty />
                ) : (
                  barcodeSearchProducts.map((_item, key) => (
                    <BarcodeProducts
                      setSelectedVariant={setSelectedVariant}
                      showAddItemModal={showAddItemModal}
                      product={_item}
                      key={key}
                    />
                  ))
                )}
              </>
            )}
          </Card>
        </Col>

        <Col span={11}>
          <Cart cartLoading={cartLoading} loadCart={loadCart} cartData={cartData} />
        </Col>
      </Row>

      <QCaddItem
        selectedVariant={selectedVariant}
        onCancel={handleCancel}
        addItem={addItem}
        visible={addItemVisible}
      />
    </>
  );
}
export default CartScanner;
