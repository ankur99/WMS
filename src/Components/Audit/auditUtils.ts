import { AuditReasonsAllData, AuditStatusData } from "../../types/auditTypes";

export const getAuditReasons = (auditCreateReasonData: AuditReasonsAllData | undefined) => {
  const auditReasons = auditCreateReasonData?.results?.results?.map((reason) => {
    return {
      value: reason.id,
      text: reason.reason_text
    };
  });

  if (Array.isArray(auditReasons)) {
    return auditReasons;
  }

  return [];
};

export const getAuditReasonsWithIdName = (
  auditCreateReasonData: AuditReasonsAllData | undefined
) => {
  const auditReasons = auditCreateReasonData?.results?.results?.map((reason) => {
    return {
      id: reason.id,
      name: reason.reason_text
    };
  });

  if (Array.isArray(auditReasons)) {
    return auditReasons;
  }

  return [];
};

export const getAuditStatus = (auditStatusData: AuditStatusData | undefined) => {
  const auditStatuses = auditStatusData?.results?.map((status) => {
    return {
      value: status.key,
      text: status.name
    };
  });

  if (Array.isArray(auditStatuses)) {
    return auditStatuses;
  }

  return [];
};
