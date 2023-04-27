import { useEffect, useState } from "react";
import { Avatar } from "antd";

import ProLayout, { PageContainer } from "@ant-design/pro-layout";
import defaultProps from "./_defaultProps";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { profileImage } from "../../assests/imageLinks";
import { getWareHouseName } from "../../utils/helperFunctions";
import { Route } from "@ant-design/pro-layout/lib/typings";
import { logoImage } from "../../assests/imageLinks";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  return (
    <div
      id="test-pro-layout"
      style={{
        height: "100vh"
      }}>
      <ProLayout
        {...defaultProps}
        location={{
          pathname
        }}
        // breadcrumbRender={(route) => {
        //   console.log({ route });

        //   if (route && route?.length > 0) {
        //     const customRoute: any = route;
        //     customRoute[0].path = "#";
        //     return customRoute;
        //   }
        // }}
        title="Niyotail"
        logo={logoImage}
        navTheme="light"
        fixSiderbar={true}
        layout="mix"
        contentWidth="Fixed"
        // headerHeight={48}
        // primaryColor="#1890ff"
        splitMenus={false}
        fixedHeader={true}
        onMenuHeaderClick={() => {
          navigate("/home/dashboard");
          setPathname("/home/dashboard");
        }}
        menuItemRender={(item: any, dom: any) => (
          <a
            onClick={() => {
              // console.log("item.path", item.path);
              // setPathname(item?.path || "home/dashboard");
              navigate(item?.path || "home/dashboard");
            }}>
            {dom}
          </a>
        )}
        rightContentRender={() => (
          <div className="wareHouseWrapper">
            <div className="wareHouseHeader" onClick={() => navigate("/home/dashboard")}>
              {getWareHouseName()}
            </div>
            <Avatar shape="square" size="small" src={profileImage} alt="profile" />
          </div>
        )}
        itemRender={(route: Route, _, routes: Route[]) => {
          const isNotLast = !!routes
            .filter((_, index: number) => index !== routes.length - 1)
            .find((item: Route) => item.path === route.path);
          return isNotLast ? (
            <Link to={route.path || "/"}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default Layout;
