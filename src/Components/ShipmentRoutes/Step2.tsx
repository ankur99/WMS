import { Button, Col, Form, Row } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dragula from "dragula";
import "dragula/dist/dragula.css";
import "./DraggableTable.css";
import DebounceSelect from "../common/DebounceSelect";
import { searchStores } from "../../api/Search";

type PropType = {
  setScreen: () => void;
  setRoutesArray: Dispatch<SetStateAction<{ label: string; key: number }[]>>;
  routesArray: any;
};

const getIndexInParent = (el: any) => Array.from(el.parentNode.children).indexOf(el);

const Step2 = ({ setScreen, setRoutesArray, routesArray }: PropType) => {
  const [routes, setRoute] = useState<any>([]);

  const onFinish = () => {
    // console.log("Success:", routes);
    setRoutesArray(routes);
    setScreen();
  };

  const addStore = () => {
    setRoute((routes: any) => {
      return [...routes, {}];
    });
  };

  useEffect(() => {
    if (routesArray.length != 0) {
      setRoute(routesArray);
    }
  }, []);

  const handleReorder = (dragIndex: number, draggedIndex: number) => {
    setRoute((oldState: any) => {
      const newState = [...oldState];
      const item = newState.splice(dragIndex, 1)[0];
      newState.splice(draggedIndex, 0, item);
      // console.log("newState", newState);
      return newState;
    });
  };

  useEffect(() => {
    let start: number;
    let end: number;
    const container: any = document.querySelector(".drag-container");
    const drake = dragula([container], {
      moves: (el) => {
        start = getIndexInParent(el);
        return true;
      }
    });

    drake.on("drop", (el) => {
      end = getIndexInParent(el);
      handleReorder(start, end);
    });
  }, []);

  const canProceed = () => {
    if (routes.length == 0) {
      return true;
    } else if (
      (routes.length == 1 && routes[0] && !routes[0].label) ||
      routes[0] == {} ||
      routes[0] == undefined
    ) {
      return true;
    } else {
      false;
    }
  };

  return (
    <Row>
      <Col span={12} offset={6}>
        <Form
          name="basic"
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off">
          <div className="drag-container">
            {routes.map((route: any, key: number) => (
              <Row key={key} gutter={8}>
                <Col span={24}>
                  <Form.Item
                    key={key}
                    name={key}
                    initialValue={route}
                    rules={[{ required: false, message: "Please input route name!" }]}>
                    <DebounceSelect
                      fetchOptions={searchStores}
                      disabledOptions={routes}
                      onChange={(value) => {
                        setRoute((prevState: any) => {
                          const newState = [...prevState];
                          newState[key] = value;
                          return newState;
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={4}>
                  <Button onClick={() => remove(key)} shape="circle" size="small">
                    x
                  </Button>
                </Col> */}
              </Row>
            ))}
          </div>

          <Row>
            <Col span={24}>
              <Button onClick={() => addStore()} style={{ width: "100%" }} type="dashed">
                Add Store+
              </Button>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right", marginTop: 10 }} wrapperCol={{ span: 24 }}>
            <Button disabled={canProceed()} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Step2;
