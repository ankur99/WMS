import { Popconfirm, Button } from "antd";

import styles from "../../../routes/CrateManagement/crateUnassignemnt.module.css";
import { CrateData } from "../../../types/crateUnassignmentTypes";

const markText = "Are you Sure you want to mark this crate as unassigned?";

const RightSideDesign = ({
  crateData,
  unassignCrates
}: {
  crateData: CrateData;
  unassignCrates: (ids: number[], referenceIds: string[]) => void;
}) => {
  const onConfirm = (id: number, referenceId: string) => {
    unassignCrates([id], [referenceId]);
  };
  return (
    <div className={styles.rightCrateDesign}>
      <div className={styles.rightCrateDesignInfo}>
        <h4>Crate ID</h4>
        <p>{crateData?.reference_id}</p>
      </div>
      <div className={styles.rightCrateDesignInfo}>
        <h4>Status</h4>
        <p style={{ color: "#00C6AE", textTransform: "capitalize" }}>{crateData?.status}</p>
      </div>
      <div className={styles.rightCrateDesignInfo}>
        <h4>Order ID</h4>
        <p>{crateData?.order_id}</p>
      </div>
      <Popconfirm
        title={markText}
        onConfirm={() => onConfirm(crateData?.id, crateData?.reference_id)}
        // onCancel={cancel}
        okText="Yes"
        cancelText="No">
        <Button type="primary">Mark Unassigned</Button>
      </Popconfirm>
    </div>
  );
};

export default RightSideDesign;
