import { useRef, useState } from "react";
import { Form, Table, Typography, Row, Col, Tag, DatePicker, Spin, Button, Space } from "antd";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";
import {
  downloadPutawayReport,
  usePutawayReportData,
  usePutawayReportSummaryData
} from "../../hooks/useRQPutawayReport";

import Paper from "../../Components/common/Paper";

import {
  uomTypes,
  FilterTypes,
  getFormattedTodayDate,
  getLastWeekFormattedDate
} from "../../utils/constants";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import moment from "moment";
import { generateLabelFromKey, onError } from "../../utils/helperFunctions";

const { Column } = Table;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const dateFormat = "DD-MM-YYYY";
const today = getFormattedTodayDate();
const prevWeek = getLastWeekFormattedDate();

const PutawayReport = () => {
  //needed so that I can use getFieldsValue
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [csvDownloadLoading, setCsvDownloadLoading] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>();

  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    id: null,
    name: null,
    uom: null,
    employee_name: null,
    status: null,
    grn_created_at: null,
    created_at: null,
    completed_at: null,
    barcode: null
  });

  const [rangePickerDate, setRangePickerDate] = useState<[string, string]>([prevWeek, today]);

  const {
    isLoading,
    isFetching,
    data: putawayReportData
    // refetch
  } = usePutawayReportData({
    currentPage,
    id: filtersValue.id && (filtersValue.id[0] as string | null),
    name: filtersValue.name && (filtersValue.name[0] as string | null),
    employee_name: filtersValue.employee_name && (filtersValue.employee_name[0] as string | null),
    status: filtersValue.status && (filtersValue.status[0] as string | null),
    grn_created_at:
      filtersValue.grn_created_at && (filtersValue.grn_created_at[0] as string | null),
    created_at: filtersValue.created_at && (filtersValue.created_at[0] as string | null),
    completed_at: filtersValue.completed_at && (filtersValue.completed_at[0] as string | null),
    rangePickerDate: rangePickerDate,
    barcode: filtersValue.barcode && (filtersValue.barcode[0] as string | null),
    onError
  });

  const { isLoading: isLoadingSummary, data: putawayReportSummaryData } =
    usePutawayReportSummaryData({ onError, rangePickerDate });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    // console.log({ pagination, filters });

    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);

    //clearing the top range filter as assigned at is same as the from of range filterÎ
    if (filters.created_at && filters.created_at[0]) {
      setRangePickerDate(["", ""]);
      // form1.resetFields();
      form1.setFieldsValue({
        rangePicker: undefined
      });
    }
  };

  const downloadCSV = async () => {
    setCsvDownloadLoading(true);
    await downloadPutawayReport({
      id: filtersValue.id && (filtersValue.id[0] as string | null),
      name: filtersValue.name && (filtersValue.name[0] as string | null),
      employee_name: filtersValue.employee_name && (filtersValue.employee_name[0] as string | null),
      status: filtersValue.status && (filtersValue.status[0] as string | null),
      grn_created_at:
        filtersValue.grn_created_at && (filtersValue.grn_created_at[0] as string | null),
      created_at: filtersValue.created_at && (filtersValue.created_at[0] as string | null),
      completed_at: filtersValue.completed_at && (filtersValue.completed_at[0] as string | null),
      rangePickerDate: rangePickerDate,
      barcode: filtersValue.barcode && (filtersValue.barcode[0] as string | null)
    });
    setCsvDownloadLoading(false);
  };

  return (
    <>
      <div className="buttonWrapperTop">
        <Space className="buttonsTop">
          <Form
            form={form1}
            name="datePicker"
            autoComplete="off"
            initialValues={{
              rangePicker: [
                prevWeek ? moment(prevWeek, dateFormat) : "",
                today ? moment(today, dateFormat) : ""
              ]
            }}>
            <Form.Item name="rangePicker">
              <RangePicker
                style={{ borderColor: "#40a9ff" }}
                format="DD-MM-YYYY"
                onChange={(_, dateString) => {
                  //if assignedAt filter is present then clearing it
                  if (filtersValue.created_at && filtersValue.created_at[0]) {
                    setFiltersValue((prev) => {
                      return {
                        ...prev,
                        created_at: null
                      };
                    });
                  }
                  setRangePickerDate(dateString);
                }}
                allowClear
              />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Download
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        preserve={false}
        name="dynamic_form_nest_item"
        // onFinish={onFinish}
        autoComplete="off"
        style={{ overflow: "auto" }}>
        <Form.List name="putawayReport">
          {() => (
            <>
              <Spin spinning={isLoadingSummary}>
                <Paper>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} className="m1-b">
                      <Title level={5}>Average Time taken in completion</Title>
                      <div>{putawayReportSummaryData?.average_time}</div>
                    </Col>
                    <Col xs={24} sm={12} md={8} className="m1-b">
                      <Title level={5}>Average no of items per employee</Title>
                      <div>{putawayReportSummaryData?.avg_items_per_employee}</div>
                    </Col>
                    <Col xs={24} sm={12} md={8} className="m1-b">
                      <Title level={5}>Total no. of putaways completed</Title>
                      <div>{putawayReportSummaryData?.total_items || 0}</div>
                    </Col>
                  </Row>
                </Paper>
              </Spin>
              <Table
                className="m1-t"
                dataSource={putawayReportData?.list}
                onChange={handleTableChange}
                pagination={{
                  current: currentPage,
                  pageSize: 15,
                  total:
                    putawayReportData && putawayReportData?.paginatedData?.totalPage
                      ? putawayReportData?.paginatedData?.totalPage
                      : 15,
                  showSizeChanger: false
                }}
                loading={isLoading || isFetching}
                size="small"
                scroll={{ x: 1500 }}>
                <Column
                  dataIndex={"id"}
                  title={"PID"}
                  filteredValue={filtersValue.id || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "id",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.inputNumber
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.id && filtersValue.id[0]) {
                      return (
                        <HighlightText text={value} highlight={filtersValue.id[0] as string} />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />
                <Column
                  dataIndex={"name"}
                  title={"Product Name"}
                  filteredValue={filtersValue.name || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "name",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.name && filtersValue.name[0]) {
                      return (
                        <HighlightText text={value} highlight={filtersValue.name[0] as string} />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />
                {(filtersValue.uom === null ||
                  filtersValue.uom === undefined ||
                  filtersValue?.uom?.[0] === uomTypes.unit) && (
                  <Column
                    dataIndex={"quantityUnit"}
                    title={"QTY"}
                    render={(value) => {
                      return value;
                    }}
                  />
                )}
                {filtersValue?.uom?.[0] === uomTypes.outer && (
                  <Column
                    dataIndex={"quantityOuter"}
                    title={"QTY"}
                    render={(value) => {
                      return Math.floor(value);
                    }}
                  />
                )}
                {filtersValue?.uom?.[0] === uomTypes.case && (
                  <Column
                    dataIndex={"quantityCase"}
                    title={"QTY"}
                    render={(value) => {
                      return Math.floor(value);
                    }}
                  />
                )}
                <Column
                  dataIndex={"grn_created_at"}
                  title={"GRN At"}
                  filteredValue={filtersValue.grn_created_at || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "GRN AT",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.date
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"inward_type"}
                  title={"Inward Type"}
                  render={(value: string) => generateLabelFromKey(value)}
                />
                <Column
                  dataIndex={"created_at"}
                  title={"Assigned At"}
                  filteredValue={filtersValue.created_at || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Assigned At",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.date
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"completed_at"}
                  title={"Completed At"}
                  filteredValue={filtersValue.completed_at || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Completed At",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.date
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (value === null) return <Text type="secondary">Not Completed</Text>;

                    return <>{value}</>;
                  }}
                />
                <Column
                  dataIndex={"time_taken"}
                  title={"Time Taken"}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"barcode"}
                  title={"Barcode"}
                  filteredValue={filtersValue.barcode || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "barcode",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.barcode && filtersValue.barcode[0]) {
                      return (
                        <HighlightText text={value} highlight={filtersValue.barcode[0] as string} />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />
                <Column
                  dataIndex={"employee_name"}
                  title={"Assign to"}
                  filteredValue={filtersValue.employee_name || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "employee_name",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.employee_name && filtersValue.employee_name[0]) {
                      return (
                        <HighlightText
                          text={value}
                          highlight={filtersValue.employee_name[0] as string}
                        />
                      );
                    }
                    return value;
                  }}
                />
                <Column
                  dataIndex={"status"}
                  title={"Status"}
                  filters={[
                    {
                      text: "Yet to Start",
                      value: "pending"
                    },
                    {
                      text: "Completed",
                      value: "completed"
                    }
                  ]}
                  filteredValue={filtersValue.status || null}
                  filterMultiple={false}
                  onFilter={() => {
                    // return record.status.indexOf(value) === 0;
                    return true;
                  }}
                  render={(value: string) => {
                    if (value === "pending") {
                      return <Tag color="#FF4D4F">Yet to Start</Tag>;
                    } else if (value === "processing") {
                      return <Tag color="#FAAD14">In Progress</Tag>;
                    }
                    return <Tag color="#52C41A">Completed</Tag>;
                  }}
                />
              </Table>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default PutawayReport;
