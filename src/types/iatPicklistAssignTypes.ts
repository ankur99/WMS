import { AxiosError } from "axios";
import { IATStatus } from "../utils/constants";

export interface UseIATAssignPicklistProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  picklistId: string | null;
  assignedAt: string | null;
  resolvedAt: string | null;
  userName: string | null;
  status: string | null;
}

export interface UseIATPicklistItemsProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  picklistId: string | null | undefined;
  pid: string | null;
  status: string | null;
  iatResult: string | null;
}

export interface IATAssignPicklistApiDataProps {
  key: string;
  picklistId: number;
  userId: number;
  userName: string;
  itemsCount: number | "--";
  productsCount: number | "--";
  assignedAt: string | null;
  resolvedAt: string;
  status: IATStatus;
  userAssigned: {
    key: string;
    label: string;
  } | null;
}
export interface IATAssignPicklistApiReceiveDataProps {
  id: number;
  employee_name: string;
  irt_assigned_at: string | null;
  irt_completed_at: string | null;
  irt_user_id: number;
  item_count: number;
  product_count: number;
  status: IATStatus;
  employee_id: number;
}

export interface AssignIATProps {
  assign_to: number;
  picklists: number[];
}
