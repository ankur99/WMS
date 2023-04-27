import { useState, useRef, useEffect } from "react";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";
import { DEFAULT_PAGE_SIZE } from "../utils/constants";

import { useQueryStateTable } from "./useQueryStateTable";
import qs from "qs";

type InitialTableValues = {
  initialFiltersValue?: Record<string, any[]>;
  initialPageSize?: number;
};

const useTable = ({ initialFiltersValue, initialPageSize }: InitialTableValues = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize || DEFAULT_PAGE_SIZE);
  const [searchText, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");

  const searchInputRef = useRef<HTMLInputElement | null>();
  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>(
    initialFiltersValue ? { ...initialFiltersValue } : {}
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [csvDownloadLoading, setCsvDownloadLoading] = useState(false);

  useQueryStateTable({
    pageSize,
    currentPage,
    filtersValue: filtersValue ? JSON.stringify(filtersValue) : null
  });

  // Appending the state from url for reload, so that the state keeps intact
  useEffect(() => {
    const existingQueries = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

    const currentPageValue = existingQueries?.currentPage ? +existingQueries?.currentPage : null;
    if (currentPageValue) {
      setCurrentPage(currentPageValue);
    }

    const pageSizeValue = existingQueries?.pageSize ? +existingQueries?.pageSize : null;
    if (pageSizeValue) {
      setPageSize(pageSizeValue);
    }

    const filtersValueValue = existingQueries?.filtersValue
      ? JSON.parse(existingQueries?.filtersValue as string)
      : null;

    if (filtersValueValue) {
      setFiltersValue(filtersValueValue);
    }

    // console.log({ filtersValueQuery });
  }, []);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    const newPage = pagination?.current || 1;
    const newPageSize = pagination?.pageSize || 15;

    if (newPageSize !== pageSize) {
      // means page changer is pressed to move to page 1 with new page size
      setCurrentPage(1);
      setPageSize(newPageSize);
    } else {
      setCurrentPage(newPage);
    }
    setFiltersValue(filters);
  };

  const handleCSVLoading = (value: boolean) => {
    setCsvDownloadLoading(value);
  };

  const onSelectRowKeysChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const handleReset = () => {
    setSelectedRowKeys([]);
    setSearchText("");
    setFiltersValue({});
    setSearchedColumn("");
    searchInputRef.current = null;
  };

  return {
    currentPage,
    pageSize,
    searchText,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    setFiltersValue,
    selectedRowKeys,
    onSelectRowKeysChange,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading,
    handleReset
  };
};

export default useTable;
