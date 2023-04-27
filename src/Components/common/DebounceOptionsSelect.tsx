/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef, useMemo } from "react";
import { Select, Spin } from "antd";
import { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import { AxiosResponse } from "axios";

export interface DebounceSelectOptionGroupProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, "options" | "children"> {
  // fetchOptions: (search: string) => Promise<ValueType[]>;
  fetchOptions: (search: string) => Promise<AxiosResponse<unknown, unknown>>;
  debounceTimeout?: number;
}

function DebounceSelectOptionGroup<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, mode, ...props }: DebounceSelectOptionGroupProps) {
  const [fetching, setFetching] = useState(false);
  // const [options, setOptions] = useState<ValueType[]>([]);
  const [options, setOptions] = useState<any>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      mode={mode ? mode : undefined}
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      allowClear
      options={options}
      // onSelect={(value: any, option: any) => {
      //   return option;
      // }}
      {...props}
    />
  );
}

export default DebounceSelectOptionGroup;
