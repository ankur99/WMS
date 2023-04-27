import { FilterValue } from "antd/lib/table/interface";

export const checkFiltersOnlyUomChangedOrNot = ({
  filtersValue,
  filtersValueRef
}: {
  filtersValue: Record<string, FilterValue | null>;
  filtersValueRef: Record<string, FilterValue | null> | undefined;
}) => {
  if (filtersValue?.barcode !== filtersValueRef?.barcode) {
    return false;
  }

  if (filtersValue?.pid !== filtersValueRef?.pid) {
    return false;
  }

  if (filtersValue?.productName !== filtersValueRef?.productName) {
    return false;
  }

  return true;
};
