import { Button, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { creatCrateImage } from "../../../assests/imageLinks";
import styles from "../../../routes/CrateManagement/crateUnassignemnt.module.css";
import { LeftCrateDesignProps } from "../../../types/crateUnassignmentTypes";

const LeftCrateDesign = ({
  crateData,
  removeCrateData,
  currentCrateSelected,
  changeCurrentCrateSelected
}: LeftCrateDesignProps) => {
  return (
    <div
      className={styles.leftCrateDesign}
      style={{
        backgroundColor:
          currentCrateSelected === crateData?.reference_id ? "rgba(24, 144, 255, 0.09)" : ""
      }}
      onClick={() => changeCurrentCrateSelected(crateData?.reference_id)}>
      <img src={creatCrateImage} alt="crate-image" />
      <h4 className={styles.leftText}>Crate ID- {crateData?.reference_id}</h4>
      <Tooltip title="Remove">
        <Button
          size="small"
          type="primary"
          shape="circle"
          icon={<CloseOutlined />}
          onClick={() => removeCrateData(crateData?.reference_id)}
        />
      </Tooltip>
    </div>
  );
};

export default LeftCrateDesign;
