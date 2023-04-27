import { useState, useRef, useEffect, MutableRefObject } from "react";

import styles from "./fileUpload.module.css";
import {
  AllowedFileTypes,
  FileComingFrom,
  FileUploadButtonType,
  FileUploadProps
} from "../types/updateStoreTypes";
import { uploadImage, reUploadImage } from "../assests/imageLinks";
import { twoMb } from "../utils/constants";
import { getFileSize, showErrorToast } from "../utils/helperFunctions";

const FileUpload = ({
  buttonType,
  handleFileUpload,
  id,
  maxFileSizeInBytesAllowed = twoMb,
  accept
}: FileUploadProps) => {
  const fileInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [files, setFiles] = useState<{ fileType: AllowedFileTypes; file: File } | null>();

  useEffect(() => {
    if (files) {
      if (files.file.size > maxFileSizeInBytesAllowed) {
        showErrorToast(
          `Your file size exceeds the max file size limit which is ${getFileSize(
            maxFileSizeInBytesAllowed
          )}`
        );
      } else {
        try {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleFileUpload({
              id: id,
              fileParams: {
                fileType: files.fileType,
                fileName: files.file.name,
                url: reader.result as string,
                fileComingFrom: FileComingFrom.FRONTEND
              },
              file: files.file
            });
          };

          reader.readAsDataURL(files.file);
          // now erasing files from here
          setFiles(null);
        } catch (error) {
          console.log("File Reader Error : ", error);
        }
      }
    } else {
      // setFiles(null);
    }
  }, [files]);

  const filesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.type === "application/pdf") {
        setFiles({ fileType: AllowedFileTypes.PDF, file: file });
      } else if (file.type.slice(0, 5) === "image") {
        setFiles({ fileType: AllowedFileTypes.IMAGE, file: file });
      } else if (file.type === "application/csv" || file.type === "text/csv") {
        setFiles({ fileType: AllowedFileTypes.CSV, file: file });
      } else {
        setFiles({ fileType: AllowedFileTypes.UNKNOWN, file: file });
      }
    } else {
      setFiles(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div onClick={handleUploadClick}>
        <label htmlFor="files" className={styles.dropLabel}>
          {buttonType === FileUploadButtonType.NEW ? (
            <>
              <img src={uploadImage} alt="upload" style={{ width: "1rem" }} />
              <span style={{ marginLeft: "0.5rem" }}>Upload</span>
            </>
          ) : (
            <>
              <img src={reUploadImage} alt="reUpload" style={{ width: "1rem" }} />
              <span style={{ marginLeft: "0.5rem" }}>Upload Again</span>
            </>
          )}
        </label>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.fileInput}
          // multiple
          onChange={filesSelected}
          accept={accept}
        />
      </div>
    </>
  );
};

export default FileUpload;
