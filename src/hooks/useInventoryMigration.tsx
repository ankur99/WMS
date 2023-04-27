import { CSV_DOWNLOAD_LIMIT, InventoryMigrationStatus } from "../utils/constants";
import {
  getInventoryMigrationsFilters,
  useInventoryMigrationsData
} from "./useRQInventoryMigration";
import { onError } from "../utils/helperFunctions";
import useTable from "./useTable";
import { downloadCSVReport } from "./useRQCommon";
import { InventoryMigrationsReceived } from "../types/inventoryMigrationTypes";

const useInventoryMigration = () => {
  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    setFiltersValue,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading,
    handleReset
  } = useTable({
    initialFiltersValue: {
      status: [InventoryMigrationStatus.OPEN]
    }
  });

  const {
    isLoading,
    data: inventoryMigrationData
  }: {
    isLoading: boolean;
    isFetching: boolean;
    data: InventoryMigrationsReceived | undefined;
  } = useInventoryMigrationsData({
    currentPage,
    pageSize,
    filtersValue,
    onError
  });

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/inventory/inventory-migrations/download-csv?limit=${CSV_DOWNLOAD_LIMIT}&csv_type=inventory_migration`;
    const filters = getInventoryMigrationsFilters(filtersValue);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `Inventory Migration`,
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  return {
    setSearchText,
    setSearchedColumn,
    currentPage,
    pageSize,
    searchInputRef,
    filtersValue,
    setFiltersValue,
    handleTableChange,
    isLoading,
    inventoryMigrationData,
    handleReset,
    csvDownloadLoading,
    downloadCSV
  };
};

export default useInventoryMigration;
