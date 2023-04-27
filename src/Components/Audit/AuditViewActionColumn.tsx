import { useState } from "react";
import { Button, Space } from "antd";

import { useAuditItemSettle } from "../../hooks/Audit/useRQAuditView";

import { AuditItemsStatusType, AuditReasonsType, AuditStatusType } from "../../types/auditTypes";
import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import SettleAuditModal from "../modals/Audit/SettleAuditModal";

interface AuditViewActionColumnProps {
  auditItemId: number;
  auditStatus: AuditStatusType | undefined;
  isAuditAutoSettle: boolean | undefined;
  auditItemStatus: AuditItemsStatusType | undefined;
  handleCancelAudit: (arg: number) => void;
  handleAssignReassignAuditItem: (arg: number) => void;
  finalVariance: number | null;
}

const AuditViewActionColumn = ({
  auditItemId,
  auditStatus,
  isAuditAutoSettle,
  auditItemStatus,
  handleCancelAudit,
  handleAssignReassignAuditItem,
  finalVariance
}: AuditViewActionColumnProps) => {
  const [isAuditSettleModalVisible, setIsAuditSettleModalVisible] = useState(false);

  const onSuccess = (msg: string) => {
    showSuccessToast(msg);
    setIsAuditSettleModalVisible(false);
    return;
  };

  const { isLoading: settleLoading, mutate: settleAuditItems } = useAuditItemSettle({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const handleAuditSettle = (payload: {
    audit_item_id: number | undefined;
    reason_id?: number;
  }) => {
    settleAuditItems(payload);
  };

  if (auditStatus === "Cancelled" || auditItemStatus === "Cancelled") {
    return <>--</>;
  }
  if (auditStatus === "Generated" && auditItemStatus === "Generated") {
    return <AuditItemCancel auditItemId={auditItemId} handleCancelAudit={handleCancelAudit} />;
  }
  if (auditStatus === "Confirmed" && auditItemStatus === "Generated") {
    return (
      <Space>
        <AuditItemAssignReassign
          auditItemId={auditItemId}
          handleAssignReassignAuditItem={handleAssignReassignAuditItem}
          text={"Assign"}
        />
        <AuditItemCancel auditItemId={auditItemId} handleCancelAudit={handleCancelAudit} />
      </Space>
    );
  }
  if (auditItemStatus === "Assigned" || auditItemStatus === "In Progress") {
    return (
      <Space>
        <AuditItemAssignReassign
          auditItemId={auditItemId}
          handleAssignReassignAuditItem={handleAssignReassignAuditItem}
          text={"Re Assign"}
        />
        <AuditItemCancel auditItemId={auditItemId} handleCancelAudit={handleCancelAudit} />
      </Space>
    );
  }
  if (auditItemStatus === "Pending Approval" && isAuditAutoSettle === false) {
    return (
      <Space>
        <AuditItemAssignReassign
          auditItemId={auditItemId}
          handleAssignReassignAuditItem={handleAssignReassignAuditItem}
          text={"Re Assign"}
        />
        <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
          Settle
        </Button>
        {/* <AuditItemCancel auditItemId={auditItemId} handleCancelAudit={handleCancelAudit} /> */}
        {isAuditSettleModalVisible && (
          <SettleAuditModal
            id={auditItemId}
            visible={isAuditSettleModalVisible}
            handleOk={handleAuditSettle}
            handleCancel={() => setIsAuditSettleModalVisible(false)}
            loading={settleLoading}
            auditReasonType={null as AuditReasonsType | null}
          />
        )}
      </Space>
    );
  }
  if (auditItemStatus === "Pending Approval" && isAuditAutoSettle === true) {
    // const auditReasonType =
    //   finalVariance && finalVariance > 0
    //     ? "excess"
    //     : finalVariance && finalVariance < 0
    //     ? "loss"
    //     : null;
    const auditReasonType = null;
    return (
      <Space>
        {/* {auditReasonType === "excess" && (
          <Button type="link" onClick={() => setIsAuditSettleModalVisible(true)}>
            Mark Excess
          </Button>
        )}
        {auditReasonType === "loss" && (
          <Button type="link" onClick={() => setIsAuditSettleModalVisible(true)}>
            Mark Loss
          </Button>
        )}
        {auditReasonType === null && (
          <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
            Settle
          </Button>
        )} */}
        <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
          Settle
        </Button>
        {/* <AuditItemCancel auditItemId={auditItemId} handleCancelAudit={handleCancelAudit} /> */}
        {isAuditSettleModalVisible && (
          <SettleAuditModal
            id={auditItemId}
            visible={isAuditSettleModalVisible}
            handleOk={handleAuditSettle}
            handleCancel={() => setIsAuditSettleModalVisible(false)}
            loading={settleLoading}
            auditReasonType={auditReasonType as AuditReasonsType | null}
          />
        )}
      </Space>
    );
  }
  if (auditItemStatus === "Pending Action" && isAuditAutoSettle === false) {
    const auditReasonType = null;
    return (
      <>
        <Space size={"small"} wrap>
          <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
            Settle
          </Button>
        </Space>
        {isAuditSettleModalVisible && (
          <SettleAuditModal
            id={auditItemId}
            visible={isAuditSettleModalVisible}
            handleOk={handleAuditSettle}
            handleCancel={() => setIsAuditSettleModalVisible(false)}
            loading={settleLoading}
            auditReasonType={auditReasonType as AuditReasonsType | null}
          />
        )}
      </>
    );
  }
  if (auditItemStatus === "Pending Action" && isAuditAutoSettle === true) {
    // const auditReasonType =
    //   finalVariance && finalVariance > 0
    //     ? "excess"
    //     : finalVariance && finalVariance < 0
    //     ? "loss"
    //     : null;
    const auditReasonType = null;
    return (
      <>
        <Space size={"small"} wrap>
          {/* {auditReasonType === "excess" && (
            <Button type="link" onClick={() => setIsAuditSettleModalVisible(true)}>
              Mark Excess
            </Button>
          )}
          {auditReasonType === "loss" && (
            <Button type="link" onClick={() => setIsAuditSettleModalVisible(true)}>
              Mark Loss
            </Button>
          )}
          {auditReasonType === null && (
            <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
              Settle
            </Button>
          )} */}
          <Button type="link" onClick={() => settleAuditItems({ audit_item_id: auditItemId })}>
            Settle
          </Button>
        </Space>
        {isAuditSettleModalVisible && (
          <SettleAuditModal
            id={auditItemId}
            visible={isAuditSettleModalVisible}
            handleOk={handleAuditSettle}
            handleCancel={() => setIsAuditSettleModalVisible(false)}
            loading={settleLoading}
            auditReasonType={auditReasonType as AuditReasonsType | null}
          />
        )}
      </>
    );
  }
  return <>---</>;
};

export default AuditViewActionColumn;

const AuditItemCancel = ({
  auditItemId,
  handleCancelAudit
}: {
  auditItemId: number;
  handleCancelAudit: (arg: number) => void;
}) => {
  return (
    <Button type="link" danger size="small" onClick={() => handleCancelAudit(auditItemId)}>
      Cancel
    </Button>
  );
};

const AuditItemAssignReassign = ({
  auditItemId,
  handleAssignReassignAuditItem,
  text
}: {
  auditItemId: number;
  handleAssignReassignAuditItem: (arg: number) => void;
  text: string;
}) => {
  return (
    <Button type="link" size="small" onClick={() => handleAssignReassignAuditItem(auditItemId)}>
      {text}
    </Button>
  );
};
