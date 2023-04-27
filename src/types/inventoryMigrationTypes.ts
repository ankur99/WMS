import { FilterValue } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import {
  InventoryMigrationItemsStatus,
  InventoryMigrationStatus,
  InventoryMigrationType
} from "../utils/constants";
import { IdName } from "./commonTypes";
export interface InventoryMigrationsReceived {
  results: InventoryMigrationsData[];
  count: number;
  count_per_page: number;
}

export interface InventoryMigrationsData {
  id: number;
  employee: IdName;
  migration_type: InventoryMigrationType;
  status: InventoryMigrationStatus;
}

export interface UseInventoryMigrationProps {
  currentPage: number;
  pageSize: number;
  onError: (error: AxiosError) => void;
  filtersValue: Record<string, FilterValue | null>;
}

export interface UseInventoryMigrationItemsProps extends UseInventoryMigrationProps {
  inventoryMigrationId: string | undefined;
}

export interface InventoryMigrationReassignProps {
  employeeId: number;
  inventoryMigrationItemIds: number[];
}

export interface InventoryMigrationItemsReceived {
  results: InventoryMigrationItemsData[];
  count: number;
  count_per_page: number;
}

export interface InventoryMigrationItemsData {
  id: number;
  inventory_migration_id: number;
  product: IdName;
  sku: string;
  from_storage: IdName;
  to_storage: IdName;
  quantity: number;
  picked_quantity: number;
  completed_at: null | string;
  employee: IdName;
  status: InventoryMigrationItemsStatus;
}
