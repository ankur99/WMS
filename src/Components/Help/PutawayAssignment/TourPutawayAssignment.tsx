import React, { useRef, useState } from "react";
import { Form, Input, Button, Table } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";

import Joyride from "react-joyride";

import BulkAssignModal from "../../modals/BulkAssignModal";
import getColumnSearchPropsForTable from "../../common/ColumnSearchPropsForTable";
import DebounceSelect from "../../common/DebounceSelect";
import fetchUserList from "../../../api/fetchUserList";
import { formatDate, uomTypes } from "../../../utils/constants";
import {
  InitialRowData,
  FreshPutawayApiDataProps,
  FreshPutawaySourceType
} from "../../../types/putawayAssignmentTypes";
import TextToolTip from "../../common/TextToolTip";
import HighlightText from "../../common/HighlightText";
import useTourPutawayAssignment from "../../../hooks/useTourPutawayAssignment";

const { Column } = Table;
const toolTipText = "Assign the task to someone first with proper quantity";

const quantities1 = [40, 80, 100, 200];
const quantities2 = [4, 8, 10, 20];
const quantities3 = [2, 4, 5, 10];

const variants = [
  {
    type: "unit",
    quantity: "1"
  },
  {
    type: "outer",
    quantity: "8"
  },
  {
    type: "case",
    quantity: "16"
  }
];

const data: FreshPutawayApiDataProps[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i.toString(),
    pid: i,
    productName: `ProductName ${i}`,
    variants,
    inwardAt: formatDate(new Date().toDateString()),
    assignedTo: null,
    quantityUnit: quantities1[i % 4],
    quantityOuter: quantities2[i % 4],
    quantityCase: quantities3[i % 4],
    barcode: "1234",
    sourceId: 1234,
    putawayType: FreshPutawaySourceType.FRESH_INWARD,
    sourceType: "grn"
  });
}

const putawayAssignmentData = {
  list: data,
  paginatedData: {
    currentPage: 1,
    totalPage: 46
  }
};

