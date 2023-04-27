import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { BundlingProp, ItemProp, RecipeCreateSendData } from "../types/bundlingTypes";
import { phpInstance } from "../api/Api";

const fetchBundling = (
  currentPage: number,
  id: string | null,
  name: string | null,
  status: string | null,
  pid: string | null,
  productId: string | null,
  signal: AbortSignal | undefined
) => {
  let params = `page=${currentPage}`;
  if (id) {
    params += `&id=${id}`;
  }
  if (name) {
    params += `&name=${name}`;
  }
  if (status) {
    params += `&status=${status}`;
  }
  // For product id of products
  if (pid) {
    params += `&recipeItemProductId=${pid}`;
  }
  // For product id of bundle
  if (productId) {
    params += `&bundleProductId=${productId}`;
  }
  return phpInstance.get(`/admin/v1/bundle-recipes?${params}`, { signal });
};

export const useBundling = ({
  currentPage,
  id,
  name,
  status,
  pid,
  productId,
  onError
}: {
  onError: (error: AxiosError) => void;
  currentPage: number;
  id: string | null;
  name: string | null;
  status: string | null;
  pid: string | null;
  productId: string | null;
}) => {
  return useQuery(
    ["fetch-bundling", currentPage, id, name, status, pid, productId],
    ({ signal }) => fetchBundling(currentPage, id, name, status, pid, productId, signal),
    {
      onError,
      refetchOnWindowFocus: false,
      //formatting and sanitizing data
      select: (data) => {
        const tempResult = data?.data?.data;
        // console.log({ tempResult });
        const formattedData = [];

        for (let i = 0; i < tempResult?.length; i++) {
          const items = tempResult[i].items;
          // console.log({ items });
          let newItems = [];
          let newRecipe: BundlingProp = {
            id: 0,
            name: "",
            status: "",
            items: [],
            instruction_link: [],
            productId: null,
            deleted_at: null
          };
          for (let j = 0; j < items?.length; j++) {
            const newItem: ItemProp = {
              id: items[j]?.product_id,
              product: {
                key: items[j]?.product_id,
                label: items[j]?.product_name
              },
              quantity: items[j]?.quantity
              // discount: items[j]?.discount
            };
            newItems.push(newItem);
          }

          newRecipe.id = tempResult[i]?.id;
          newRecipe.items = newItems;
          newRecipe.name = tempResult[i]?.name;
          newRecipe.status = tempResult[i]?.status;
          newRecipe.instruction_link = tempResult[i]?.instruction_link;
          newRecipe.productId = tempResult[i]?.product_id;
          newRecipe.deleted_at = tempResult[i]?.deleted_at;

          formattedData.push(newRecipe);
          newRecipe = {
            id: 0,
            name: "",
            status: "",
            items: [],
            instruction_link: [],
            productId: null,
            deleted_at: null
          };
          newItems = [];
        }

        // console.log({ formattedData });
        const finalData = {
          ...data.data
        };
        finalData.data = formattedData as any;
        // console.log({ finalData });
        return finalData;
        // return data.data;
      }
    }
  );
};

// Create Recipe
const createRecipe = ({ payload }: RecipeCreateSendData) => {
  return phpInstance.post("/admin/v1/bundle/create", payload);
};

export const useCreateRecipe = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(createRecipe, {
    onSuccess: () => {
      onSuccess("Recipe has been created Successfully");
      queryClient.invalidateQueries("fetch-bundling"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Execute Recipe
interface ExecuteRecipeProps {
  numberOfBundles: number;
  id: number;
}
const executeRecipe = ({ numberOfBundles, id }: ExecuteRecipeProps) => {
  return phpInstance.post(`/admin/v1/bundle/${id}/execute`, { no_of_bundles: numberOfBundles });
};

export const useExecuteRecipe = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  // const queryClient = useQueryClient();

  return useMutation(executeRecipe, {
    onSuccess: () => {
      onSuccess("Recipe has been executed Successfully");
      // Not invaliding execute, as the data is not changing in the main page
      // queryClient.invalidateQueries("fetch-bundling"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Recipe Edit
interface EditRecipeProps {
  payload: RecipeCreateSendData;
  id: number;
}
const editRecipe = ({ id, payload }: EditRecipeProps) => {
  return phpInstance.post(`/admin/v1/bundle/${id}/edit`, payload);
};

export const useEditRecipe = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(editRecipe, {
    onSuccess: () => {
      onSuccess("Recipe has been edited Successfully");
      queryClient.invalidateQueries("fetch-bundling"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Publish Recipe
const publishRecipe = ({
  id,
  group_id,
  brand_id
}: {
  id: number;
  group_id?: string;
  brand_id?: string;
}) => {
  if (group_id) {
    return phpInstance.post(`/admin/v1/bundle/${id}/publish`, { group_id });
  } else if (brand_id) {
    return phpInstance.post(`/admin/v1/bundle/${id}/publish`, { brand_id });
  }
  return phpInstance.post(`/admin/v1/bundle/${id}/publish`);
};

export const usePublishRecipe = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(publishRecipe, {
    onSuccess: () => {
      onSuccess("Recipe has been Published Successfully");
      queryClient.invalidateQueries("fetch-bundling"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};

//Getting all executed Data
const fetchPastExecution = (currentPage: number, id: string | undefined) => {
  const params = `page=${currentPage}`;
  return phpInstance.get(`/admin/v1/bundle/${id}/executed?${params}`);
};

export const useExecution = ({
  currentPage,
  onError,
  id
}: {
  onError: (error: AxiosError) => void;
  currentPage: number;
  id: string | undefined;
}) => {
  return useQuery(["fetch-execution", currentPage, id], () => fetchPastExecution(currentPage, id), {
    onError,
    refetchOnWindowFocus: false,
    enabled: id ? true : false,
    //formatting and sanitizing data
    select: (data) => {
      return data.data;
    }
  });
};

//Process Orders
const fetchProcessOrders = ({
  currentPage,
  id,
  bundle_recipe_name,
  executed_by
}: {
  currentPage: number;
  id: string | null;
  bundle_recipe_name: string | null;
  executed_by: string | null;
}) => {
  let params = `page=${currentPage}`;
  if (id) {
    params += `&id=${id}`;
  }
  if (bundle_recipe_name) {
    params += `&bundle_recipe_name=${bundle_recipe_name}`;
  }
  if (executed_by) {
    params += `&executed_by=${executed_by}`;
  }
  return phpInstance.get(`/admin/v1/bundles/executed?${params}`);
};

export const useProcessOrders = ({
  currentPage,
  id,
  bundle_recipe_name,
  executed_by,
  onError
}: {
  onError: (error: AxiosError) => void;
  currentPage: number;
  id: string | null;
  bundle_recipe_name: string | null;
  executed_by: string | null;
}) => {
  return useQuery(
    ["fetch-process-orders", currentPage, id, bundle_recipe_name, executed_by],
    () => fetchProcessOrders({ currentPage, id, bundle_recipe_name, executed_by }),
    {
      onError,
      refetchOnWindowFocus: false,
      //formatting and sanitizing data
      select: (data) => {
        return data.data;
      }
    }
  );
};

//Delete Recipe
const deleteRecipe = ({ id }: { id: number }) => {
  return phpInstance.post(`/admin/v1/bundle/${id}/delete`);
};

export const useDeleteRecipe = ({
  onError,
  onSuccess
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (msg: string) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation(deleteRecipe, {
    onSuccess: () => {
      onSuccess("Recipe has been Deleted Successfully");
      queryClient.invalidateQueries("fetch-bundling"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};
