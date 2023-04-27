import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";

import Layout from "./Components/Layout";

const Login = lazy(() => import("./routes/Login"));

const Dashboard = lazy(() => import("./routes/Dashboard"));
const NotFound = lazy(() => import("./routes/NotFound"));
const HomePage = lazy(() => import("./routes/HomePage"));

const Putaway = lazy(() => import("./routes/Putaway/Putaway"));
const FreshPutawayAssignment = lazy(() => import("./routes/Putaway/FreshPutawayAssignmen"));
const ReturnPutawayAssignment = lazy(() => import("./routes/Putaway/ReturnPutawayAssignment"));
const PutawayReport = lazy(() => import("./routes/Putaway/PutawayReport"));

const IATAssignedPicklist = lazy(() => import("./routes/IAT/IATAssignedPicklist"));

const CreateRoute = lazy(() => import("./routes/ShipmentRoutes/createRoute"));

const UpdateRoute = lazy(() => import("./routes/ShipmentRoutes/updateRoute"));
const UpdateRouteForm = lazy(() => import("./routes/ShipmentRoutes/updateRouteForm"));

const CreateTemplate = lazy(() => import("./routes/CrateManagement/CreateCrate/CreateTemplate"));
const CreateCrate = lazy(() => import("./routes/CrateManagement/CreateCrate"));
const GenerateCrateIDs = lazy(() => import("./routes/CrateManagement/CreateCrate/GenerateCrateID"));
const QCOrderTabs = lazy(() => import("./routes/CrateManagement/CrateQC/QCOrderTabs"));
const CrateTemplate = lazy(() => import("./routes/CrateManagement/CrateTemplate"));
const CreateStatus = lazy(() => import("./routes/CrateManagement/CrateStatus"));
const TaskDetails = lazy(() => import("./routes/CrateManagement/CrateStatus/TaskDetails"));
const CrateUnassignment = lazy(() => import("./routes/CrateManagement/CrateUnassignment"));
const CrateQC = lazy(() => import("./routes/CrateManagement/CrateQC"));
const QCOrdersOfAPicklist = lazy(
  () => import("./routes/CrateManagement/CrateQC/QCOrdersOfAPicklist")
);
const CrateLedger = lazy(() => import("./routes/CrateManagement/CrateLedger"));
const CrateLedgerView = lazy(() => import("./routes/CrateManagement/CrateLedger/View"));
const CrateLedgerTypeView = lazy(() => import("./routes/CrateManagement/CrateLedger/TypeView"));

const UpdateStore = lazy(() => import("./routes/Stores/UpdateStore"));
const StoreHome = lazy(() => import("./routes/Stores/StoreHome"));
const AllStore = lazy(() => import("./routes/Stores/AllStore"));
const ProofOfDelivery = lazy(() => import("./routes/Stores/ProofOfDelivery"));

const Download = lazy(() => import("./routes/Downloads/Download"));

const Products = lazy(() => import("./routes/Products/Products"));
const ProductTabs = lazy(() => import("./routes/Products/ProductTabs"));
const CreateProduct = lazy(() => import("./routes/Products/CreateProduct"));
const AddVariant = lazy(() => import("./Components/Products/AddVariant"));

const ProductRequest = lazy(() => import("./routes/Products/ProductRequest"));
const ProductRequestTabs = lazy(() => import("./routes/Products/ProductRequestTabs"));
const CreateProductRequest = lazy(() => import("./routes/Products/CreateProductRequest"));
const HSNCodeFinder = lazy(() => import("./Components/common/HSNCodeFinder"));

const Bundling = lazy(() => import("./routes/Bundling/Bundling"));
const BundlingExecution = lazy(() => import("./routes/Bundling/BundlingExecution"));
const BundlingProcessOrders = lazy(() => import("./routes/Bundling/BundlingProcessOrders"));

const Complaints = lazy(() => import("./routes/Complaints/Complaints"));
//Help
const HelpPutawayAssignment = lazy(() => import("./routes/Help/HelpPutawayAssignment"));
const HelpDownload = lazy(() => import("./routes/Help/HelpDownload"));

//Audits
const Audits = lazy(() => import("./routes/Audits/Audits"));
const AuditsView = lazy(() => import("./routes/Audits/AuditsView"));
const AuditReport = lazy(() => import("./routes/Audits/AuditReport"));
const DisputeList = lazy(() => import("./routes/Audits/DisputeList"));
const HoldList = lazy(() => import("./routes/Audits/HoldList"));
const ProductHoldList = lazy(() => import("./routes/Audits/ProductHoldList"));

//InventoryMigration
const InventoryItems = lazy(() => import("./routes/InventoryMigration/InventoryMigrationItems"));
const InventoryMigration = lazy(() => import("./routes/InventoryMigration/InventoryMigration"));
// Non Inventory Invoicing
const NonInventoryInvoicing = lazy(
  () => import("./routes/NonInventoryInvoicing/NonInventoryInvoicing")
);
const CreateNonInventoryInvoice = lazy(
  () => import("./routes/NonInventoryInvoicing/CreateNonInventoryInvoice")
);

const ViewNonInventoryInvoice = lazy(
  () => import("./routes/NonInventoryInvoicing/ViewNonInventoryInvoice")
);

