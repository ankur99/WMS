import { Table, Space, Button, Select, Form } from "antd";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";
import { useState, useRef } from "react";
import HighlightText from "../../Components/common/HighlightText";
import { FilterTypes, formatDate } from "../../utils/constants";
import {
  AssignDataRefProps,
  GetStatusValueProps,
  IssueStatus,
  ItemProps,
  RowComplaintTypes
} from "../../types/ComplaintTypes";
import { useComplaintsData, useIssueTypesData } from "../../hooks/useRQComplaints";
import { onErrorNotification } from "../../utils/helperFunctions";
import ComplaintsMediaPreviewModal from "../../Components/modals/ComplaintsMediaPreviewModal";
import ComplaintsResolutionsModal from "../../Components/modals/ComplaintsResolutionsModal";
import ComplaintsStatusInfoModal from "../../Components/modals/ComplaintsStatusInfoModal";

const { Column } = Table;
const { Option } = Select;

const Complaints = () => {
  const [form] = Form.useForm();

  const [isImagePreviewModalVisible, setIsImagePreviewModalVisible] = useState(false);
  const [isResolutionModalVisible, setIsResolutionModalVisible] = useState<boolean>(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>();
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [, setTest] = useState("");

  const imagesRef = useRef<number>();
  const statusInfoRef = useRef<RowComplaintTypes>();
  const assignDataRef = useRef<AssignDataRefProps>();

  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    id: null,
    createdBy: null,
    status: null,
    type: null
  });

  const {
    isLoading,
    isFetching,
    data: complaintListData
  } = useComplaintsData({
    currentPage,
    id: filtersValue.id && (filtersValue.id[0] as string | null),
    createdBy: filtersValue.createdBy && (filtersValue.createdBy[0] as string | null),
    type: filtersValue.type && (filtersValue.type[0] as string | null),
    status: filtersValue.status && (filtersValue.status[0] as IssueStatus | null),
    onError: onErrorNotification
  });

  const { isLoading: issuesLoading, data: issuesData } = useIssueTypesData({
    onError: onErrorNotification
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);
  };

  const getFiltersData = () => {
    if (issuesData?.data?.data?.length > 0) {
      const issues = issuesData?.data?.data;
      const setTypes = issues.map((item: ItemProps) => ({
        value: item.issue_name,
        text: item.issue_name
      }));
      return setTypes;
    }
  };

  const handleStatusChange = (row: RowComplaintTypes, statusValue: GetStatusValueProps) => {
    const prevStatus = row.status;
    const changedStatus = statusValue.status;
    const id = row.id;

    const assignData = {
      prevStatus,
      changedStatus,
      id
    };

    assignDataRef.current = assignData;
    setIsResolutionModalVisible(true);
  };

  const handleImagePreview = (id: number) => {
    imagesRef.current = id;
    setIsImagePreviewModalVisible(true);
  };
  const handleStatusPreview = (row: RowComplaintTypes) => {
    statusInfoRef.current = row;
    setIsInfoModalVisible(true);
  };

  return (
    <>
      <Form form={form} preserve={false} name="dynamic_form_nest_item">
        <Form.List name="complaints">
          {() => (
            <Table
              rowKey="id"
              dataSource={complaintListData?.data}
              onChange={handleTableChange}
              loading={
                isLoading || issuesLoading || isFetching
                // || mutationIssuesLoading
              }
              pagination={{
                current: currentPage,
                pageSize: 15,
                total:
                  complaintListData && complaintListData?.meta?.total
                    ? complaintListData?.meta?.total
                    : 15,
                showSizeChanger: false
              }}>
              <Column
                title="ID"
                dataIndex="id"
                key="id"
                align="center"
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
                    return <HighlightText text={value} highlight={filtersValue.id[0] as string} />;
                  }
                  return <>{value}</>;
                }}
              />
              <Column
                title="User Name"
                dataIndex="createdBy"
                key="createdBy"
                align="center"
                filteredValue={filtersValue.createdBy || null}
                {...getColumnSearchPropsForTable({
                  dataIndex: "createdBy",
                  searchInputRef,
                  setSearchText,
                  setSearchedColumn
                })}
                onFilter={() => {
                  return true;
                }}
                render={(value) => {
                  if (filtersValue.createdBy && filtersValue.createdBy[0]) {
                    return (
                      <HighlightText text={value} highlight={filtersValue.createdBy[0] as string} />
                    );
                  }
                  return <>{value}</>;
                }}
              />
              <Column
                title="Type"
                dataIndex="type"
                align="center"
                filters={getFiltersData()}
                filteredValue={filtersValue?.type || null}
                filterMultiple={false}
                onFilter={() => {
                  return true;
                }}
              />
              <Column
                title="Issue Raised Time"
                dataIndex="created_at"
                key="IssueRaisedAt"
                align="center"
                render={(value) => {
                  return formatDate(value);
                }}
              />
              <Column
                title="Issue Description"
                dataIndex="text"
                key="issueDescription"
                align="center"
              />
              <Column
                title="Preview"
                dataIndex={"has_attachment"}
                align="center"
                render={(value: boolean, row: RowComplaintTypes) => {
                  if (value) {
                    return (
                      <Space size="middle">
                        <Button onClick={() => handleImagePreview(row.id)} size="small" type="link">
                          Preview
                        </Button>
                      </Space>
                    );
                  }
                  return <>--</>;
                }}
              />
              <Column
                title="Change Status"
                dataIndex={"status"}
                align="center"
                filters={[
                  {
                    text: IssueStatus.Not_Picked,
                    value: IssueStatus.Not_Picked
                  },
                  {
                    text: IssueStatus.In_Progress,
                    value: IssueStatus.In_Progress
                  },
                  {
                    text: IssueStatus.Resolved,
                    value: IssueStatus.Resolved
                  },
                  {
                    text: IssueStatus.Rejected,
                    value: IssueStatus.Rejected
                  }
                ]}
                filteredValue={filtersValue.status || null}
                filterMultiple={false}
                onFilter={() => {
                  // return record.status.indexOf(value) === 0;
                  return true;
                }}
                render={(value, row: RowComplaintTypes, index) => {
                  if (row.status === IssueStatus.Resolved || row.status === IssueStatus.Rejected) {
                    return <>{value}</>;
                  } else if (
                    row.status === IssueStatus.Not_Picked ||
                    row.status === IssueStatus.In_Progress
                  ) {
                    return <GetOptions row={row} index={index} setTest={setTest} />;
                  }

                  return <>--</>;
                }}
              />
              <Column
                title="Action"
                key="status"
                align="center"
                render={(_, row: RowComplaintTypes, index) => {
                  const rowStatus = row?.status;
                  const formStatus = form.getFieldsValue()?.complaints?.[index]?.status;
                  if (
                    row.status === IssueStatus.Not_Picked ||
                    row.status === IssueStatus.In_Progress
                  ) {
                    return (
                      <Button
                        disabled={rowStatus === formStatus}
                        size="small"
                        type="primary"
                        onClick={() => {
                          const statusValue = form.getFieldsValue()?.complaints[index];
                          handleStatusChange(row, statusValue);
                        }}>
                        Change
                      </Button>
                    );
                  } else {
                    return <> -- </>;
                  }
                }}
              />
              <Column
                title=" Info"
                key="info"
                align="center"
                render={(row: RowComplaintTypes) => {
                  if (row.status === IssueStatus.Rejected || row.status === IssueStatus.Resolved) {
                    return (
                      <Button size="small" type="primary" onClick={() => handleStatusPreview(row)}>
                        View
                      </Button>
                    );
                  } else {
                    return <> -- </>;
                  }
                }}></Column>
            </Table>
          )}
        </Form.List>
      </Form>
      {isImagePreviewModalVisible && (
        <ComplaintsMediaPreviewModal
          // images={imagesRef.current}
          id={imagesRef.current as number}
          visible={isImagePreviewModalVisible}
          handleCancel={() => setIsImagePreviewModalVisible(false)}
        />
      )}
      {isResolutionModalVisible && (
        <ComplaintsResolutionsModal
          rowData={assignDataRef.current as AssignDataRefProps}
          visible={isResolutionModalVisible}
          handleActionCancel={() => setIsResolutionModalVisible(false)}
          setIsActionModalVisible={setIsResolutionModalVisible}
        />
      )}
      {isInfoModalVisible && (
        <ComplaintsStatusInfoModal
          data={statusInfoRef.current as RowComplaintTypes}
          visible={isInfoModalVisible}
          handleInfoCancel={() => setIsInfoModalVisible(false)}
        />
      )}
    </>
  );
};

