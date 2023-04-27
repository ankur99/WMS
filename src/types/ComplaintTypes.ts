import { AxiosError } from "axios";

export enum IssueStatus {
  Not_Picked = "Not Picked",
  In_Progress = "In Progress",
  Resolved = "Resolved",
  Rejected = "Rejected"
}

export interface StatusInfo {
  status_from: IssueStatus;
  status_to: IssueStatus;
  updated_at: string;
  updated_by: string;
}

export interface RowComplaintTypes {
  id: number;
  createdBy: string;
  type: string;
  created_at: string;
  status: IssueStatus;
  resolution: string;
  text: string;
  // attachments: string[];
  has_attachment: boolean;
  status_info: StatusInfo[];
  assignee?: string;
  tentative_date?: string;
}

export interface UseComplaintProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  id: string | null;
  createdBy: string | null;
  type: string | null;
  status: IssueStatus | null;
}
export interface UseIssueTypeProps {
  onError: (error: AxiosError) => void;
}

export interface UseIssueAttachmentsProps {
  id: number;
  onError: (error: AxiosError) => void;
}
export interface UseFetchApiProps {
  currentPage: number;
  id: string | null;
  createdBy: string | null;
  type: string | null;
  status: IssueStatus | null;
}

export interface AssignStatusProps {
  status: string;
}
export interface UseAssignStatusProps {
  In_Progress: string;
  generated: string;
  Resolved: string;
  Rejected: string;
}

export interface ItemProps {
  item: string[];
  issue_name: string;
}

export interface GetStatusValueProps {
  getStatusValue: string[];
  status: IssueStatus;
}

export interface AssignDataRefProps {
  prevStatus: IssueStatus;
  changedStatus: IssueStatus;
  id: number;
}
