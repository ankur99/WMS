import { Input, Button, Space, DatePicker, InputNumber, Select } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { FilterTypes } from "../../utils/constants";
import moment from "moment";

const { Option } = Select;

interface ColumnProps {
  dataIndex: string;
  searchInputRef: any;
  setSearchText: (data: string) => void;
  setSearchedColumn: (data: string) => void;
  filterFromFrontend?: boolean;
  filterType?: FilterTypes;
  fetchFunction?: (data: string) => void;
  selectData?: {
    id: string;
    name: string;
  }[];
}

const handleSearch = (
  selectedKeys: string[],
  confirm: () => void,
  dataIndex: string,
  setSearchText: (data: string) => void,
  setSearchedColumn: (data: string) => void
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const handleReset = (
  clearFilters: () => void,
  setSearchText: (data: string) => void,
  confirm: () => void
) => {
  clearFilters();
  setSearchText("");
  confirm();
};

const getColumnSearchPropsForTable = ({
  dataIndex,
  searchInputRef,
  setSearchText,
  setSearchedColumn,
  filterFromFrontend = false,
  filterType = FilterTypes.input,
  selectData
}: ColumnProps) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }: {
    setSelectedKeys: (data: string[]) => void;
    selectedKeys: string[];
    confirm: (data?: Record<string, unknown>) => void;
    clearFilters: () => void;
  }) => (
    <div style={{ padding: 8 }}>
      {filterType === FilterTypes.date && (
        <>
          <DatePicker
            format={"DD-MM-YYYY"}
            value={selectedKeys[0] ? moment(selectedKeys[0], "DD-MM-YYYY") : null}
            ref={(node) => {
              // this.searchInput = node;
              searchInputRef.current = node;
            }}
            placeholder={`Search ${dataIndex}`}
            // value={selectedKeys[0]}
            onChange={(_, dateString) => {
              setSelectedKeys(dateString ? [dateString] : []);
              handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn);
            }}
            onOk={() =>
              handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
        </>
      )}
      {filterType === FilterTypes.input && (
        <>
          <Input
            ref={(node) => {
              // this.searchInput = node;
              searchInputRef.current = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() =>
              handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters, setSearchText, confirm)}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </>
      )}
      {filterType === FilterTypes.inputNumber && (
        <>
          <InputNumber
            ref={(node) => {
              // this.searchInput = node;
              searchInputRef.current = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onPressEnter={() =>
              handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
            }
            style={{ marginBottom: 8, display: "block", width: "100%" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters, setSearchText, confirm)}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
            {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}>
            Filter
          </Button> */}
          </Space>
        </>
      )}
      {filterType === FilterTypes.select && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Select
            showSearch
            placeholder={`Select ${dataIndex}`}
            ref={(node) => {
              // this.searchInput = node;
              searchInputRef.current = node;
            }}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            style={{ marginBottom: 8, display: "block" }}>
            {selectData?.map((el: { id: string; name: string }) => (
              <Option key={el.id} value={el.name}>
                {el.name}
              </Option>
            ))}
          </Select>
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}>
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters, setSearchText, confirm)}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      )}
    </div>
  ),

  filterIcon: (filtered: boolean) => {
    if (filterType === FilterTypes.date) {
      return (
        <FilterOutlined style={{ color: filtered ? "#1890ff" : undefined, minWidth: "1rem" }} />
      );
    }
    return <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined, minWidth: "1rem" }} />;
  },
  onFilter: (value: string, record: Record<string, any>) => {
    if (filterFromFrontend) {
      return record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "";
    }
    //since we want filteration from backend
    return record[dataIndex];
  },
  onFilterDropdownVisibleChange: (visible: unknown) => {
    if (visible) {
      setTimeout(() => {
        if (searchInputRef && searchInputRef.current && searchInputRef.current.select) {
          searchInputRef.current.select();
        }
      }, 100);
    }
  }
  // render: (text: any) => {
  //   console.log({ text });
  //   return text;
  // }
});

export default getColumnSearchPropsForTable;
