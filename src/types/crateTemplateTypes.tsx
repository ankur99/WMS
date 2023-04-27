import { AxiosError } from "axios";

export interface CrateTemplateTypes {
  id: number;
  name: string;
  dimensions: string;
  color: string;
  type: string;
  material: string;
  is_temporary: 0 | 1;
  description: string;
  status: 0 | 1;
  created_at: string;
}

export interface CrateTemplateDateTypes {
  data: CrateTemplateDateTypes[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface UseCrateTemplateProps {
  currentPage: number;
  onError: (error: AxiosError) => void;
  name: string | null;
  material: string | null;
  type: string | null;
}
