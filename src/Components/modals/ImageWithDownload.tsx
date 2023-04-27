import { Button, Image } from "antd";
import { useState } from "react";
import styles from "./pod.module.css";
import { DownloadOutlined } from "@ant-design/icons";

interface ImageButtonProps {
  item: { url: string };
  index: number;
  downloadImage: (index: number) => void;
  isLoading: boolean;
}

const ImageWithButton = ({ item, index, downloadImage, isLoading }: ImageButtonProps) => {
  const [imageLoaded, setImageLoaded] = useState<number>();
  return (
    <div className={styles.images} key={index}>
      <Image
        width={"100%"}
        height={"auto"}
        src={item?.url}
        alt="image preview"
        key={index}
        onError={() => {
          setImageLoaded(index);
        }}
      />
      {imageLoaded !== index && (
        <Button
          disabled={isLoading}
          shape="circle"
          type="link"
          className={styles.button}
          onClick={() => {
            downloadImage(index);
          }}>
          <DownloadOutlined />
        </Button>
      )}
    </div>
  );
};
export default ImageWithButton;
