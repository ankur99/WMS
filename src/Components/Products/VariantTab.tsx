import { Col, Row, Typography, Button } from "antd";

import Paper from "../common/Paper";
import VariantsTable from "./VariantsTable";
import { Link } from "react-router-dom";
import { ProductVariant } from "../../types/ProductTypes";
const { Title } = Typography;

interface VariantTabProps {
  variantData: undefined | ProductVariant[];
  productId: string;
}

const VariantTab = ({ variantData, productId }: VariantTabProps) => {
  return (
    <Paper>
      <Row>
        <Col span={12}>
          <Title level={3}> Variant Information</Title>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Link to={`variants/create`}>
            <Button type="primary" size="small">
              Add Variant
            </Button>
          </Link>
        </Col>
      </Row>
      <VariantsTable variantData={variantData} productId={productId} />
    </Paper>
  );
};

export default VariantTab;
