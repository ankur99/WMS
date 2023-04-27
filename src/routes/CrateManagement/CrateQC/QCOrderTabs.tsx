import { Tabs } from "antd";
import Completed from "../../../Components/crateManagement/crateQC/Completed";
import Pending from "../../../Components/crateManagement/crateQC/Pending";
import CartScanner from "../../../Components/crateManagement/crateQC/CartScanner";
import SendToIat from "../../../Components/crateManagement/crateQC/SendToIat";

const { TabPane } = Tabs;

const QCOrderTabs = () => {
  return (
    <>
      <Tabs destroyInactiveTabPane defaultActiveKey="1" type="card">
        <TabPane tab="Cart Scanner" key="1">
          <CartScanner />
        </TabPane>
        <TabPane tab="Pending" key="2">
          <Pending />
        </TabPane>
        <TabPane tab="Completed" key="3">
          <Completed />
        </TabPane>
        <TabPane tab="Sent to IAT " key="4">
          <SendToIat />
        </TabPane>
      </Tabs>
    </>
  );
};

export default QCOrderTabs;
