import Paper from "../common/Paper";
import { Row, Col, Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import styles from "./welcomeScreen.module.css";
import { HelpFuncProps } from "../../types/helpTypes";

const { Title, Text } = Typography;

const WelcomeScreen = ({ handleChangeScreen, screenType, pdfUrl }: HelpFuncProps) => {
  return (
    <Paper>
      <Row>
        <Col xs={24} style={{ textAlign: "center" }}>
          <Title level={3}>Welcome to help Section </Title>
        </Col>
        <Col xs={24} style={{ textAlign: "center" }}>
          <Title level={5} type="secondary">
            Here we will tell you about {screenType} and how to use it
          </Title>
        </Col>
      </Row>
      <Row justify="space-around" gutter={16} className="m2-t">
        <Col xs={24} sm={12} className="m2-b">
          <Row>
            <Col xs={24} className="center">
              <Title level={5}>1. Download PDF</Title>
            </Col>
            <Col xs={24} className="center">
              <Text type="secondary" className={styles.explainText}>
                Download a pdf document where you will get all the details about {screenType} and
                its functions
              </Text>
            </Col>
            <Col xs={24} className="center">
              <Button
                icon={<DownloadOutlined />}
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download>
                Download PDF
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={12} className="m2-b">
          <Row>
            <Col xs={24} className="center">
              <Title level={5}>2. Take a tour</Title>
            </Col>
            <Col xs={24} className="center">
              <Text type="secondary" className={styles.explainText}>
                Take a tour of the system where we will walk you through our system and its
                functions
              </Text>
            </Col>
            <Col xs={24} className="center">
              <Button type="primary" onClick={() => handleChangeScreen()}>
                Take a tour
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Paper>
  );
};

export default WelcomeScreen;