export default Complaints;

const GetOptions = ({
  row,
  index,
  setTest
}: {
  row: RowComplaintTypes;
  index: number;
  setTest: (el: string) => void;
}) => {
  if (row.status === IssueStatus.Not_Picked) {
    return (
      <Form.Item initialValue={row.status} style={{ marginBottom: "0px" }} name={[index, "status"]}>
        <Select size="small" style={{ width: 100 }} onChange={() => setTest(Date.now().toString())}>
          <Option value={IssueStatus.Not_Picked}>{IssueStatus.Not_Picked}</Option>
          <Option value={IssueStatus.In_Progress}>{IssueStatus.In_Progress}</Option>
          <Option value={IssueStatus.Resolved}>{IssueStatus.Resolved}</Option>
          <Option value={IssueStatus.Rejected}>{IssueStatus.Rejected}</Option>
        </Select>
      </Form.Item>
    );
  } else if (row.status === IssueStatus.In_Progress) {
    return (
      <Form.Item initialValue={row.status} style={{ marginBottom: "0px" }} name={[index, "status"]}>
        <Select size="small" style={{ width: 100 }} onChange={() => setTest(Date.now().toString())}>
          <Option value={IssueStatus.In_Progress}>{IssueStatus.In_Progress}</Option>
          <Option value={IssueStatus.Resolved}>{IssueStatus.Resolved}</Option>
          <Option value={IssueStatus.Rejected}>{IssueStatus.Rejected}</Option>
        </Select>
      </Form.Item>
    );
  }
  return <>Invalid</>;
};
