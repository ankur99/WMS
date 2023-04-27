import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { formatDate, TaskStatus, trimNumbersToAFixedFigit, secondsToHms } from "../utils/constants";

import {
  UsePutawayReportProps,
  PutawayReportApiReceiveDataProps,
  PutawayReportApiDataProps
} from "../types/putawayReportTypes";
import { VariantsProp } from "../types/commonTypes";
import { downloadCSVWithInstance } from "../utils/helperFunctions";
import { phpInstance } from "../api/Api";

const fetchPutawayReport = (
  currentPage: number,
  id: string | null,
  name: string | null,
  status: string | null,
  employee_name: string | null,
  grn_created_at: string | null,
  created_at: string | null,
  completed_at: string | null,
  rangePickerDate: [string, string],
  barcode: string | null,
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
  if (employee_name) {
    params += `&assigned_to=${employee_name}`;
  }
  if (grn_created_at) {
    params += `&grn_created_at=${grn_created_at}`;
  }
  if (created_at) {
    params += `&created_at=${created_at}`;
  }
  if (completed_at) {
    params += `&completed_at=${completed_at}`;
  }
  if (rangePickerDate && rangePickerDate[0] && rangePickerDate[1]) {
    params += `&created_at=${rangePickerDate[0]}`;
    params += `&to_date=${rangePickerDate[1]}`;
  }

  if (barcode) {
    params += `&barcode=${barcode}`;
  }

  return phpInstance.get(`/admin/v1/putaway/report?${params}`, {
    signal
  });
};

// NOTE: signal is used for aborting the past apis

export const usePutawayReportData = ({
  currentPage,
  onError,
  id,
  name,
  status,
  employee_name,
  grn_created_at,
  created_at,
  completed_at,
  rangePickerDate,
  barcode
}: UsePutawayReportProps) => {
  return useQuery(
    [
      "fetch-putaway-report",
      currentPage,
      id,
      name,
      status,
      employee_name,
      grn_created_at,
      created_at,
      completed_at,
      rangePickerDate?.[0],
      rangePickerDate?.[1],
      barcode
    ],
    ({ signal }) =>
      fetchPutawayReport(
        currentPage,
        id,
        name,
        status,
        employee_name,
        grn_created_at,
        created_at,
        completed_at,
        rangePickerDate,
        barcode,
        signal
      ),
    {
      onError,
      refetchOnWindowFocus: false,

      //formatting and sanitizing data
      select: (data) => {
        const list: PutawayReportApiDataProps[] = [];

        const paginatedData = {
          currentPage: data.data.meta.current_page,
          totalPage: data.data.meta.total
        };

        const nonSanitisedData: PutawayReportApiReceiveDataProps[] = data.data.data;

        for (let i = 0; i < nonSanitisedData.length; i++) {
          const variants: VariantsProp[] = nonSanitisedData[i].variants;

          //getting quantity in varoius uom
          let quantityUnit = 0;
          let quantityOuter = 0;
          let quantityCase = 0;

          for (let j = 0; j < variants.length; j++) {
            if (variants[j].type === "unit") {
              quantityUnit = trimNumbersToAFixedFigit(
                nonSanitisedData[i].quantity / parseInt(variants[j].quantity),
                3
              );
            } else if (variants[j].type === "outer") {
              quantityOuter = trimNumbersToAFixedFigit(
                nonSanitisedData[i].quantity / parseInt(variants[j].quantity),
                3
              );
            } else if (variants[j].type === "case") {
              quantityCase = trimNumbersToAFixedFigit(
                nonSanitisedData[i].quantity / parseInt(variants[j].quantity),
                3
              );
            }
          }

          list.push({
            key: `${nonSanitisedData[i].id}${nonSanitisedData[i].employee_name}${i}`,
            id: nonSanitisedData[i].id,
            name: nonSanitisedData[i].name,
            quantityUnit,
            quantityOuter,
            quantityCase,
            status: nonSanitisedData[i].status,
            created_at: formatDate(nonSanitisedData[i].created_at),
            completed_at:
              nonSanitisedData[i].status === TaskStatus.completed
                ? formatDate(nonSanitisedData[i].completed_at)
                : null,
            variants: nonSanitisedData[i].variants,
            employee_name: nonSanitisedData[i].employee_name,
            migration_id: nonSanitisedData[i].migration_id,
            time_taken: nonSanitisedData[i].time_taken
              ? secondsToHms(nonSanitisedData[i].time_taken * 60) //since time_taken is in minutes
              : "--",
            grn_created_at: nonSanitisedData[i].grn_created_at
              ? formatDate(nonSanitisedData[i].grn_created_at)
              : "--",
            inventory_migration_id: nonSanitisedData[i].inventory_migration_id,
            barcode: nonSanitisedData[i].barcode,
            inward_type: nonSanitisedData[i].inward_type
          });
        }
        const putawayAssignmentData = {
          paginatedData,
          list
        };
        return putawayAssignmentData;
      }
    }
  );
};

