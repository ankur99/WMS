import { Tabs, Spin, Button, Space, Tag } from "antd";
import { useParams } from "react-router-dom";

import BasicInfo from "../../Components/Products/BasicInfo";
import Attributes from "../../Components/Products/Attributes";
import ProductImages from "../../Components/Products/ProductImages";
import ProductGroup from "../../Components/Products/ProductGroup";
import MiscInfo from "../../Components/Products/MiscInfo";
// import Variants from "../../Components/Products/VariantsTable";

import Inventory from "../../Components/Products/Inventory";

import useChangeTabs from "../../hooks/useChangeTabs";
import VariantTab from "../../Components/Products/VariantTab";
import {
  AttributesDataReceived,
  MiscInfoDataReceived,
  ProductComingFrom,
  ProductData
} from "../../types/ProductTypes";
import {
  useProductAttributesData,
  useProductData,
  useSyncPrice,
  useSyncProduct,
  useProductMiscData,
  useUpdateProductDetails
} from "../../hooks/useRQProducts";
import { onError, onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import {
  sanitizeAttributesProductData,
  sanitizeBasicInfoProductData,
  sanitizeMiscInfoProductData,
  sanitizeProductGroupProductData
} from "./productUtils";
import styles from "./product.module.css";
import { tagsColor } from "../../utils/constants";

const { TabPane } = Tabs;
const ProductTabs = () => {
  const { urlKey, handleTabClick } = useChangeTabs();
  const params = useParams();

  const { isLoading, data: productData }: { isLoading: boolean; data: undefined | ProductData } =
    useProductData({
      productId: params.productId,
      onError
    });

  const {
    isLoading: attributesLoading,
    data: attributesData
  }: { isLoading: boolean; data: AttributesDataReceived | undefined } = useProductAttributesData({
    productId: params.productId,
    onError
  });

  const {
    isLoading: miscLoading,
    data: miscInfoData
  }: { isLoading: boolean; data: undefined | MiscInfoDataReceived } = useProductMiscData({
    productId: params.productId,
    onError
  });

  const { isLoading: syncProductLoading, mutate: syncProduct } = useSyncProduct({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const { isLoading: syncPriceLoading, mutate: syncPrice } = useSyncPrice({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const onSuccess = () => {
    // for update
    showSuccessToast("Product status updated successfully");
  };

  const { isLoading: statusLoading, mutate: updateProductStatus } = useUpdateProductDetails({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const changeProductStatus = (id: number) => {
    if (params.productId) {
      updateProductStatus({
        productId: params.productId,
        payload: {
          status: id
        }
      });
    }
  };

  // In below codes, Spinner is set as ternary operator, as for form component to autofill, data need to passed directly,
  // initally data will be undefined and then data will have come contents, so to overcome this, we set spinner as
  // ternary operator
  return (
    <>
      <div className={styles.buttonWrapper}>
        <Space className={styles.buttons}>
          <div className="flex-center">
            <h2 style={{ marginBottom: 0, marginRight: "0.5rem" }}>Status:</h2>
            {productData?.status === 1 ? (
              <Tag color={tagsColor.activeTagColor}>Active</Tag>
            ) : (
              <Tag color={tagsColor.dangerTagColor}>Inactive</Tag>
            )}
          </div>
          <Button
            type="primary"
            loading={statusLoading}
            onClick={() => changeProductStatus(productData?.status === 1 ? 0 : 1)}
            danger={productData?.status === 1 ? true : false}>
            {productData?.status === 1 ? "Deactivate" : "Activate"}
          </Button>
          <Button
            type="primary"
            loading={syncProductLoading}
            onClick={() => syncProduct({ productId: params.productId })}>
            Sync Product
          </Button>
          <Button
            type="primary"
            loading={syncPriceLoading}
            onClick={() => syncPrice({ productId: params.productId })}>
            Sync Price
          </Button>
        </Space>
      </div>
      <Tabs activeKey={urlKey} type="card" onTabClick={handleTabClick} tabBarGutter={5}>
        <TabPane tab="Basic Info" key="1">
          {isLoading ? (
            <Spin spinning={isLoading} />
          ) : (
            <BasicInfo
              comingFrom={ProductComingFrom.UPDATE}
              productData={productData ? sanitizeBasicInfoProductData(productData) : undefined}
              productId={params.productId}
            />
          )}
        </TabPane>
        <TabPane tab="Attributes" key="2">
          {attributesLoading ? (
            <Spin spinning={attributesLoading} />
          ) : (
            <Attributes
              attributesData={
                attributesData ? sanitizeAttributesProductData(attributesData) : undefined
              }
              productId={params.productId as string}
            />
          )}
        </TabPane>
        <TabPane tab="Images" key="3">
          <ProductImages
            productId={params.productId as string}
            shouldRefetch={urlKey === "3" ? true : false}
          />
        </TabPane>
        <TabPane tab="ProductGroup" key="4">
          {isLoading ? (
            <Spin spinning={isLoading} />
          ) : (
            <ProductGroup
              productData={productData ? sanitizeProductGroupProductData(productData) : undefined}
              productId={params.productId as string}
            />
          )}
        </TabPane>
        <TabPane tab="MiscInfo" key="5">
          {isLoading || miscLoading ? (
            <Spin spinning={isLoading || miscLoading} />
          ) : (
            <MiscInfo
              productData={
                productData ? sanitizeMiscInfoProductData(productData, miscInfoData) : undefined
              }
              productId={params.productId as string}
            />
          )}
        </TabPane>
        <TabPane tab="Variants" key="6">
          <Spin spinning={isLoading}>
            <VariantTab
              variantData={productData?.variants}
              productId={params.productId as string}
            />
          </Spin>
        </TabPane>
        <TabPane tab="Inventory" key="7">
          <Inventory productData={productData} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ProductTabs;
