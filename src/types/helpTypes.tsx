export enum Screen {
  WELCOME = "WELCOME",
  SECOND = "SECOND"
}

export enum HelpScreens {
  PutawayAssignment = "Putaway Assignment",
  BulkDownload = "Bulk Download"
}

export interface HelpFuncProps {
  handleChangeScreen(): void;
  screenType: HelpScreens;
  pdfUrl: string;
}
