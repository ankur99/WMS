import { useState, useRef, useEffect } from "react";
import { CSV_DOWNLOAD_LIMIT } from "../utils/constants";
import {
  getInventoryMigrationItemsFilters,
  UseInventoryMigrationItems,
  useReAssignInventoryMigration
} from "./useRQInventoryMigration";
import { onError, onErrorNotification, showSuccessToast } from "../utils/helperFunctions";
import useTable from "./useTable";
import { downloadCSVReport } from "./useRQCommon";
import { InventoryMigrationItemsReceived } from "../types/inventoryMigrationTypes";

const useInventoryMigrationItems = (inventoryMigrationId: string | undefined) => {
  const {
    currentPage,
    pageSize,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    selectedRowKeys,
    onSelectRowKeysChange,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading,
    handleReset
  } = useTable();

  const {
    isLoading,
    data: inventoryMigrationItemsData,
    refetch
  }: {
    isLoading: boolean;
    data: InventoryMigrationItemsReceived | undefined;
    refetch: () => void;
  } = UseInventoryMigrationItems({
    currentPage,
    pageSize,
    inventoryMigrationId,
    filtersValue: filtersValue,
    onError: onErrorNotification
  });

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const onSuccess = (type: "SINGLE" | "BULK", msg: string) => {
    if (type === "SINGLE") {
      handleSingleAssignModal(false);
    }

    if (type === "BULK") {
      handleBulkAssignModal(false);
      onSelectRowKeysChange([]);
    }
    showSuccessToast(msg);
  };

  const { isLoading: singleAssignLoading, mutate: reAssignInventoryMigration } =
    useReAssignInventoryMigration({
      onError,
      onSuccess: onSuccess,
      type: "SINGLE"
    });

  const { isLoading: bulkAssignLoading, mutate: bulkReAssignInventoryMigration } =
    useReAssignInventoryMigration({
      onError,
      onSuccess: onSuccess,
      type: "BULK"
    });

  const [singleAssignModalVisible, setSingleAssignModalVisible] = useState(false);
  const [bulkAssignModalVisible, setBulkAssignModalVisible] = useState(false);
  const reAssignDataRef = useRef<number>(-1);

  const handleSingleAssignModal = (visible: boolean) => {
    setSingleAssignModalVisible(visible);
  };
  const handleBulkAssignModal = (visible: boolean) => {
    setBulkAssignModalVisible(visible);
  };

  const handleReAssign = (employeeId: number) => {
    const payload = {
      employeeId,
      inventoryMigrationItemIds: [reAssignDataRef.current]
    };

    if (inventoryMigrationId) {
      reAssignInventoryMigration({ inventoryMigrationId: +inventoryMigrationId, payload });
    }
  };

  const handleBulkReAssign = (employeeId: number) => {
    const payload = {
      employeeId,
      inventoryMigrationItemIds: selectedRowKeys as number[]
    };

    if (inventoryMigrationId) {
      bulkReAssignInventoryMigration({ inventoryMigrationId: +inventoryMigrationId, payload });
    }
  };

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = `api/v1/inventory/inventory-migrations/download-csv?inventory_migration_id=${inventoryMigrationId}&limit=${CSV_DOWNLOAD_LIMIT}&csv_type=inventory_migration_items`;
    const filters = getInventoryMigrationItemsFilters(filtersValue);
    if (filters) {
      uri += `&filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: `Inventory Migration Items (${inventoryMigrationId})`,
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
    singleAssignModalVisible,
    handleSingleAssignModal,
    bulkAssignModalVisible,
    handleBulkAssignModal,
    reAssignDataRef,
    selectedRowKeys,
    onSelectRowKeysChange,
    handleTableChange,
    isLoading,
    inventoryMigrationItemsData,
    handleReAssign,
    handleBulkReAssign,
    handleReset,
    csvDownloadLoading,
    downloadCSV,
    singleAssignLoading,
    bulkAssignLoading
  };
};

export default useInventoryMigrationItems;
