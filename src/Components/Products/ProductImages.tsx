import { Col, Row, Typography, Spin, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import Paper from "../common/Paper";
import FileUpload from "../FileUpload";
import { FileUploadButtonType } from "../../types/updateStoreTypes";
import {
  useProductImage,
  useUploadProductImage,
  useDeleteProductImage
} from "../../hooks/useRQProducts";
import { onError, showSuccessToast } from "../../utils/helperFunctions";

const { Title } = Typography;

const maxFileSize = 1024 * 1024 * 10; // 10mb

interface ProductImagesProps {
  productId: string;
  shouldRefetch: boolean;
}

const ProductImages = ({ productId, shouldRefetch }: ProductImagesProps) => {
  const { isLoading, data: productImageData } = useProductImage({
    productId,
    onError,
    shouldRefetch
  });

  const { isLoading: mutationLoading, mutate: sendFileToBackend } = useUploadProductImage({
    onError,
    onSuccess: showSuccessToast
  });

  const { isLoading: deleteLoading, mutate: deleteImage } = useDeleteProductImage({
    onError,
    onSuccess: showSuccessToast
  });

  const handleFileUpload = ({
    // id,
    // fileParams,
    file
  }: {
    // id: string;
    // fileParams: DocFileType;
    file: File;
  }) => {
    const formData = new FormData();

    formData.append("image", file);
    sendFileToBackend({
      productId,
      payload: formData
    });
  };

  return (
    <Spin spinning={isLoading || mutationLoading || deleteLoading}>
      <Paper>
        <Row gutter={24}>
          <Col sm={18} xs={24}>
            <Title level={3}> Images Upload</Title>
          </Col>
          <Col sm={6} xs={24} style={{ textAlign: "right" }}>
            <FileUpload
              id="images_product"
              buttonType={FileUploadButtonType.NEW}
              handleFileUpload={handleFileUpload}
              maxFileSizeInBytesAllowed={maxFileSize}
              accept={"image/jpg,image/png,image/gif,image/jpeg,image/webp"}
            />
          </Col>
          {productImageData?.map((imageData: { url: string; id: number }) => (
            <Col key={imageData.id} md={6} sm={12} xs={24}>
              <div style={{ position: "relative" }}>
                <img src={imageData.url} alt="product image" />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  danger
                  style={{ position: "absolute", top: "0.25rem", right: "0.25rem" }}
                  onClick={() => deleteImage({ imageId: imageData.id })}
                />
              </div>
            </Col>
          ))}
        </Row>
        {productImageData && productImageData?.length === 0 && (
          <p style={{ textAlign: "center" }}>No Images Found</p>
        )}
      </Paper>
    </Spin>
  );
};

export default ProductImages;
