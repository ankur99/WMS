import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";

import { CrateTemplateDateTypes, UseCrateTemplateProps } from "../types/crateTemplateTypes";
import { phpInstance } from "../api/Api";

const fetchCrateTemplate = (
  currentPage: number,
  name: string | null,
  material: string | null,
  type: string | null
) => {
  let params = `page=${currentPage}`;
  if (name) {
    params += `&name=${name}`;
  }
  if (material) {
    params += `&material=${material}`;
  }
  if (type) {
    params += `&type=${type}`;
  }

  return phpInstance.get(`/admin/v1/crate/templates?${params}`);
};

export const useCrateTemplateData = ({
  currentPage,
  onError,
  name,
  material,
  type
}: UseCrateTemplateProps) => {
  return useQuery(
    ["fetch-crate-template", currentPage, name, material, type],
    () => fetchCrateTemplate(currentPage, name, material, type),
    {
      onError,
      refetchOnWindowFocus: false,

      //formatting and sanitizing data
      select: (data) => {
        // console.log({ data });
        return data?.data as CrateTemplateDateTypes;
      }
    }
  );
};

//Delete Crate
const deleteCrateTemplate = ({ id }: { id: number }) => {
  return phpInstance.post(`/admin/v1/crate/templates/${id}/delete`);
};

export const useDeleteCrateTemplate = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(deleteCrateTemplate, {
    onSuccess: () => {
      // console.log({ data });
      onSuccess("Crate Deleted Successfully");
      queryClient.invalidateQueries("fetch-crate-template"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Change Crate Status
const changeCrateTemplateStatus = ({
  id,
  status
}: {
  id: number;
  status: "activate" | "deactivate";
}) => {
  return phpInstance.post(`/admin/v1/crate/templates/${id}/${status}`);
};

export const useChangeCrateTemplateStatus = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation(changeCrateTemplateStatus, {
    onSuccess: () => {
      // console.log({ data });
      onSuccess("Status Changed Successfully");
      queryClient.invalidateQueries("fetch-crate-template"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//GET All Materials
const featchAllMaterials = () => {
  return phpInstance.get(`/admin/v1/template/materials`);
};

export const useAllMaterials = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-materials"], () => featchAllMaterials(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    select: (data) => {
      const temp = data?.data?.data;
      const formattedData = temp?.map((item: { material: string }) => {
        return {
          id: item.material,
          name: item.material
        };
      });
      return formattedData;
    }
  });
};

//GET All Item Types
const featchAllItemTypes = () => {
  return phpInstance.get(`/admin/v1/template/item-types`);
};

export const useAllItemTypes = ({ onError }: { onError: (error: AxiosError) => void }) => {
  return useQuery(["fetch-all-item-types"], () => featchAllItemTypes(), {
    onError,
    refetchOnWindowFocus: false,
    cacheTime: 1000 * 60 * 10, //10min cache time
    staleTime: 1000 * 60 * 10, //10min stale time
    select: (data) => {
      const temp = data?.data?.data;
      const formattedData = temp?.map((item: { type: string }) => {
        return {
          id: item.type,
          name: item.type
        };
      });
      return formattedData;
    }
  });
};
