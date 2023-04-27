import { useState, useRef, useEffect, MutableRefObject } from "react";

import styles from "./fileUpload.module.css";
import {
  AllowedFileTypes,
  DocFileType,
  FileComingFrom,
  FileUploadButtonType,
  MultipleFileUploadProps
} from "../types/updateStoreTypes";
import { uploadImage, reUploadImage } from "../assests/imageLinks";
import { twoMb } from "../utils/constants";
import { getFileSize, showErrorToast } from "../utils/helperFunctions";

const FileUpload = ({
  buttonType,
  handleMultipleFileUpload,
  id,
  maxFileSizeInBytesAllowed = twoMb,
  accept
}: MultipleFileUploadProps) => {
  const fileInputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [files, setFiles] = useState<{ fileType: AllowedFileTypes; file: File[] } | null>();

  useEffect(() => {
    if (files) {
      const data: DocFileType[] = [];
      for (let i = 0; i < files?.file?.length; i++) {
        if (files.file[i]?.size > maxFileSizeInBytesAllowed) {
          showErrorToast(
            `Your file size exceeds the max file size limit which is ${getFileSize(
              maxFileSizeInBytesAllowed
            )}`
          );
        } else {
          try {
            const reader = new FileReader();
            reader.onloadend = () => {
              data.push({
                url: reader.result as string,
                fileType: files.fileType,
                fileName: files.file[i].name,
                fileComingFrom: FileComingFrom.FRONTEND
              });
            };

            reader.readAsDataURL(files.file[i]);

            // now erasing files from here
            setFiles(null);
          } catch (error) {
            console.log("File Reader Error : ", error);
          }
        }
      }
      handleMultipleFileUpload({
        id: id,
        multipleParams: data,
        files: files.file
      });
    } else {
      setFiles(null);
    }
  }, [files]);

  const filesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesUploaded = [];
      let file: string;

      for (file in files) {
        // check only to add file param from files to the array.
        if (file !== "length" && file !== "item") {
          filesUploaded.push(files[file]);
        }
      }
      setFiles({ fileType: AllowedFileTypes.IMAGE, file: filesUploaded });
      event.target.value = "";
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
          multiple
          onChange={filesSelected}
          accept={accept}
        />
      </div>
    </>
  );
};

export default FileUpload;
