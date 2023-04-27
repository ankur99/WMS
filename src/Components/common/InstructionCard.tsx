import React from "react";
import { Row, Col, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Paper from "./Paper";

// import style from "./addMigration.module.css";

const { Title } = Typography;

type StepsCardType = {
  id: number;
  title: string;
  text: string;
};

type PropType = {
  cardData: StepsCardType[];
  setScreen: () => void;
};

const InstructionCard = ({ cardData, setScreen }: PropType) => {
  return (
    <Paper>
      <Row>
        <Col xs={24} style={{ textAlign: "center" }}>
          <Title level={3}>How to Create new route</Title>
        </Col>
      </Row>
      <Row justify="space-around" gutter={16} style={{ marginTop: "2rem" }}>
        {cardData.map((data: StepsCardType) => (
          <StepsCard key={data.id} {...data} />
        ))}
      </Row>
      <Row justify="center">
        <Col>
          <Button type="primary" onClick={setScreen} icon={<PlusOutlined />}>
            Create new Route
          </Button>
        </Col>
      </Row>
    </Paper>
  );
};

export default InstructionCard;

const StepsCard = ({ title, text }: StepsCardType) => {
  return (
    <Col xs={24} sm={12} md={8} style={{ textAlign: "center", marginBottom: "2rem" }}>
      <Title level={5} style={{ maxWidth: "12rem", marginLeft: "auto", marginRight: "auto" }}>
        {title}
      </Title>
      <div>{text}</div>
    </Col>
  );
};
