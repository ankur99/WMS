import { Spin, Tabs } from "antd";
import { useParams } from "react-router-dom";
import ProductRequestBasicInfo from "../../Components/ProductRequest/ProductRequestBasicInfo";
import PlanningInfo from "../../Components/ProductRequest/PlanningInfo";

import useChangeTabs from "../../hooks/useChangeTabs";
import { useProductRequestData } from "../../hooks/useRQProductRequest";
import { ProductRequestComingFrom, ProductRequestReceived } from "../../types/productRequestTypes";
import { onError } from "../../utils/helperFunctions";
import { sanitizeBasicInfoProductRequestData } from "./productRequestUtils";

const { TabPane } = Tabs;
const ProductRequestTabs = () => {
  const { urlKey, handleTabClick } = useChangeTabs();
  const params = useParams();

  const {
    isLoading,
    isFetching,
    data: productRequestData
  }: {
    isLoading: boolean;
    isFetching: boolean;
    data: ProductRequestReceived | undefined;
  } = useProductRequestData({
    productRequestId: params.id,
    onError
  });
  return (
    <div>
      <Tabs activeKey={urlKey} type="card" onTabClick={handleTabClick} tabBarGutter={5}>
        <TabPane tab="Basic Info" key="1">
          {isLoading || isFetching ? (
            <Spin spinning={isLoading || isFetching} />
          ) : (
            <ProductRequestBasicInfo
              comingFrom={ProductRequestComingFrom.UPDATE}
              productRequestData={productRequestData ? productRequestData : undefined}
              productRequestId={params.id}
              editPermission={
                productRequestData?.approve_permission ||
                productRequestData?.save_permission ||
                false
              }
            />
          )}
        </TabPane>

        {(productRequestData?.approve_permission || productRequestData?.save_permission) && (
          <TabPane tab="Admin" key="2">
            {isLoading || isFetching ? (
              <Spin spinning={isLoading || isFetching} />
            ) : (
              <PlanningInfo
                approve_permission={productRequestData?.approve_permission}
                save_permission={productRequestData?.save_permission}
                productRequestId={params.id as string}
                productRequestData={
                  productRequestData
                    ? sanitizeBasicInfoProductRequestData(productRequestData)
                    : undefined
                }
              />
            )}
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ProductRequestTabs;
