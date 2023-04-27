/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef, useMemo } from "react";
import { Select, Spin } from "antd";
import { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import { AxiosResponse } from "axios";

const { Option } = Select;

interface UserValue {
  pincode?: string;
  id: number;
  name: string;
  debounceId: string;
  debounceName: string;
}

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<AxiosResponse<unknown, unknown>>;
  debounceTimeout?: number;
  disabledOptions?: { key?: string }[] | [];
  customOption?: (value: any) => React.ReactNode;
  debounceId?: string;
  debounceName?: string;
  debounceName2?: string;
  clearOptionsAfterSelect?: boolean;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  disabledOptions = [],
  mode,
  debounceId = "id",
  debounceName = "name",
  debounceName2,
  customOption,
  clearOptionsAfterSelect = false,
  ...props
}: DebounceSelectProps) {
  const [fetching, setFetching] = useState(false);
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
      onSelect={clearOptionsAfterSelect ? () => setOptions([]) : undefined}
      {...props}

      // options={options}
    >
      {options?.map((el: UserValue) => (
        <Option
          disabled={disabledOptions.some((item) =>
            item ? parseInt(item.key as string) === el.id : false
          )}
          //@ts-ignore
          key={el[debounceId]}
          //@ts-ignore
          value={el[debounceId]}>
          {customOption
            ? customOption(el)
            : // @ts-ignore
              `${el[debounceName]} ${debounceName2 ? el[debounceName2] : ""}` ||
              el.name ||
              el.pincode}
        </Option>
      ))}
    </Select>
  );
}

export default DebounceSelect;