const TourPutawayAssignment = () => {
  // const navigate = useNavigate();

  //needed so that I can use getFieldsValue
  const [form] = Form.useForm();

  const [tableData, setTableData] = useState(putawayAssignmentData.list);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [uomSelected, setUOMSelected] = useState(uomTypes.unit);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    pid: null,
    productName: null,
    uom: null
  });

  //in order to rerender the assign column when asigned to is filled
  const [, setTest] = useState("");

  const searchInputRef = useRef<HTMLInputElement>();

  const {
    lastRef,
    run,
    steps,
    stepIndex,
    refRun,
    handleJoyrideCallback,
    handleStepIndexChange,
    handleRun
  } = useTourPutawayAssignment();

  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  React.useEffect(() => {
    //removing the past filter as new filter is applied
    if (searchText === filtersValue.pid?.[0]) {
      setFiltersValue((prev) => {
        return {
          ...prev,
          productName: null
        };
      });
    } else if (searchText === filtersValue.productName?.[0]) {
      setFiltersValue((prev) => {
        return {
          ...prev,
          pid: null
        };
      });
    }
  }, [searchText]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setFiltersValue(filters);

    //changing uom filters

    if (filters.uom === null || filters.uom === undefined) {
      setUOMSelected(uomTypes.unit);
    } else if (filters?.uom?.[0] !== uomSelected) {
      const uom = filters?.uom?.[0] as uomTypes;
      setUOMSelected(uom);
    }
  };

  const bulkAssign = () => {
    setModalVisible(true);
  };

  const handleBulkAssign = () => {
    const indexesToDelete = [];
    // console.log({ selectedRowKeys, tableData });

    //getting indexes to delete
    for (let i = 0; i < selectedRowKeys.length; i++) {
      for (let j = 0; j < tableData.length; j++) {
        if (tableData[j].key === selectedRowKeys[i]) {
          indexesToDelete.push(j);
        }
      }
    }

    const tempTableData = [...tableData];
    //deleting indexes from table data
    for (let i = indexesToDelete.length - 1; i >= 0; i--) {
      tempTableData.splice(indexesToDelete[i], 1);
    }

    setTableData([...tempTableData]);

    setModalVisible(false);
    setSelectedRowKeys([]);
  };

  return (
    <>
      <div ref={lastRef} />
      <Joyride
        continuous={true}
        run={run}
        steps={steps}
        stepIndex={stepIndex}
        scrollToFirstStep={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            overlayColor: "#00000099",
            primaryColor: "#000000D9",
            zIndex: 10000000
          }
        }}
      />
      <Form
        form={form}
        preserve={false}
        name="dynamic_form_nest_item"
        // onFinish={onFinish}
        autoComplete="off"
        style={{ overflow: "auto" }}>
        <Form.List name="users">
          {(fields, { remove }) => (
            <>
              {selectedRowKeys.length > 0 && (
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}>
                  <Button type="primary" onClick={bulkAssign}>
                    Bulk Assign
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ""}
                  </span>
                </div>
              )}
              <Table
                rowKey="key"
                dataSource={tableData}
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange
                }}
                onChange={handleTableChange}
                className="putaway-assignment-table"
                rowClassName={(_, index) => (index === 0 ? "putaway-assignment-table-row1" : "")}>
                <Column
                  dataIndex={"pid"}
                  title={"PID"}
                  filteredValue={filtersValue?.pid || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "pid",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterFromFrontend: true
                  })}
                  onFilter={(value, row: FreshPutawayApiDataProps) => {
                    return row.pid.toString().includes(value.toString());
                  }}
                  render={(value) => {
                    if (filtersValue.pid && filtersValue.pid[0]) {
                      return (
                        <HighlightText text={value} highlight={filtersValue.pid[0] as string} />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />
                <Column
                  dataIndex={"productName"}
                  title={"Product Name"}
                  filteredValue={filtersValue.productName || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "productName",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterFromFrontend: true
                  })}
                  onFilter={(value, row: FreshPutawayApiDataProps) => {
                    return row.productName.toString().includes(value.toString());
                  }}
                  render={(value) => {
                    if (filtersValue.productName && filtersValue.productName[0]) {
                      return (
                        <HighlightText
                          text={value}
                          highlight={filtersValue.productName[0] as string}
                        />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />
                {uomSelected === uomTypes.unit && (
                  <Column
                    dataIndex={"quantityUnit"}
                    title={"QTY"}
                    render={(value, row, index) => {
                      return (
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[index, "quantityUnit"]}
                          rules={[
                            { required: true, message: "Missing Quantity" },
                            {
                              validator: (rule: unknown, typedValue: string) => {
                                if (typedValue > value) {
                                  return Promise.reject(
                                    "Provided Quantity exceees the max Quantity"
                                  );
                                } else if (+typedValue < 1) {
                                  return Promise.reject("Provided Quantity is not valid");
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                          initialValue={Math.floor(value)}>
                          <Input
                            type="number"
                            placeholder="quantity"
                            style={{ width: "100%", minWidth: "3rem", marginRight: 8 }}
                            onChange={() => setTest(Date.now().toString())}
                          />
                        </Form.Item>
                      );
                    }}
                  />
                )}

                {uomSelected === uomTypes.outer && (
                  <Column
                    dataIndex={"quantityOuter"}
                    title={"QTY"}
                    render={(value, row, index) => {
                      return (
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[index, "quantityOuter"]}
                          rules={[
                            { required: true, message: "Missing Quantity" },
                            {
                              validator: (rule: unknown, typedValue: string) => {
                                if (typedValue > value) {
                                  return Promise.reject(
                                    "Provided Quantity exceees the max Quantity"
                                  );
                                } else if (+typedValue < 1) {
                                  return Promise.reject("Provided Quantity is not valid");
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                          initialValue={Math.floor(value)}>
                          <Input
                            type="number"
                            placeholder="quantity"
                            style={{ width: "100%", minWidth: "3rem", marginRight: 8 }}
                            onChange={() => setTest(Date.now().toString())}
                          />
                        </Form.Item>
                      );
                    }}
                  />
                )}

                {uomSelected === uomTypes.case && (
                  <Column
                    dataIndex={"quantityCase"}
                    title={"QTY"}
                    render={(value, row, index) => {
                      return (
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[index, "quantityCase"]}
                          rules={[
                            { required: true, message: "Missing Quantity" },
                            {
                              validator: (rule: unknown, typedValue: string) => {
                                if (typedValue > value) {
                                  return Promise.reject(
                                    "Provided Quantity exceees the max Quantity"
                                  );
                                } else if (+typedValue < 1) {
                                  return Promise.reject("Provided Quantity is not valid");
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                          initialValue={Math.floor(value)}>
                          <Input
                            type="number"
                            placeholder="quantity"
                            style={{ width: "100%", minWidth: "3rem", marginRight: 8 }}
                            onChange={() => setTest(Date.now().toString())}
                          />
                        </Form.Item>
                      );
                    }}
                  />
                )}

                <Column
                  dataIndex={"uom"}
                  title={"UOM"}
                  filters={[
                    {
                      text: "unit",
                      value: uomTypes.unit
                    },
                    {
                      text: "outer",
                      value: uomTypes.outer
                    },
                    {
                      text: "case",
                      value: uomTypes.case
                    }
                  ]}
                  filteredValue={filtersValue.uom || null}
                  filterMultiple={false}
                  filterIcon={<CaretDownOutlined style={{ minWidth: "1rem" }} />}
                  onFilter={() => {
                    return true;
                  }}
                  render={() => {
                    return uomSelected;
                  }}
                />
                <Column
                  dataIndex={"inwardAt"}
                  title={"Inward At"}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"assignedTo"}
                  title={"Assign to"}
                  render={(value, row, index) => {
                    return (
                      <Form.Item
                        className={"putaway-assignment-table-row1-not-assigned"}
                        style={{ marginBottom: "0px" }}
                        name={[index, "assignedTo"]}
                        rules={[{ required: true, message: "Missing Assign Person Name" }]}>
                        <DebounceSelect
                          placeholder="Select Assignee"
                          fetchOptions={fetchUserList}
                          onChange={() => setTest(Date.now().toString())}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    );
                  }}
                />
                <Column
                  title={"Action"}
                  dataIndex={"action"}
                  render={(value, row: FreshPutawayApiDataProps, index) => {
                    const data = form.getFieldsValue()?.users?.[index];
                    //checking quantity and assigned to to show button assign and cancel
                    if (data?.assignedTo) {
                      //checking quantity is less than 1 and greater than pending quantity
                      if (
                        uomSelected === uomTypes.unit &&
                        (data?.quantityUnit < 1 ||
                          !data.quantityUnit ||
                          data?.quantityUnit > row?.quantityUnit)
                      ) {
                        return <TextToolTip label="Assign" toolTipText={toolTipText} />;
                      } else if (
                        uomSelected === uomTypes.outer &&
                        (data?.quantityOuter < 1 ||
                          !data.quantityOuter ||
                          data?.quantityOuter > row?.quantityOuter)
                      ) {
                        return <TextToolTip label="Assign" toolTipText={toolTipText} />;
                      } else if (
                        uomSelected === uomTypes.case &&
                        (data?.quantityCase < 1 ||
                          !data.quantityCase ||
                          data?.quantityCase > row?.quantityCase)
                      ) {
                        return <TextToolTip label="Assign" toolTipText={toolTipText} />;
                      }
                      if (!run && refRun.current === 0) {
                        handleRun(true);
                        handleStepIndexChange(4);
                        refRun.current = 1;
                      }

                      return (
                        <Form.Item className={"putaway-assignment-table-row1-task-assigned"}>
                          <Button
                            type="link"
                            onClick={() => {
                              //removing from antd form
                              remove(index);
                              //removing from user show list
                              const tempData = [...tableData];
                              tempData.splice(index, 1);
                              setTableData([...tempData]);

                              if (refRun.current !== "stop") {
                                const element = lastRef.current;
                                if (element) {
                                  element.className = "mock-last-step";
                                }
                              }

                              if (!run && refRun.current !== "stop") {
                                handleRun(true);
                                handleStepIndexChange(5);
                              }
                            }}>
                            Assign
                          </Button>
                          <Button
                            type="link"
                            onClick={() => {
                              const intialData: InitialRowData = {
                                assignedTo: undefined
                              };

                              if (uomSelected === uomTypes.unit) {
                                intialData.quantityUnit = Math.floor(row.quantityUnit);
                              } else if (uomSelected === uomTypes.outer) {
                                intialData.quantityOuter = Math.floor(row.quantityOuter);
                              } else if (uomSelected === uomTypes.case) {
                                intialData.quantityCase = Math.floor(row.quantityCase);
                              }
                              const initialUser = form.getFieldsValue()?.users;
                              initialUser.splice(index, 1, intialData);
                              form.setFieldsValue({
                                users: initialUser
                              });
                            }}>
                            Cancel
                          </Button>
                        </Form.Item>
                      );
                    }
                    return <TextToolTip label="Assign" toolTipText={toolTipText} />;
                  }}
                />
              </Table>
              <BulkAssignModal
                visible={modalVisible}
                handleCancel={() => setModalVisible(false)}
                handleOk={handleBulkAssign}
                loading={false}
                title="Bulk Assign"
              />
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default TourPutawayAssignment;
