import { AxiosError } from "axios";

export interface DownloadApiProps {
  currentPage: number;
  id: number;
  user_id: number | null;
  report_type: string;
  status: string | null;
  created_at: string | null;
  report_name: string;
  updated_at: string | null;
  url: string;
}
export interface PaginatedProps {
  totalPage: number;
  currentPage: number;
}
export interface DownloadDataProps {
  status: string | null;
}