const getElement = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    return <Navigate to="/home/" />;
  }

  localStorage.clear();
  return <Navigate to="/login" />;
};

const getElementsForAdmin = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    return <Layout />;
  }

  localStorage.clear();
  return <Navigate to="/login" />;
};

const routes = (isLoggedIn: boolean) => [
  //without Layout
  {
    path: "/",
    element: <Outlet />,
    children: [
      {
        path: "/",
        element: getElement(isLoggedIn)
      },
      {
        path: "login",
        element: !isLoggedIn ? <Login /> : <Navigate to="/" />
      },
      { path: "*", element: <NotFound /> }
    ]
  },
  //with Layout
  {
    path: "home",
    element: getElementsForAdmin(isLoggedIn),

    children: [
      { path: "", element: <HomePage /> },
      { path: "dashboard", element: <Dashboard /> },
      // putaway
      { path: "putaway", element: <Putaway /> },
      { path: "putaway/putaway-assignment", element: <FreshPutawayAssignment /> },
      { path: "putaway/putaway-report", element: <PutawayReport /> },
      { path: "putaway/return-putaway", element: <ReturnPutawayAssignment /> },
      // routes
      { path: "routes/create-route", element: <CreateRoute /> },
      { path: "routes/update-route", element: <UpdateRoute /> },
      { path: "routes/update-route/:id", element: <UpdateRouteForm /> },
      // Help
      { path: "help/putaway-assignment", element: <HelpPutawayAssignment /> },
      //Crate Management
      { path: "crate-management/create-crate", element: <CreateCrate /> },
      {
        path: "crate-management/create-crate/template",
        element: <CreateTemplate />
      },
      {
        path: "crate-management/create-crate/generate-crate-id",
        element: <GenerateCrateIDs />
      },
      { path: "crate-management/crate-status", element: <CreateStatus /> },
      { path: "crate-management/crate-status/:id/:taskType", element: <TaskDetails /> },
      { path: "crate-management/qc", element: <CrateQC /> },
      { path: "crate-management/qc/:picklistId", element: <QCOrdersOfAPicklist /> },
      { path: "crate-management/qc/:picklistId/:orderId", element: <QCOrderTabs /> },
      { path: "crate-management/template", element: <CrateTemplate /> },
      { path: "crate-management/crate-unassignment", element: <CrateUnassignment /> },
      { path: "crate-management/ledger", element: <CrateLedger /> },
      { path: "crate-management/ledger/:id", element: <CrateLedgerView /> },
      {
        path: "crate-management/ledger/:taskId/:crateId/:taskType",
        element: <CrateLedgerTypeView />
      },
      // store Edit
      { path: "help/download", element: <HelpDownload /> },
      // iat
      { path: "iat/assignPicklist", element: <IATAssignedPicklist /> },
      // Store
      { path: "stores/all-store", element: <AllStore /> },
      { path: "store/pod-list", element: <ProofOfDelivery /> },
      { path: "store/pod-list/:storeId", element: <ProofOfDelivery /> },
      { path: "store/update-store", element: <StoreHome /> },
      { path: "store/update-store/:storeId", element: <UpdateStore /> },
      // Bundling
      { path: "bundling", element: <Bundling /> },
      { path: "bundling/create", element: <Bundling /> },
      { path: "bundling/all", element: <BundlingProcessOrders /> },
      { path: "bundling/create/:id", element: <BundlingExecution /> },
      // Complaints
      { path: "complaints", element: <Complaints /> },
      // Bulk Download
      { path: "download", element: <Download /> },
      // Products
      { path: "products", element: <Products /> },
      { path: "products/all", element: <Products /> },
      { path: "products/create", element: <CreateProduct /> },
      { path: "products/:productId", element: <ProductTabs /> },
      { path: "products/:id/variants/create", element: <AddVariant /> },
      { path: "products/:id/variants/update/:variantId", element: <AddVariant /> },
      // Product Request
      { path: "products/product-request", element: <ProductRequest /> },
      { path: "products/product-request/hsn-code-finder", element: <HSNCodeFinder /> },
      { path: "products/product-request/:id", element: <ProductRequestTabs /> },
      { path: "products/product-request/create", element: <CreateProductRequest /> },
      // Audits
      { path: "audit/audits", element: <Audits /> },
      { path: "audit/audits/:auditId", element: <AuditsView /> },
      { path: "audit/dispute-list", element: <DisputeList /> },
      { path: "audit/audit-report", element: <AuditReport /> },
      { path: "audit/hold-list", element: <HoldList /> },
      { path: "audit/hold-list/:product_id", element: <ProductHoldList /> },
      // Inventory Migration
      { path: "inventory/inventory-migration", element: <InventoryMigration /> },
      { path: "inventory/inventory-migration/:inventoryMigrationId", element: <InventoryItems /> },
      // Non Inventory Sale
      { path: "non-inventory-invoicing", element: <NonInventoryInvoicing /> },
      { path: "non-inventory-invoicing/create-invoice", element: <CreateNonInventoryInvoice /> },
      {
        path: "non-inventory-invoicing/view/:invoiceId",
        element: <ViewNonInventoryInvoice />
      },

      // Not Found
      { path: "*", element: <NotFound /> }
    ]
  }
];

export default routes;
