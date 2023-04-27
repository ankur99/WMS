import { Tabs } from "antd";
import { useParams } from "react-router-dom";

import StoreDetails from "../../Components/Stores/StoreDetails/StoreDetails";
import OwnerDetails from "../../Components/Stores/OwnerDetails/OwnerDetails";
import BusinessDetails from "../../Components/Stores/BusinessDetails/BusinessDetails";
import BusinessDocuments from "../../Components/Stores/BusinessDocuments/BusinessDocuments";

import useChangeTabs from "../../hooks/useChangeTabs";

const { TabPane } = Tabs;

const UpdateStore = () => {
  const { storeId } = useParams();
  const { urlKey, handleTabClick } = useChangeTabs();

  return (
    <div>
      <Tabs activeKey={urlKey} type="card" onTabClick={handleTabClick}>
        <TabPane tab="Store Details" key="1">
          <StoreDetails storeId={storeId ? +storeId : -1} />
        </TabPane>
        <TabPane tab="Owner Details" key="2">
          <OwnerDetails storeId={storeId ? +storeId : -1} />
        </TabPane>
        <TabPane tab="Business Details" key="3">
          <BusinessDetails storeId={storeId ? +storeId : -1} />
        </TabPane>
        <TabPane tab="Business Documents" key="4">
          <BusinessDocuments storeId={storeId ? +storeId : -1} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default UpdateStore;
