import { message, Skeleton, Steps } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoutesByID } from "../../api/Routes";
import Paper from "../../Components/common/Paper";
import Step1 from "../../Components/ShipmentRoutes/Step1";
import Step2 from "../../Components/ShipmentRoutes/Step2";
import Step3 from "../../Components/ShipmentRoutes/Step3";

enum screens {
  ENTER_NAME,
  ADD_STORES,
  REVIEW
}

const steps = ["Enter Name and starting Point", "Enter Stores", "Review"];

export default function updateRouteForm() {
  const [screen, setScreen] = useState(screens.ENTER_NAME);
  const [routesArray, setRoutesArray] = useState<{ label: string; key: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeDetail, setRouteDetail] = useState<
    | {
        route_name?: string;
        starting_point?: {
          label?: string;
          value?: number;
          key?: number;
        };
      }
    | Record<string, unknown>
  >({});

  const { id } = useParams();

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    getRoutesByID(id)
      .then((res) => {
        setRouteDetail({
          route_name: res.name,
          starting_point: {
            label: res.warehouse_id.name,
            value: res.warehouse_id.id,
            key: res.warehouse_id.id
          }
        });

        const tempStores: { label: string; key: number }[] = [];

        if (res.paths.length != 0) {
          res.paths.forEach((element: any) => {
            tempStores[element.position - 1] = { label: element.store, key: element.id };
          });
          setRoutesArray(tempStores);
        } else {
          message.error("No stores added in this route!");
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onChangeScreen = (current: number) => {
    setScreen(current);
  };

  return loading ? (
    <Skeleton />
  ) : (
    <Paper>
      <Steps
        onChange={(current) => onChangeScreen(current)}
        current={screen}
        style={{ padding: "0 10%", marginBottom: "2rem" }}>
        {steps.map((title, key) => (
          <Steps.Step disabled={screen == key || key > screen} key={key} title={title} />
        ))}
      </Steps>

      {screen == screens.ENTER_NAME ? (
        <Step1
          routeDetail={routeDetail}
          setRouteDetail={setRouteDetail}
          setScreen={() => setScreen(screens.ADD_STORES)}
        />
      ) : (
        <></>
      )}

      {screen == screens.ADD_STORES ? (
        <Step2
          routesArray={routesArray}
          setRoutesArray={setRoutesArray}
          setScreen={() => setScreen(screens.REVIEW)}
        />
      ) : (
        <></>
      )}

      {screen == screens.REVIEW ? (
        <Step3
          routeDetail={routeDetail}
          routesArray={routesArray}
          setRoutesArray={setRoutesArray}
          setRouteDetail={setRouteDetail}
          type="update"
          id={id}
        />
      ) : (
        <></>
      )}
    </Paper>
  );
}
