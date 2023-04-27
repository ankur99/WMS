export interface FuncProps {
  changeScreen(arg: string): void;
}

export enum screens {
  START_SCREEN = "START_SCREEN",
  ADD_DETAILS = "ADD_DETAILS",
  GENERATE_ID = "GENERATE_ID"
}

export type FuncNextStep = {
  nextStep: () => void;
};

export type addTaskReason = {
  reasonForMigration: string;
  remarks: string;
};
