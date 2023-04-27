import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { nodeInstance } from "../api/Api";
import {
  InventoryMigrationReassignProps,
  UseInventoryMigrationItemsProps,
  UseInventoryMigrationProps
} from "../types/inventoryMigrationTypes";
import { createFiltersFromFilterValue } from "../utils/helperFunctions";

export const getInventoryMigrationsFilters = (filtersValue: Record<string, FilterValue | null>) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id", "migration_type"],
    substitueKeys: [
      {
        actualKey: "employee",
        changeToKey: "employee.name"
      }
    ]
  });
  return filters;
};

// Returns
const fetchInventoryMigrations = (
  currentPage: number,
  pageSize: number,
  filtersValue: Record<string, FilterValue | null>
) => {
  const params = `page=${currentPage}&limit=${pageSize}`;
  const filters = getInventoryMigrationsFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(`/api/v1/inventory/inventory-migrations?${params}&filters=${filters}`);
  }
  return nodeInstance.get(`/api/v1/inventory/inventory-migrations?${params}`);
};

export const useInventoryMigrationsData = ({
  currentPage,
  pageSize,
  onError,
  filtersValue
}: UseInventoryMigrationProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-inventory-migrations", currentPage, pageSize]
      : ["fetch-inventory-migrations", currentPage, pageSize, ...Object.values(filtersValue)],
    () => fetchInventoryMigrations(currentPage, pageSize, filtersValue),
    {
      onError,
      refetchOnWindowFocus: false,
      //formatting and sanitizing data
      select: (data) => {
        return data?.data;
      }
    }
  );
};

// Inventory Migration Items
export const getInventoryMigrationItemsFilters = (
  filtersValue: Record<string, FilterValue | null>
) => {
  const filters = createFiltersFromFilterValue({
    filtersValue,
    equalKeys: ["id"],
    substitueKeys: [
      {
        actualKey: "employee",
        changeToKey: "employee.name"
      },
      {
        actualKey: "from_storage_name",
        changeToKey: "from_storage.label"
      },
      {
        actualKey: "to_storage_name",
        changeToKey: "to_storage.label"
      }
    ]
  });
  return filters;
};

const fetchInventoryMigrationItems = ({
  currentPage,
  pageSize,
  inventoryMigrationId,
  filtersValue
}: {
  currentPage: number;
  pageSize: number;
  inventoryMigrationId: number | string | undefined;
  filtersValue: Record<string, FilterValue | null>;
}) => {
  const params = `page=${currentPage}&limit=${pageSize}&inventory_migration_id=${inventoryMigrationId}`;
  const filters = getInventoryMigrationItemsFilters(filtersValue);
  if (filters) {
    return nodeInstance.get(
      `/api/v1/inventory/inventory-migration-items?${params}&filters=${filters}`
    );
  }
  return nodeInstance.get(`/api/v1/inventory/inventory-migration-items?${params}`);
};

export const UseInventoryMigrationItems = ({
  currentPage,
  pageSize,
  inventoryMigrationId,
  filtersValue,
  onError
}: UseInventoryMigrationItemsProps) => {
  return useQuery(
    Object.keys(filtersValue)?.length === 0
      ? ["fetch-inventory-migration-items", currentPage, pageSize, inventoryMigrationId]
      : [
          "fetch-inventory-migration-items",
          currentPage,
          pageSize,
          inventoryMigrationId,
          ...Object.values(filtersValue)
        ],
    () =>
      fetchInventoryMigrationItems({ currentPage, pageSize, inventoryMigrationId, filtersValue }),
    {
      onError,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data.data;
      }
    }
  );
};

// Reassign
const reAssignInventoryMigration = ({
  // inventoryMigrationId,
  payload
}: {
  inventoryMigrationId: number;
  payload: InventoryMigrationReassignProps;
}) => {
  return nodeInstance.post(`/api/v1/inventory/inventory-migration-items/reassign`, payload);
};

export const useReAssignInventoryMigration = ({
  onError,
  onSuccess,
  type
}: {
  onError: (error: AxiosError) => void;
  onSuccess: (type: "SINGLE" | "BULK", msg: string) => void;
  type: "SINGLE" | "BULK";
}) => {
  const queryClient = useQueryClient();

  return useMutation(reAssignInventoryMigration, {
    onSuccess: () => {
      if (type === "SINGLE") {
        onSuccess(type, "Reassigned successfully");
      }

      if (type === "BULK") {
        onSuccess(type, "Bulk Reassigned successfully");
      }

      queryClient.invalidateQueries("fetch-inventory-migration-items"); //erase past data so that new api call will be made automatically
    },
    onError
  });
};
