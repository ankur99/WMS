import { useState, useRef } from "react";
import { IATAssignPicklistApiDataProps } from "../types/iatPicklistAssignTypes";

import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";
import {
  ERROR_FALLBACK_TEXT,
  IATStatus,
  reAssignText,
  timeForToastError
} from "../utils/constants";
import { AxiosError } from "axios";
import { message } from "antd";
import {
  useAssignIATPicklist,
  useIATAssignPicklistData,
  useReAssignIATPicklist
} from "./useRQIATAssignPicklist";
import confirmModal from "../Components/modals/ConfirmModal";
import { showErrorToast, showSuccessToast } from "../utils/helperFunctions";

interface SelectData {
  picklistId: number;
  status: IATStatus;
}

const useIATAssignPicklist = () => {
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setTest] = useState("");

  const searchInputRef = useRef<HTMLInputElement>();

  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    picklistId: null,
    assignedAt: null,
    resolvedAt: null,
    userName: null,
    status: null
  });

  const [modalVisible, setModalVisible] = useState(false);
  const selectedPicklistRef = useRef<undefined | SelectData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (
    selectedKeys: React.Key[],
    selectData: IATAssignPicklistApiDataProps[]
  ) => {
    const keys: SelectData[] = selectData.map((item) => {
      return { picklistId: item.picklistId, status: item.status };
    });
    selectedPicklistRef.current = [...keys];
    setSelectedRowKeys(selectedKeys);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);
  };

  const handleAssign = (userId: number, picklistId: [number]) => {
    const payload = {
      assign_to: userId,
      picklists: picklistId
    };

    assignIATPicklist(payload);
  };

  const handleBulkAssigOrReassign = (userId: number) => {
    const picklists = selectedPicklistRef?.current?.map((item) => item.picklistId);
    const payload = {
      assign_to: userId,
      picklists: picklists || []
    };

    // Null status means Not Picked
    if (
      selectedPicklistRef?.current &&
      selectedPicklistRef?.current?.length > 0 &&
      selectedPicklistRef?.current?.[0].status === null
    ) {
      assignIATPicklist(payload);
    } else {
      reAssignIATPicklist(payload);
    }

    setModalVisible(false);
    //empty checkboxes of bulk assign picklists
    setSelectedRowKeys([]);
    selectedPicklistRef.current = [];
  };

  const handleReAssign = (userId: number, picklistId: [number]) => {
    const payload = {
      assign_to: userId,
      picklists: picklistId
    };

    reAssignIATPicklist(payload);
  };

  const checkBulkAssign = () => {
    let countNotStarted = 0;
    let countYetToStartAndInProgess = 0;

    const data = selectedPicklistRef?.current;

    // checking for if mixed statuses has been selected
    if (data?.length && data?.length > 0) {
      for (let i = 0; i < data?.length; i++) {
        console.log("sfg");

        if (data[i].status === null) countNotStarted++;
        else countYetToStartAndInProgess++;
      }
    }

    if (countNotStarted > 0 && countYetToStartAndInProgess > 0) {
      //means invalid
      showErrorToast(
        "Please select picklist of either Not Picked Status or Not started, In Progress and ReAssigned Status"
      );
      return;
    }

    // showing confirm modal for inprogress and reassigned ones
    if (countYetToStartAndInProgess > 0) {
      confirmModal({
        title: "Alert",
        content: reAssignText,
        onOk: () => setModalVisible(true)
      });
      return;
    }

    // if condition satisfies, then show bulk assign modal
    setModalVisible(true);
    return;
  };

  const onError = (error: AxiosError) => {
    const msg = error?.response?.data?.message || ERROR_FALLBACK_TEXT;
    message.error(msg, timeForToastError);
  };

  const {
    isLoading,
    isFetching,
    data: iatAssignedPicklistData
  } = useIATAssignPicklistData({
    currentPage,
    picklistId: filtersValue.picklistId && (filtersValue.picklistId[0] as string | null),
    assignedAt: filtersValue.assignedAt && (filtersValue.assignedAt[0] as string | null),
    resolvedAt: filtersValue.resolvedAt && (filtersValue.resolvedAt[0] as string | null),
    userName: filtersValue.userName && (filtersValue.userName[0] as string | null),
    status: filtersValue.status && (filtersValue.status[0] as string | null),
    onError
  });

  const { isLoading: mutationLoading, mutate: assignIATPicklist } = useAssignIATPicklist({
    onError,
    onSuccess: showSuccessToast
  });

  const { isLoading: mutationReassignLoading, mutate: reAssignIATPicklist } =
    useReAssignIATPicklist({
      onError,
      onSuccess: showSuccessToast
    });

  return {
    setSearchText,
    setSearchedColumn,
    currentPage,
    setTest,
    searchInputRef,
    filtersValue,
    modalVisible,
    setModalVisible,
    selectedRowKeys,
    onSelectChange,
    handleTableChange,
    handleAssign,
    handleBulkAssigOrReassign,
    handleReAssign,
    checkBulkAssign,
    isLoading,
    isFetching,
    iatAssignedPicklistData,
    mutationLoading,
    mutationReassignLoading
  };
};

export default useIATAssignPicklist;
