import { AxiosError } from "axios";

export interface UseCreateCrateProps {
  onError: (error: AxiosError) => void;
  data: any;
}
