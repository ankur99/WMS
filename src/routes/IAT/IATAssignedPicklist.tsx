import { Form, Table, Tag, Button } from "antd";

import BulkAssignModal from "../../Components/modals/BulkAssignModal";

import { FilterTypes, reAssignText } from "../../utils/constants";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import TextToolTip from "../../Components/common/TextToolTip";
import DebounceSelect from "../../Components/common/DebounceSelect";
import { fetchIATPicker } from "../../api/fetchUserList";
import { IATStatus } from "../../utils/constants";
import { IATAssignPicklistApiDataProps } from "../../types/iatPicklistAssignTypes";
import confirmModal from "../../Components/modals/ConfirmModal";
import useIATAssignPicklist from "../../hooks/useIATAssignPicklist";

const { Column } = Table;
const toolTipText = "Assign the picklist to someone first";

const IATAssignedPicklist = () => {
  //needed so that I can use getFieldsValue
  const [form] = Form.useForm();

  const {
    setSearchText,
    setSearchedColumn,
    currentPage,
    setTest,
    searchInputRef,
    filtersValue,
    modalVisible,
    setModalVisible,
    selectedRowKeys,
    onSelectChange,
    handleTableChange,
    handleAssign,
    handleBulkAssigOrReassign,
    handleReAssign,
    checkBulkAssign,
    isLoading,
    isFetching,
    iatAssignedPicklistData,
    mutationLoading,
    mutationReassignLoading
  } = useIATAssignPicklist();

  return (
    <>
      <Form
        form={form}
        preserve={false}
        name="dynamic_form_nest_item"
        // onFinish={onFinish}
        autoComplete="off"
        style={{ overflow: "auto" }}>
        <Form.List name="iatAssignPicklist">
          {() => (
            <>
              {selectedRowKeys.length > 0 && (
                <div className="bulkButtonWrapper">
                  <Button type="primary" onClick={checkBulkAssign}>
                    Bulk Assign/ReAssign
                  </Button>
                  <span style={{ marginLeft: 8 }}>
                    {selectedRowKeys.length > 0 ? `Selected ${selectedRowKeys.length} items` : ""}
                  </span>
                </div>
              )}
              <Table
                dataSource={iatAssignedPicklistData?.list}
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange,
                  getCheckboxProps: (record) => {
                    return {
                      disabled: record.status === IATStatus.completed ? true : false
                    };
                  }
                }}
                onChange={handleTableChange}
                pagination={{
                  current: currentPage,
                  pageSize: 15,
                  total:
                    iatAssignedPicklistData && iatAssignedPicklistData?.paginatedData?.totalPage
                      ? iatAssignedPicklistData?.paginatedData?.totalPage
                      : 15,
                  showSizeChanger: false
                }}
                loading={isLoading || mutationLoading || isFetching || mutationReassignLoading}>
                <Column
                  dataIndex={"picklistId"}
                  title={"Picklist ID"}
                  filteredValue={filtersValue.picklistId || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Picklist Id",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn,
                    filterType: FilterTypes.inputNumber
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value) => {
                    if (filtersValue.picklistId && filtersValue.picklistId[0]) {
                      return (
                        <HighlightText
                          text={value}
                          highlight={filtersValue.picklistId[0] as string}
                        />
                      );
                    }
                    return value;
                  }}
                />
                <Column
                  dataIndex={"itemsCount"}
                  title={"No. Of Items"}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"productsCount"}
                  title={"No. Of Products"}
                  render={(value) => {
                    return value;
                  }}
                />
                <Column
                  dataIndex={"assignedAt"}
                  title={"Assigned At"}
                  filteredValue={filtersValue.assignedAt || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Assigned AT",
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
                  dataIndex={"resolvedAt"}
                  title={"Resolved At"}
                  filteredValue={filtersValue.resolvedAt || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Resolved At",
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
                  dataIndex={"userName"}
                  title={"Assigned to"}
                  filteredValue={filtersValue.userName || null}
                  {...getColumnSearchPropsForTable({
                    dataIndex: "Assigned To",
                    searchInputRef,
                    setSearchText,
                    setSearchedColumn
                  })}
                  onFilter={() => {
                    return true;
                  }}
                  render={(value, row: IATAssignPicklistApiDataProps, index) => {
                    if (value) {
                      if (row?.status === IATStatus.completed) {
                        return <p style={{ padding: "0 12px" }}>{value}</p>;
                      }
                      return (
                        <Form.Item
                          style={{ marginBottom: "0px" }}
                          name={[index, "userAssigned"]}
                          rules={[{ required: true, message: "Missing ReAssign Person Name" }]}
                          initialValue={row.userAssigned}>
                          <DebounceSelect
                            placeholder="Select ReAssignee"
                            fetchOptions={fetchIATPicker}
                            onChange={() => setTest(Date.now().toString())}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      );
                    }
                    return (
                      <Form.Item
                        style={{ marginBottom: "0px" }}
                        name={[index, "userAssigned"]}
                        rules={[{ required: true, message: "Missing Assign Person Name" }]}
                        initialValue={row.userAssigned}>
                        <DebounceSelect
                          placeholder="Select Assignee"
                          fetchOptions={fetchIATPicker}
                          onChange={() => setTest(Date.now().toString())}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    );
                  }}
                />
                <Column
                  dataIndex={"status"}
                  title={"Status"}
                  filters={[
                    {
                      text: "Not Picked",
                      value: IATStatus.not_started
                    },
                    {
                      text: "Yet to Start",
                      value: IATStatus.assigned
                    },
                    {
                      text: "In Progress",
                      value: IATStatus.started
                    },
                    {
                      text: "Completed",
                      value: IATStatus.completed
                    }
                  ]}
                  filteredValue={filtersValue.status || null}
                  filterMultiple={false}
                  onFilter={() => {
                    // return record.status.indexOf(value) === 0;
                    return true;
                  }}
                  render={(value: string) => {
                    if (value === IATStatus.assigned) {
                      return <Tag color="#FF4D4F">Yet to Start</Tag>;
                    } else if (value === IATStatus.started) {
                      return <Tag color="#FAAD14">In Progress</Tag>;
                    } else if (value === IATStatus.completed) {
                      return <Tag color="#52C41A">Completed</Tag>;
                    }
                    return <Tag color="deeppink">Not Picked</Tag>;
                  }}
                />
                <Column
                  title={"Action"}
                  dataIndex={"action"}
                  render={(value, row: IATAssignPicklistApiDataProps, index) => {
                    const data = form.getFieldsValue()?.iatAssignPicklist?.[index];
                    const name = row?.userAssigned;
                    // For reassignment for not stated picklist
                    if (data?.userAssigned && row.status === IATStatus.assigned) {
                      return (
                        <Form.Item style={{ marginBottom: "0" }}>
                          <Button
                            disabled={data?.userAssigned?.key === name?.key}
                            type="link"
                            onClick={() =>
                              handleReAssign(data?.userAssigned?.value, [row?.picklistId] as [
                                number
                              ])
                            }>
                            ReAssign
                          </Button>
                        </Form.Item>
                      );
                    }
                    // For reassignment for inprogress and reassigned picklist
                    else if (data?.userAssigned && row.status === IATStatus.started) {
                      return (
                        <Form.Item style={{ marginBottom: "0" }}>
                          <Button
                            disabled={data?.userAssigned?.key === name?.key}
                            type="link"
                            onClick={() =>
                              confirmModal({
                                title: "Alert",
                                content: reAssignText,
                                onOk: () =>
                                  handleReAssign(data?.userAssigned?.value, [row?.picklistId] as [
                                    number
                                  ])
                              })
                            }>
                            ReAssign
                          </Button>
                        </Form.Item>
                      );
                    }
                    // for completed
                    else if (row?.userId) {
                      return <div style={{ paddingLeft: "15px" }}>--</div>;
                    }

                    // checking if some user is selected
                    else if (data?.userAssigned) {
                      const userId = data?.userAssigned?.value;
                      const picklistId = [row?.picklistId];
                      return (
                        <Form.Item style={{ marginBottom: "0" }}>
                          <Button
                            type="link"
                            onClick={() => handleAssign(userId, picklistId as [number])}>
                            Assign
                          </Button>
                        </Form.Item>
                      );
                    }
                    return (
                      <>
                        <TextToolTip label="Assign" toolTipText={toolTipText} />
                      </>
                    );
                  }}
                />
              </Table>
              <BulkAssignModal
                visible={modalVisible}
                handleCancel={() => setModalVisible(false)}
                handleOk={handleBulkAssigOrReassign}
                loading={false}
                title="Bulk Assign/ReAssign"
              />
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};

export default IATAssignedPicklist;
