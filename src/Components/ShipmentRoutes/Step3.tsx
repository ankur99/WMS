import { Button, Card, Col, message, Row, Typography } from "antd";
import { arrowDownImage } from "../../assests/imageLinks";
import { uploadRoute } from "../../api/Routes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ERROR_FALLBACK_TEXT } from "../../utils/constants";

type PropType = {
  routesArray: { label: string; key: number }[];
  routeDetail?: any;
  setRoutesArray: Dispatch<SetStateAction<{ label: string; key: number }[]>>;
  setRouteDetail: Dispatch<SetStateAction<any>>;
  type: string;
  id?: string;
};

type routesParamType = {
  id: number;
  position: number;
};

const Step3 = ({ routesArray, routeDetail, setRoutesArray, type, id }: PropType) => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const createRoute = () => {
    setLoading(true);
    const routesParam: routesParamType[] = [];

    routesArray.forEach((element, index) => {
      routesParam.push({ id: element.key, position: index + 1 });
    });

    const params = {
      name: routeDetail.route_name,
      type: "WMS",
      startPoint: routeDetail.starting_point.value,
      stores: routesParam
    };

    uploadRoute(params, type, id)
      .then(() => {
        setLoading(false);
        // console.log("res", res);
        message.success(`Route ${type}d successfully`);
        navigate("/home/routes/update-route");
      })
      .catch(() => {
        setLoading(false);
        // console.log("err", err);
        message.error(ERROR_FALLBACK_TEXT);
      });

    // console.log("params", params);
  };

  useEffect(() => {
    const tempRoutes = routesArray.filter((element) => element != undefined && element.label);
    setRoutesArray(tempRoutes);
  }, []);

  return (
    <Row gutter={[10, 20]} style={{ textAlign: "center" }}>
      <Col span={12} offset={6}>
        <Typography.Title level={5}>{routeDetail.route_name}</Typography.Title>
      </Col>
      <Col span={12} offset={6}>
        <Card size="small">
          <Typography.Text type="secondary">Starting Point</Typography.Text>
          <br />
          <Typography.Text strong>{routeDetail.starting_point.label}</Typography.Text>
        </Card>
        <img src={arrowDownImage} style={{ display: "inline" }} />
      </Col>
      {routesArray.map((item, key) => (
        <Col key={key} span={10} offset={7}>
          <Card size="small">
            <Typography.Text type="secondary">RD - {key + 1}</Typography.Text>
            <br />
            <Typography.Text strong>{item && item.label}</Typography.Text>
          </Card>
          {key < routesArray.length - 1 && (
            <img src={arrowDownImage} style={{ display: "inline" }} />
          )}
        </Col>
      ))}
      <Col span={12} offset={6}>
        <Button loading={loading} onClick={createRoute} type="primary">
          Submit
        </Button>
      </Col>
    </Row>
  );
};

export default Step3;
