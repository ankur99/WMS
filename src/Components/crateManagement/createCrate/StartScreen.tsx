import React from "react";
import { Row, Col, Typography, Card, Space } from "antd";
import CrateImage from "../../../assests/create_crate.png";
import GenerateCrateImage from "../../../assests/generate_crate.png";
import Paper from "../../common/Paper";
import { screens, FuncProps } from "../../../types/crateManagementTypes";
import { useNavigate } from "react-router-dom";

const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper>
      <Row gutter={[40, 10]}>
        <Col span={12}>
          <Card
            bodyStyle={cardStyle}
            onClick={() => navigate(`/home/crate-management/create-crate/template`)}>
            <Space align="center" direction="vertical" size="large">
              <img src={CrateImage} />
              <Typography.Text strong>Create Crate template</Typography.Text>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            bodyStyle={cardStyle}
            onClick={() => navigate(`/home/crate-management/create-crate/generate-crate-id`)}>
            <Space align="center" direction="vertical" size="large">
              <img src={GenerateCrateImage} />
              <Typography.Text strong>Generate Crate ID</Typography.Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </Paper>
  );
};

const cardStyle = {
  display: "flex",
  justifyContent: "center",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px"
};

export default StartScreen;
