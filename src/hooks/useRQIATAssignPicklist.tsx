import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { formatDate } from "../utils/constants";
import {
  AssignIATProps,
  IATAssignPicklistApiDataProps,
  IATAssignPicklistApiReceiveDataProps,
  UseIATAssignPicklistProps
} from "../types/iatPicklistAssignTypes";
import { phpInstance } from "../api/Api";

const fetchIATAssignPicklist = (
  currentPage: number,
  picklistId: string | null,
  assignedAt: string | null,
  resolvedAt: string | null,
  userName: string | null,
  status: string | null
) => {
  let params = `page=${currentPage}`;
  if (picklistId) {
    params += `&picklist_id=${picklistId}`;
  }
  if (assignedAt) {
    params += `&assigned_at=${assignedAt}`;
  }
  if (resolvedAt) {
    params += `&completed_at=${resolvedAt}`;
  }
  if (userName) {
    params += `&assigned_to=${userName}`;
  }
  if (status) {
    params += `&irt_status=${status}`;
  }

  return phpInstance.get(`/admin/v1/iat/picklists?${params}`);
};

export const useIATAssignPicklistData = ({
  currentPage,
  onError,
  picklistId,
  assignedAt,
  resolvedAt,
  userName,
  status
}: UseIATAssignPicklistProps) => {
  return useQuery(
    [
      "fetch-iat-assign-picklist",
      currentPage,
      picklistId,
      assignedAt,
      resolvedAt,
      userName,
      status
    ],
    () => fetchIATAssignPicklist(currentPage, picklistId, assignedAt, resolvedAt, userName, status),
    {
      onError,
      refetchOnWindowFocus: false,

      //formatting and sanitizing data
      select: (data) => {
        const list: IATAssignPicklistApiDataProps[] = [];

        const paginatedData = {
          currentPage: data?.data?.meta?.current_page,
          totalPage: data?.data?.meta?.total
        };

        const nonSanitisedData: IATAssignPicklistApiReceiveDataProps[] = data?.data?.data;

        for (let i = 0; i < nonSanitisedData.length; i++) {
          const requiredData = nonSanitisedData[i];

          list.push({
            key: `${requiredData.id}${
              requiredData.irt_assigned_at ? requiredData.irt_assigned_at : ""
            }${i}`,
            picklistId: requiredData.id,
            userId: requiredData.irt_user_id,
            userName: requiredData.employee_name,
            itemsCount: requiredData.item_count ? requiredData.item_count : "--",
            productsCount: requiredData.product_count ? requiredData.product_count : "--",
            status: requiredData.status,
            assignedAt: requiredData.irt_assigned_at
              ? formatDate(requiredData.irt_assigned_at)
              : "--",
            resolvedAt: requiredData.irt_completed_at
              ? formatDate(requiredData.irt_completed_at)
              : "--",
            userAssigned: requiredData.employee_id
              ? {
                  key: requiredData.employee_id + "",
                  label: requiredData.employee_name
                }
              : null
          });
        }
        const sanitizedData = {
          paginatedData,
          list
        };
        return sanitizedData;
      }
    }
  );
};

const assignIATPicklist = (payload: AssignIATProps) => {
  return phpInstance.post("/admin/v1/iat/assign-picklists", payload);
};

export const useAssignIATPicklist = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(assignIATPicklist, {
    onSuccess: () => {
      onSuccess("The task has been successfully assigned");
      queryClient.invalidateQueries("fetch-iat-assign-picklist"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

const reAssignIATPicklist = (payload: AssignIATProps) => {
  return phpInstance.post("/admin/v1/iat/reassign/picklist", payload);
};

export const useReAssignIATPicklist = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(reAssignIATPicklist, {
    onSuccess: () => {
      onSuccess("The task has been successfully assigned");
      queryClient.invalidateQueries("fetch-iat-assign-picklist"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};
