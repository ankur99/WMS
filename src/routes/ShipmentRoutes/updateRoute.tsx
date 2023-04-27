import { Table, Space, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { changeRouteStatus, deleteRoute, getRoutes } from "../../api/Routes";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TablePaginationConfig } from "antd";

const updateRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const columns = [
    {
      title: "WH ID",
      dataIndex: "warehouse_id",
      key: "warehouse_id",
      render: (warehouse: any) => warehouse.name
    },
    {
      title: "Route ID",
      dataIndex: "id",
      key: "id"
    },
    {
      title: "Route Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "#DD",
      dataIndex: "paths",
      key: "paths",
      render: (value: []) => value.length
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance"
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <a onClick={() => navigate(`/home/routes/update-route/${record.id}`, { state: record })}>
            Update
          </a>
          {record.is_active == 0 ? (
            <Popconfirm
              title="Are you sure？"
              icon={<QuestionCircleOutlined style={{ color: "green" }} />}
              onConfirm={() => changeStatus(record.id, "activate")}>
              <a>activate</a>{" "}
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure？"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => changeStatus(record.id, "deactivate")}>
              <a>De-activate</a>
            </Popconfirm>
          )}
          |
          <Popconfirm
            title="Are you sure？"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => onDelteRoute(record.id)}>
            <a style={{ color: "red" }} href="#">
              Delete
            </a>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleChange = (pagination: TablePaginationConfig) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    const params = {
      current_page: newPage
    };
    load(params);
  };

  const changeStatus = async (id: number, type: string) => {
    setLoading(true);
    await changeRouteStatus(id, type)
      .then((res) => {
        const updatedIndex = routes.findIndex((el: any) => el.id == id);
        const updatedState: any = [...routes];
        updatedState[updatedIndex] = res;
        setRoutes(updatedState);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const onDelteRoute = async (id: number) => {
    setLoading(true);
    await deleteRoute(id)
      .then((res) => {
        message.success(res);
        setRoutes((prevState: any) => {
          return prevState.filter((element: any) => element.id != id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const params = {
      current_page: currentPage
    };
    load(params);
  }, []);

  const load = async (parmas: any) => {
    setLoading(true);
    await getRoutes(parmas)
      .then((res) => {
        // console.log("checking items", res.data);
        setRoutes(res.data);
        setTotalItems(res.meta.total);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <>
      {routes && (
        <Table
          onChange={handleChange}
          pagination={{
            current: currentPage,
            pageSize: 15,
            total: totalItems,
            showSizeChanger: false
          }}
          rowKey={(record) => record.id}
          loading={loading}
          columns={columns}
          dataSource={routes}
        />
      )}
    </>
  );
};

export default updateRoute;