const fetchPutawayReportSummary = (
  rangePickerDate: [string, string],
  signal: AbortSignal | undefined
) => {
  if (rangePickerDate && rangePickerDate[0] && rangePickerDate[1]) {
    return phpInstance.get(
      `/admin/v1/putaway/summary?created_at=${rangePickerDate[0]}&to_date=${rangePickerDate[1]}`,
      { signal }
    );
  }
  return phpInstance.get(`/admin/v1/putaway/summary`, { signal });
};

export const usePutawayReportSummaryData = ({
  onError,
  rangePickerDate
}: {
  onError: (error: AxiosError) => void;
  rangePickerDate: [string, string];
}) => {
  return useQuery(
    ["fetch-putaway-summary", rangePickerDate?.[0], rangePickerDate?.[1]],
    ({ signal }) => fetchPutawayReportSummary(rangePickerDate, signal),
    {
      onError,
      refetchOnWindowFocus: false,
      //formatting and sanitizing data
      select: (data) => {
        const nonSanitisedData = data.data;
        const average_time = nonSanitisedData.average_time
          ? secondsToHms(nonSanitisedData.average_time * 60)
          : "--";

        const avg_items_per_employee = nonSanitisedData.avg_items_per_employee
          ? trimNumbersToAFixedFigit(nonSanitisedData.avg_items_per_employee, 2)
          : "--";

        return {
          average_time,
          avg_items_per_employee,
          total_items: nonSanitisedData.total_items
        };
      }
    }
  );
};

export const downloadPutawayReport = async ({
  id,
  name,
  status,
  employee_name,
  grn_created_at,
  created_at,
  completed_at,
  rangePickerDate,
  barcode
}: {
  id: string | null;
  name: string | null;
  status: string | null;
  employee_name: string | null;
  grn_created_at: string | null;
  created_at: string | null;
  completed_at: string | null;
  rangePickerDate: [string, string];
  barcode: string | null;
}) => {
  let params = ``;
  if (id) {
    params += `&id=${id}`;
  }
  if (name) {
    params += `&name=${name}`;
  }
  if (status) {
    params += `&status=${status}`;
  }
  if (employee_name) {
    params += `&assigned_to=${employee_name}`;
  }
  if (grn_created_at) {
    params += `&grn_created_at=${grn_created_at}`;
  }
  if (created_at) {
    params += `&created_at=${created_at}`;
  }
  if (completed_at) {
    params += `&completed_at=${completed_at}`;
  }
  if (rangePickerDate && rangePickerDate[0] && rangePickerDate[1]) {
    params += `&created_at=${rangePickerDate[0]}`;
    params += `&to_date=${rangePickerDate[1]}`;
  }

  if (barcode) {
    params += `&barcode=${barcode}`;
  }

  await downloadCSVWithInstance({
    uri: `/admin/v1/putaway/report/download?${params}`,
    fileName: "PutawayReport.csv",
    instanceType: "php"
  });
};
