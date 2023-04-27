import { Button, Modal, Image, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { onErrorNotification } from "../../utils/helperFunctions";
import { PODData, PODArrayData } from "../../types/podTypes";

import { useState } from "react";
import ImageWithButton from "./ImageWithDownload";
import { fetchPodImages, useFetchImagesPod } from "../../hooks/useRQStores";
const fileNameInitail = "PodImage";

interface PodModalProps {
  visible: boolean;
  handleCancel: () => void;
  shipment_id: string;
}

const PODPreviewModal = ({ visible, handleCancel, shipment_id }: PodModalProps) => {
  const [downloadImagesData, setdownloadImagesData] = useState<PODArrayData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isLoading: imagesLoading,
    data: imagesPodData
  }: { isLoading: boolean; data: PODData | undefined } = useFetchImagesPod({
    shipment_id,
    onError: onErrorNotification
  });

  const generateLink = (imageArray: PODArrayData[], index: number) => {
    const imageDownLoadLink = document.createElement("a");
    imageDownLoadLink.href = `data:image/${imageArray[index]?.file_type} ;base64, ${imageArray[index]?.pod_base_url}`;
    imageDownLoadLink.download = `${shipment_id}-${index + 1}` || fileNameInitail;
    imageDownLoadLink.click();
    imageDownLoadLink.remove();
  };

  const downloadImage = async (index: number) => {
    if (downloadImagesData.length === 0) {
      setIsLoading(true);
      const res = await fetchPodImages(shipment_id);
      if (!Object.keys(res).length) {
        setIsLoading(false);
        return;
      }

      const { pod_images_arr } = res;

      setIsLoading(false);

      setdownloadImagesData(pod_images_arr);
      generateLink(pod_images_arr, index);
    } else {
      generateLink(downloadImagesData, index);
    }
  };

  const downloadAll = async () => {
    if (downloadImagesData.length === 0) {
      setIsLoading(true);
      const res = await fetchPodImages(shipment_id);
      if (!Object.keys(res).length) {
        setIsLoading(false);
        return;
      }

      const { pod_images_arr } = res;
      setIsLoading(false);
      setdownloadImagesData(pod_images_arr);
      for (let i = 0; i < pod_images_arr.length; i++) {
        generateLink(pod_images_arr, i);
      }
    } else {
      for (let i = 0; i < downloadImagesData.length; i++) {
        generateLink(downloadImagesData, i);
      }
    }
  };

  return (
    <Modal
      destroyOnClose
      title={
        <div>
          <span>Preview POD</span>
          <Button disabled={isLoading} type="link" onClick={downloadAll}>
            <DownloadOutlined /> Download All
          </Button>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}>
      <Spin spinning={imagesLoading || isLoading}>
        <Image.PreviewGroup>
          {imagesPodData?.pod_images &&
            imagesPodData?.pod_images?.map((item, index: number) => {
              return (
                <ImageWithButton
                  key={index}
                  item={item}
                  index={index}
                  downloadImage={downloadImage}
                  isLoading={isLoading}
                />
              );
            })}
        </Image.PreviewGroup>
      </Spin>
    </Modal>
  );
};

export default PODPreviewModal;
