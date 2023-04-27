import { AxiosError } from "axios";
import {
  UseComplaintProps,
  UseFetchApiProps,
  UseIssueAttachmentsProps,
  UseIssueTypeProps
} from "../types/ComplaintTypes";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { phpInstance } from "../api/Api";

interface Payload {
  status: string;
  resolution?: string | null;
  assignDate?: string | null;
  assignTo?: string | null;
}
interface StatusProps {
  payload?: Payload;
  id: number;
}

const fetchComplaintList = ({ currentPage, id, createdBy, type, status }: UseFetchApiProps) => {
  let params = `${currentPage}`;
  if (id) {
    params += `&id=${id}`;
  }
  if (createdBy) {
    params += `&createdBy=${createdBy}`;
  }
  if (type) {
    params += `&issue_name=${type}`;
  }
  if (status) {
    params += `&status=${status}`;
  }
  return phpInstance.get(`/app/v1/all/issues?page=${params}`);
};

export const useComplaintsData = ({
  currentPage,
  onError,
  id,
  createdBy,
  type,
  status
}: UseComplaintProps) => {
  return useQuery(
    ["fetch-complaints", currentPage, id, createdBy, type, status],
    () => fetchComplaintList({ currentPage, id, createdBy, type, status }),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};
// API call for issues

const fetchIssueTypes = () => {
  return phpInstance.get(`/app/v1/help`);
};

export const useIssueTypesData = ({ onError }: UseIssueTypeProps) => {
  return useQuery("fetch-issue-types", () => fetchIssueTypes(), {
    onError,
    refetchOnWindowFocus: false,
    select: (data) => {
      return data;
    }
  });
};

const statusComplaintUpdate = ({ id, payload }: StatusProps) => {
  return phpInstance.post(`/app/v1/help/issue/${id}/update-status`, payload);
};

export const useStatusComplaintUpdate = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(statusComplaintUpdate, {
    onSuccess: () => {
      onSuccess("Status successfully updated");
      queryClient.invalidateQueries("fetch-complaints");
    },
    onError
  });
};

// Get attachments for complaint
const fetchAttachments = (id: number) => {
  return phpInstance.get(`/app/v1/help/${id}/attachments`);
};

export const useIssueAttachmentsData = ({ id, onError }: UseIssueAttachmentsProps) => {
  return useQuery(["fetch-attachments", id], () => fetchAttachments(id), {
    onError,
    enabled: id ? true : false,
    refetchOnWindowFocus: false,
    // cache time and stale time is kept as 10mins as url si temporaru url and will expire after 15mins
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    select: (data) => {
      return data?.data?.data;
    }
  });
};
