import React from "react";
import { Table, DatePicker, Input, Select, Space, Row, Button, Col } from "antd";
import { TableProps } from "antd/lib/table/Table";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { formatArray } from "../../utils/helperFunctions";

interface CustomTableProps {
  defaultProps?: Partial<TableProps<any>>;
  columns: any;
  page?: number;
  total?: number;
  showPagination?: boolean;
  assignedKeys?: any;
  getData?: (params: any) => void;
  onChange?: (pagination: any, filters: any, sorter: any, searchHeaders?: any) => void;
  loading?: boolean;
  rowKey: any;
  dataSource: any;
  rowSelection?: any;
}
interface TableState {
  page: number;
  ordering: any;
  searchHeaders: any;
  pageSize: number;
}

const dateFormat = "YYYY-MM-DD";

class Cardtable extends React.Component<CustomTableProps, TableState> {
  constructor(props: any) {
    super(props);
    this.state = {
      page: 1,
      ordering: null,
      searchHeaders: {},
      pageSize: 20
    };
  }

  componentDidMount() {
    const { getData } = this.props;
    const { pageSize, page } = this.state;
    if (getData) getData({ per_page: pageSize, page });
  }

  handleChange = (pagination: any, filters: any, sorter: any) => {
    const { getData, onChange } = this.props;
    console.log("pagination", pagination);
    let { ordering }: any = this.state;
    const { searchHeaders }: any = this.state;

    if (sorter && sorter.order) {
      ordering = sorter.order === "descend" ? "-" : "";
      ordering += sorter.field;
    } else ordering = null;

    this.setState({ page: pagination.current, pageSize: pagination.pageSize, ordering }, () => {
      let params = {
        page: pagination.current,
        per_page: pagination.pageSize,
        ordering
      };
      params = Object.assign(params, searchHeaders);

      if (getData) getData(params);
    });
    if (onChange) onChange(pagination, filters, sorter, searchHeaders);
  };

  onSearch = (searchHeaders: any) => {
    const { getData } = this.props;
    const params: any = {
      page: 1,
      per_page: this.state.pageSize,
      ordering: this.state.ordering
    };

    for (const key in searchHeaders) {
      params[key] = searchHeaders[key];
    }
    if (getData) getData(params);
  };

  handleSearch = (selectedKeys: any, dataIndex: any, type: string) => {
    this.setState((prevState) => ({
      searchHeaders: {
        ...prevState.searchHeaders,
        [dataIndex]: moment.isMoment(selectedKeys[0])
          ? `${moment(selectedKeys[0]).format("YYYY-MM-DD")}`
          : `${selectedKeys[0]}`
      }
    }));
    setTimeout(() => {
      const { searchHeaders } = this.state;
      this.onSearch(searchHeaders);
    }, 10);
  };

  handleReset = (dataIndex: string, confirm: any, clearFilters: any) => {
    clearFilters();
    this.setState((prevState) => ({
      searchHeaders: {
        ...prevState.searchHeaders,
        [dataIndex]: undefined
      }
    }));
    setTimeout(() => {
      const { searchHeaders } = this.state;
      this.onSearch(searchHeaders);
    }, 10);
    confirm();
  };

  getColumnSearchProps = (dataIndex: string, type: string, options?: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }: {
      setSelectedKeys: any;
      selectedKeys: any;
      confirm: any;
      clearFilters: any;
    }) => (
      <Space style={{ padding: 10 }} direction="vertical" size="middle">
        {[
          type === "input" && (
            <Input
              key="input"
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              allowClear
            />
          ),
          type === "select" && (
            <Select
              style={{ width: "100%" }}
              key="select"
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(value) => {
                setSelectedKeys(value ? [value] : []);
              }}
              dropdownStyle={{ textTransform: "capitalize" }}
              allowClear>
              {options &&
                options.map((option: any, index: number) => (
                  <Select.Option key={option.key} value={option.key}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          ),
          type === "date" && (
            <DatePicker
              format={dateFormat}
              key="date"
              value={selectedKeys[0]}
              onChange={(e) => {
                console.log("date", e);
                setSelectedKeys(e ? [e] : []);
              }}
              allowClear
              style={{ marginBottom: 8, display: "block" }}
            />
          )
        ]}
        <Row gutter={16}>
          <Col sm={12}>
            <Button
              onClick={() => {
                this.handleSearch(selectedKeys, dataIndex, type);
              }}
              type="primary"
              block>
              Search
            </Button>
          </Col>
          <Col sm={12}>
            <Button
              onClick={() => this.handleReset(dataIndex, confirm, clearFilters)}
              type="default"
              block>
              Reset
            </Button>
          </Col>
        </Row>
      </Space>
    ),
    filterIcon: (filtered: any) => {
      const { searchHeaders } = this.state;
      return <SearchOutlined style={{ color: searchHeaders[dataIndex] ? "#1890ff" : undefined }} />;
    }
  });

  render() {
    const showTotal = (total: number, range: string[]) =>
      `${range[0]}-${range[1]} of ${total} items`;
    const { showPagination, total } = this.props;
    let { columns } = this.props;

    const { page, pageSize } = this.state;

    columns = columns.map((column: any) =>
      column.showSearch
        ? {
            ...column,
            ...this.getColumnSearchProps(
              column.customIndex ? column.customIndex : column.dataIndex,
              column.type,
              formatArray(column.options)
            )
          }
        : column
    );
    const paginationProps: any = {
      current: page,
      total,
      pageSize,
      showTotal,
      defaultPageSize: pageSize,
      showSizeChanger: true,
      size: "small"
    };
    return (
      <Table
        {...this.props}
        columns={columns}
        onChange={this.handleChange}
        pagination={showPagination ? paginationProps : false}
      />
    );
  }
}

export default Cardtable;
