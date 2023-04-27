import { useRef, useState } from "react";
import { Form, Button, Table, Space, Popconfirm } from "antd";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";

import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import { onError, showSuccessToast } from "../../utils/helperFunctions";
import {
  useAllItemTypes,
  useAllMaterials,
  useChangeCrateTemplateStatus,
  useCrateTemplateData,
  useDeleteCrateTemplate
} from "../../hooks/useCrateTemplate";
import { CrateTemplateTypes } from "../../types/crateTemplateTypes";
import { FilterTypes } from "../../utils/constants";

const { Column } = Table;
const toolTipTextDelete = "Are you sure, you want to Delete?";

const CrateTemplate = () => {
  //needed so that I can use getFieldsValue
  const [form] = Form.useForm();

  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    name: null,
    material: null,
    type: null
  });

  const searchInputRef = useRef<HTMLInputElement>();

  const { isLoading, data: crateTemplateData } = useCrateTemplateData({
    currentPage,
    onError,
    name: filtersValue.name && (filtersValue.name[0] as string | null),
    material: filtersValue.material && (filtersValue.material[0] as string | null),
    type: filtersValue.type && (filtersValue.type[0] as string | null)
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    // console.log({ pagination, filters, seachedColumn, searchText });

    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);
  };

  const { isLoading: deleteLoading, mutate: deleteCrate } = useDeleteCrateTemplate({
    onError,
    onSuccess: showSuccessToast
  });

  const handleDeleteCrate = (id: number) => {
    deleteCrate({ id });
  };

  const { isLoading: statusLoading, mutate: statusChangeCrate } = useChangeCrateTemplateStatus({
    onError,
    onSuccess: showSuccessToast
  });

  const handleChangeStatus = ({
    id,
    status
  }: {
    id: number;
    status: "activate" | "deactivate";
  }) => {
    statusChangeCrate({ id, status });
  };

  const { isLoading: isLoadingMaterials, data: allMaterials } = useAllMaterials({
    onError
  });

  const { isLoading: isLoadingItemTypes, data: allItemTypes } = useAllItemTypes({
    onError
  });

  return (
    <Form
      form={form}
      preserve={false}
      name="dynamic_form_nest_item"
      // onFinish={onFinish}
      autoComplete="off"
      style={{ overflow: "auto" }}>
      <Form.List name="crateTemplates">
        {() => (
          <>
            <Table
              dataSource={crateTemplateData?.data}
              onChange={handleTableChange}
              pagination={{
                current: currentPage,
                pageSize: 15,
                total:
                  crateTemplateData && crateTemplateData?.meta?.total
                    ? crateTemplateData?.meta?.total
                    : 15,
                showSizeChanger: false
              }}
              loading={
                isLoading ||
                deleteLoading ||
                statusLoading ||
                isLoadingMaterials ||
                isLoadingItemTypes
              }>
              <Column
                dataIndex={"name"}
                title={"Template Name"}
                filteredValue={filtersValue?.name || null}
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
                dataIndex={"dimensions"}
                title={"Dimension (in inches)"}
                render={(value) => {
                  return <>{value}</>;
                }}
              />
              <Column
                dataIndex={"material"}
                title={"Material"}
                filteredValue={filtersValue?.material || null}
                {...getColumnSearchPropsForTable({
                  dataIndex: "material",
                  searchInputRef,
                  setSearchText,
                  setSearchedColumn,
                  filterType: FilterTypes.select,
                  selectData: allMaterials
                })}
                onFilter={() => {
                  return true;
                }}
                render={(value) => {
                  if (filtersValue.material && filtersValue.material[0]) {
                    return (
                      <HighlightText text={value} highlight={filtersValue.material[0] as string} />
                    );
                  }
                  return <>{value}</>;
                }}
              />
              <Column
                dataIndex={"type"}
                title={"Item Used"}
                filteredValue={filtersValue?.type || null}
                {...getColumnSearchPropsForTable({
                  dataIndex: "type",
                  searchInputRef,
                  setSearchText,
                  setSearchedColumn,
                  filterType: FilterTypes.select,
                  selectData: allItemTypes
                })}
                onFilter={() => {
                  return true;
                }}
                render={(value) => {
                  if (filtersValue.type && filtersValue.type[0]) {
                    return (
                      <HighlightText text={value} highlight={filtersValue.type[0] as string} />
                    );
                  }
                  return <>{value}</>;
                }}
              />
              <Column
                dataIndex={"color"}
                title={"Color"}
                render={(value) => {
                  return value;
                }}
              />
              <Column
                title={"Action"}
                dataIndex={"action"}
                fixed={"right"}
                align="center"
                render={(value, row: CrateTemplateTypes) => {
                  if (row.status === 1) {
                    return (
                      <Space>
                        <Button
                          type="link"
                          // style={{ borderRight: "1px solid #f0f0f0" }}
                          onClick={() => handleChangeStatus({ id: row.id, status: "deactivate" })}>
                          Make Inactive
                        </Button>
                        {/* <Popconfirm
                          title={toolTipTextDelete}
                          onConfirm={() => handleDeleteCrate(row.id)}
                          okText="Yes"
                          cancelText="No">
                          <Button type="text" danger>
                            Delete
                          </Button>
                        </Popconfirm> */}
                      </Space>
                    );
                  }
                  return (
                    <Space>
                      <Button
                        type="link"
                        // style={{ borderRight: "1px solid #f0f0f0" }}
                        onClick={() => handleChangeStatus({ id: row.id, status: "activate" })}>
                        Make Active
                      </Button>
                      {/* <Popconfirm
                        title={toolTipTextDelete}
                        onConfirm={() => handleDeleteCrate(row.id)}
                        okText="Yes"
                        cancelText="No">
                        <Button type="text" danger>
                          Delete
                        </Button>
                      </Popconfirm> */}
                    </Space>
                  );
                }}
              />
            </Table>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default CrateTemplate;
