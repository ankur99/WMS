import { ReactChildren, ReactChild } from "react";

export interface AuxProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[];
}

export interface VariantsProp {
  quantity: string;
  type: string;
}

export interface IdName {
  id: number;
  name: string;
}

export interface KeyValueLabel {
  label: string;
  value?: string | number;
  key: string;
}

export interface NodeBaseApiCall {
  num_page: number;
  count: number;
  count_per_page: number;
}
