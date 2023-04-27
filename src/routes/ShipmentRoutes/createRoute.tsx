import { Steps } from "antd";
import { useState } from "react";
import InstructionCard from "../../Components/common/InstructionCard";
import Paper from "../../Components/common/Paper";
import Step1 from "../../Components/ShipmentRoutes/Step1";
import Step2 from "../../Components/ShipmentRoutes/Step2";
import Step3 from "../../Components/ShipmentRoutes/Step3";

enum screens {
  INSTRUCTIONS,
  ENTER_NAME,
  ADD_STORES,
  REVIEW
}

const steps = ["Instructions", "Enter Name and starting Point", "Enter Stores", "Review"];

const cardData = [
  {
    id: 1,
    title: "1. First Select the State and District of the route",
    text: "Select the areas the route will cover"
  },
  {
    id: 2,
    title: "2. Select the Stores",
    text: "Select the stores the route will deliver to"
  },
  {
    id: 3,
    title: "3. Select locations to complete migration",
    text: "Enter the source and destination location for the migration"
  }
];

export default function TaskDetail() {
  const [screen, setScreen] = useState(screens.INSTRUCTIONS);
  const [routesArray, setRoutesArray] = useState<{ label: string; key: number }[]>([]);
  const [routeDetail, setRouteDetail] = useState<{
    route_name?: string;
    starting_point?: {
      label?: string;
      value?: number;
      key?: number;
    };
  }>({});

  const onChangeScreen = (current: number) => {
    setScreen(current + 1);
  };

  return (
    <Paper>
      {screen == screens.INSTRUCTIONS ? (
        <InstructionCard setScreen={() => setScreen(screens.ENTER_NAME)} cardData={cardData} />
      ) : (
        <></>
      )}

      {screen != screens.INSTRUCTIONS ? (
        <Steps
          onChange={(current) => onChangeScreen(current)}
          current={screen - 1}
          style={{ padding: "0 10%", marginBottom: "2rem" }}>
          {steps.map(
            (title, key) =>
              key != screens.INSTRUCTIONS && (
                <Steps.Step disabled={screen == key || key > screen} key={key} title={title} />
              )
          )}
        </Steps>
      ) : (
        <></>
      )}

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
          // setScreen={() => setScreen(screens.INSTRUCTIONS)}
          setRoutesArray={setRoutesArray}
          setRouteDetail={setRouteDetail}
          type="create"
        />
      ) : (
        <></>
      )}
    </Paper>
  );
}
