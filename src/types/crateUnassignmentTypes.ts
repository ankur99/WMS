export interface BarcodeSearchProps {
  barcode: string;
}

export interface CrateData {
  id: number;
  reference_id: string;
  status: string;
  order_id: string;
}

export type CratesData = Record<string, CrateData>;

export interface LeftCrateDesignProps {
  crateData: CrateData;
  removeCrateData: (refenceId: string) => void;
  currentCrateSelected: string;
  changeCurrentCrateSelected: (referenceId: string) => void;
}
