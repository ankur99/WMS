import { useRef, useState } from "react";
import { Form, Button, Table, Space, InputNumber } from "antd";
import { FilterValue } from "antd/lib/table/interface";

import BulkAssignModal from "../../Components/modals/BulkAssignModal";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import {
  usePutawayAssignmentData,
  useAssignPutawayAssignment,
  downloadPutawayAssignment
} from "../../hooks/useRQPutawayAssignment";
import DebounceSelect from "../../Components/common/DebounceSelect";
import fetchUserList from "../../api/fetchUserList";
import { FilterTypes, formatDate, uomTypes } from "../../utils/constants";
import {
  PutawayApiReceivedDataType,
  PutawayDataType,
  PutawayPayloadType
} from "../../types/putawayAssignmentTypes";
import TextToolTip from "../../Components/common/TextToolTip";
import HighlightText from "../../Components/common/HighlightText";
import { onError, showSuccessToast } from "../../utils/helperFunctions";
import useTable from "../../hooks/useTable";

const { Column } = Table;
const toolTipText = "Assign the task to someone first with proper quantity";

const FreshPutawayAssignment = ({ type }: { type: "fresh" | "return" }) => {
  //needed so that I can use getFieldsValue
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  //in order to rerender the assign column when asigned to is filled
  const [, setTest] = useState("");

  const {
    currentPage,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading,
    selectedRowKeys,
    onSelectRowKeysChange
  } = useTable();

  const {
    isLoading,
    isFetching,
    data: putawayAssignmentData
  }: {
    isLoading: boolean;
    isFetching: boolean;
    data: PutawayApiReceivedDataType | undefined;
  } = usePutawayAssignmentData({
    currentPage,
    filtersValue,
    // searchText,
    onError,
    type: type
  });

  const onSuccessAssign = (msg: string) => {
    form.resetFields();
    showSuccessToast(msg);
  };

  const { isLoading: mutationLoading, mutate: assignPutaway } = useAssignPutawayAssignment({
    onError,
    onSuccess: onSuccessAssign
  });

  const handleAssign = async (row: PutawayDataType, data: any) => {
    //sending the data for api call
    const payload: PutawayPayloadType = {
      assigned_to: data?.assignedTo?.value,
      items: [{ id: row?.id, quantity: data?.quantity }]
    };

    assignPutaway(payload);
  };

  const bulkAssign = () => {
    setModalVisible(true);
  };
  const handleBulkAssign = (userId: number) => {
    if (putawayAssignmentData) {
      let payloadToSend: PutawayPayloadType;
      const dataCorrespondingToSelectedRows = [];
      const data = form.getFieldsValue()?.users;

      for (let i = 0; i < selectedRowKeys.length; i++) {
        for (let j = 0; j < putawayAssignmentData?.data?.length; j++) {
          if (selectedRowKeys[i] === putawayAssignmentData?.data[j]?.id) {
            const obj: any = putawayAssignmentData?.data[j];
            obj.indexAtWhichDataFound = j;
            dataCorrespondingToSelectedRows.push(obj);
          }
        }
      }

      const items = [];
      for (let i = 0; i < dataCorrespondingToSelectedRows.length; i++) {
        if (
          data[dataCorrespondingToSelectedRows[i]?.indexAtWhichDataFound].quantity <=
          dataCorrespondingToSelectedRows[i]?.pending_quantity
        ) {
          items.push({
            id: dataCorrespondingToSelectedRows[i]?.id,
            quantity: data[dataCorrespondingToSelectedRows[i]?.indexAtWhichDataFound]?.quantity
          });
        }
      }

      // eslint-disable-next-line prefer-const
      payloadToSend = {
        assigned_to: userId,
        items
      };

      // console.log(payloadToSend);
      assignPutaway(payloadToSend);
      setModalVisible(false);
      onSelectRowKeysChange([]);
    }
  };

  const downloadCSV = async () => {
    handleCSVLoading(true);
    await downloadPutawayAssignment({
      // searchText
      filtersValue,
      type
    });
    handleCSVLoading(false);
  };

  return (
    <>
      <div className="buttonWrapperTop">
        <div className="buttonsTop">
          <Space align="baseline">
            <Button type="primary" onClick={downloadCSV} loading={csvDownloadLoading}>
              CSV Download
            </Button>
            {selectedRowKeys.length > 0 && (
              <>
                <Button type="primary" onClick={bulkAssign}>
                  Bulk Assign
                </Button>
                <div>
                  {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ""}
                </div>
              </>
            )}
          </Space>
        </div>
      </div>
      <Form
        form={form}
        preserve={false}
        name="dynamic_form_nest_item"
        // onFinish={onFinish}
        autoComplete="off"
        style={{ overflow: "auto" }}>
        <Form.List name="users">
          {() => (
            <>
              <Table
                dataSource={!isLoading && !isFetching ? putawayAssignmentData?.data : []}
                rowKey={"id"}
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectRowKeysChange
                }}
                onChange={handleTableChange}
                pagination={{
                  current: currentPage,
                  pageSize: 15,
                  total: putawayAssignmentData ? putawayAssignmentData?.meta?.total : 15,
                  showSizeChanger: false
                }}
                loading={isLoading || mutationLoading || isFetching}
                size="small"
                scroll={{ x: 1800 }}>
                <Column
                  dataIndex={"product_id"}
                  title={"PID"}
                  filteredValue={filtersValue?.product_id || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "product_id",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.inputNumber
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.product_id && filtersValue.product_id[0]) {
                      return (
                        <HighlightText
                          text={value}
                          highlight={filtersValue.product_id[0] as string}
                        />
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

                <Column
                  dataIndex={"inward_at"}
                  title={type === "return" ? "Return At" : "Inward At"}
                  render={(value) => {
                    return formatDate(value);
                  }}
                />
                {type === "fresh" && <Column dataIndex={"putaway_type"} title={"Inward Type"} />}
                {type === "return" && <Column dataIndex={"putaway_type"} title={"Return Type"} />}

                <Column
                  dataIndex={"source_id"}
                  title={`${type === "fresh" ? "GRN ID" : "Return OrderId/GRN ID"}`}
                  filteredValue={filtersValue?.source_id || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "source_id",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.source_id && filtersValue.source_id[0]) {
                      return (
                        <HighlightText
                          text={value}
                          highlight={filtersValue.source_id[0] as string}
                        />
                      );
                    }
                    return <div>{value}</div>;
                  }}
                />

                <Column
                  dataIndex={"barcode"}
                  title={"Barcode"}
                  filteredValue={filtersValue?.barcode || null}
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

                <Column dataIndex={"total_quantity"} title={"Total Quantity"} />
                <Column dataIndex={"pending_quantity"} title={"Pending Quantity"} />

                <Column
                  dataIndex={"pending_quantity"}
                  title={"Assign Quantity"}
                  render={(value, row, index) => {
                    return (
                      <Form.Item
                        style={{ marginBottom: "0px" }}
                        name={[index, "quantity"]}
                        rules={[
                          { required: true, message: "Missing Quantity" },
                          {
                            validator: (rule: unknown, typedValue: string) => {
                              if (typedValue > value) {
                                return Promise.reject(
                                  "Provided Quantity exceeds the max pending quantity"
                                );
                              } else if (+typedValue < 1) {
                                return Promise.reject("Provided Quantity is not valid");
                              }
                              return Promise.resolve();
                            }
                          }
                        ]}
                        initialValue={Math.floor(value)}>
                        <InputNumber
                          placeholder="quantity"
                          style={{ width: "100%", minWidth: "3rem", marginRight: 8 }}
                          onChange={() => setTest(Date.now().toString())}
                        />
                      </Form.Item>
                    );
                  }}
                />

                <Column
                  dataIndex={"assignedTo"}
                  title={"Assign to"}
                  render={(value, row, index) => {
                    return (
                      <Form.Item
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
                  align="center"
                  fixed="right"
                  render={(value, row: PutawayDataType, index) => {
                    const data = form.getFieldsValue()?.users?.[index];
                    if (data?.assignedTo) {
                      if (
                        data?.quantity < 1 ||
                        !data.quantity ||
                        data?.quantity > row?.pending_quantity
                      ) {
                        return <TextToolTip label="Assign" toolTipText={toolTipText} />;
                      }
                      return (
                        <Form.Item style={{ marginBottom: 0 }}>
                          <Button type="link" onClick={() => handleAssign(row, data)}>
                            Assign
                          </Button>
                          <Button
                            type="link"
                            onClick={() => {
                              const intialData: any = {
                                assignedTo: undefined
                              };
                              intialData.quantity = Math.floor(row.pending_quantity);
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

export default FreshPutawayAssignment;
