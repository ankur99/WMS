import {
  DashboardOutlined,
  AppstoreAddOutlined,
  QuestionCircleOutlined,
  CodeSandboxOutlined,
  NodeIndexOutlined,
  ShopOutlined,
  BuildOutlined,
  InboxOutlined,
  DownloadOutlined,
  ReconciliationOutlined,
  FileTextOutlined,
  FormOutlined,
  CalculatorOutlined,
  AuditOutlined,
  ShoppingOutlined
} from "@ant-design/icons";

export default {
  route: {
    path: "/",
    routes: [
      {
        path: "/home/dashboard",
        name: "Dashboard",
        icon: <DashboardOutlined />,
        component: "./Dashboard"
      },
      {
        path: "/home/routes",
        name: "Shipment Routes",
        icon: <NodeIndexOutlined />,
        access: "canAdmin",
        routes: [
          {
            path: "/home/routes/create-route",
            name: "Create Route",
            icon: <NodeIndexOutlined />
          },
          {
            path: "/home/routes/update-route",
            name: "Update Route",
            icon: <NodeIndexOutlined />
          }
        ]
      },
      {
        path: "/home/putaway",
        name: "Putaway",
        icon: <CodeSandboxOutlined />,
        access: "canAdmin",
        component: "./putaway",
        routes: [
          {
            path: "/home/putaway/putaway-assignment",
            name: "Fresh Putaway Assignment",
            icon: <CodeSandboxOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/putaway/putaway-report",
            name: "Putaway Report",
            icon: <CodeSandboxOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/putaway/return-putaway",
            name: "Return Putaway Assignment"
          }
        ]
      },
      {
        path: "/home/iat",
        name: "IAT",
        icon: <AppstoreAddOutlined />,
        access: "canAdmin",
        component: "./iat",
        routes: [
          {
            path: "/home/iat/assignPicklist",
            name: "Assign Picklist",
            icon: <AppstoreAddOutlined />,
            component: "./Welcome"
          }
        ]
      },
      {
        path: "/home/bundling",
        name: "Bundling",
        icon: <BuildOutlined />,
        access: "canAdmin",
        component: "./help",
        routes: [
          {
            path: "/home/bundling/create",
            name: "Recipes",
            icon: <BuildOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/bundling/create/:id",
            name: "Past Executed Data",
            icon: <BuildOutlined />,
            component: "./Welcome",
            hideInMenu: true
          },
          {
            path: "/home/bundling/all",
            name: "Process Orders",
            icon: <BuildOutlined />,
            component: "./Welcome"
          }
        ]
      },
      {
        path: "/home/download",
        name: "Download",
        icon: <DownloadOutlined />,
        component: "./download"
      },
      {
        path: "/home/complaints",
        name: "Complaints",
        icon: <InboxOutlined />
      },
      {
        path: "/home/inventory/inventory-migration",
        name: "Inventory Migration",
        icon: <ReconciliationOutlined />
      },
      {
        path: "/home/inventory/inventory-migration/:id",
        name: "Inventory Migration Items",
        icon: <ReconciliationOutlined />,
        hideInMenu: true
      },
      {
        path: "/home/crate-management",
        name: "Crate Management",
        icon: <InboxOutlined />,
        access: "canAdmin",
        component: "./crateManagement",
        routes: [
          {
            path: "/home/crate-management/create-crate",
            name: "Create Crate",
            icon: <InboxOutlined />,
            routes: [
              {
                path: "/home/crate-management/create-crate/template",
                name: "Create Template",
                icon: <InboxOutlined />,
                hideInMenu: true
              },
              {
                path: "/home/crate-management/create-crate/generate-crate-id",
                name: "Create Crates",
                icon: <InboxOutlined />,
                hideInMenu: true
              }
            ]
          },
          {
            path: "/home/crate-management/template",
            name: "Crate Template",
            icon: <InboxOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/crate-management/crate-status",
            name: "Crate Status",
            icon: <InboxOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/crate-management/qc",
            name: "QC home page",
            icon: <InboxOutlined />
          },
          {
            path: "/home/crate-management/ledger",
            name: "Crate Ledger",
            icon: <InboxOutlined />
          },
          {
            path: "/home/crate-management/crate-unassignment",
            name: "Crate Unassignment",
            icon: <InboxOutlined />
          }
        ]
      },
      {
        path: "/home/non-inventory-invoicing",
        name: "Non Inventory Invoicing",
        icon: <FileTextOutlined />,
        hideInMenu: false,
        routes: [
          {
            path: "/home/non-inventory-invoicing/create-invoice",
            name: "Create Invoice",
            hideInMenu: true
          },
          {
            path: "/home/non-inventory-invoicing/view/:invoiceId",
            name: "View Non Inventory Invoice",
            hideInMenu: true
          }
        ]
      },
      {
        path: "/home/store",
        name: "Stores",
        icon: <ShopOutlined />,
        component: "./store",
        routes: [
          {
            path: "/home/stores/all-store",
            name: "All Store",
            icon: <ShopOutlined />,
            component: "./Stores"
          },
          {
            path: "/home/store/pod-list",
            name: "Proof of Delivery",
            icon: <ShoppingOutlined />,
            component: "./Stores"
          }
        ]
      },
      {
        path: "/home/audit",
        name: "Audit",
        icon: <FormOutlined />,
        routes: [
          {
            path: "/home/audit/audits",
            name: "Audits",
            icon: <FormOutlined />,
            component: "./Audits"
          },
          {
            path: "/home/audit/audits/:id",
            name: "Audit View",
            icon: <FormOutlined />,
            component: "./Welcome",
            hideInMenu: true
          },
          { path: "/home/audit/dispute-list", name: "Dispute List", icon: <CalculatorOutlined /> },
          {
            path: "/home/audit/audit-report",
            name: "Audit Report",
            icon: <AuditOutlined />
          },
          {
            path: "/home/audit/hold-list",
            name: "Hold List",
            icon: <AuditOutlined />
          },
          {
            path: "/home/audit/hold-list/:id",
            name: "Product Hold List",
            icon: <AuditOutlined />,
            hideInMenu: true
          }
        ]
      },
      {
        path: "/home/products",
        name: "Products",
        icon: <ShoppingOutlined />,
        access: "canAdmin",
        component: "./products",
        routes: [
          {
            path: "/home/products/all",
            name: "All Products",
            icon: <ShoppingOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/products/product-request",
            name: "Product Request",
            icon: <InboxOutlined />,
            routes: [
              {
                path: "/home/products/product-request/create",
                name: "Create Product Request",
                icon: <InboxOutlined />,
                hideInMenu: true
              },
              {
                path: "/home/products/product-request/:id",
                name: "Edit Product Request",
                icon: <InboxOutlined />,
                hideInMenu: true
              }
            ]
          },
          {
            path: "/home/products/create",
            name: "CreateProduct",
            icon: <ShoppingOutlined />,
            component: "./Welcome",
            hideInMenu: true
          },
          {
            path: "/home/products/:id",
            name: "Edit Product",
            icon: <ShoppingOutlined />,
            component: "./Welcome",
            hideInMenu: true
          },
          {
            path: "/home/products/:id/variants/create",
            name: "Add Variant",
            icon: <ShoppingOutlined />,
            component: "./Welcome",
            hideInMenu: true
          },
          {
            path: "/home/products/:id/variants/update/:variantId",
            name: "Edit Variant",
            icon: <ShoppingOutlined />,
            component: "./Welcome",
            hideInMenu: true
          }
        ]
      },
      {
        path: "/home/help",
        name: "Help",
        icon: <QuestionCircleOutlined />,
        access: "canAdmin",
        component: "./help",
        routes: [
          {
            path: "/home/help/putaway-assignment",
            name: "Putaway Assignment",
            icon: <QuestionCircleOutlined />,
            component: "./Welcome"
          },
          {
            path: "/home/help/download",
            name: "Bulk Download",
            icon: <QuestionCircleOutlined />,
            component: "./Welcome"
          }
        ]
      }
    ]
  },
  location: {
    pathname: "/"
  }
};
