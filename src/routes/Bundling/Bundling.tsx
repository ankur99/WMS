import { useState, useRef } from "react";
import { Table, Space, Button, Tag, Tooltip, Form, InputNumber, Popconfirm } from "antd";
import { FilterValue, TablePaginationConfig } from "antd/lib/table/interface";

import { useNavigate } from "react-router-dom";

import { useBundling, useDeleteRecipe } from "../../hooks/useRQBundling";
import styles from "./bundling.module.css";

import { onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";
import BundlingRecipeModal from "../../Components/modals/BundlingRecipeModal";
import BundlingExecuteModal from "../../Components/modals/BundlingExecuteModal";
import { BundlingProp, RecipeCreateAndEditProps } from "../../types/bundlingTypes";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import BundlingPublishModal from "../../Components/modals/BundlingPublishModal";
import { FilterTypes, tagsColor } from "../../utils/constants";

const { Column } = Table;

const Bundling = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRecipeCreateModalVisible, setIsRecipeCreateModalVisible] = useState(false);
  const [isRecipeEditModalVisible, setIsRecipeEditModalVisible] = useState(false);
  const [isRecipeExecuteModalVisible, setIsRecipeExecuteModalVisible] = useState(false);
  const [isRecipePublishModalVisible, setIsRecipePublishModalVisible] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>();
  const [, setSearchText] = useState("");
  const [, setSearchedColumn] = useState("");
  const [filtersValue, setFiltersValue] = useState<Record<string, FilterValue | null>>({
    id: null,
    name: null,
    status: null,
    pid: null,
    productId: null
  });

  const useRefData = useRef<BundlingProp>();
  const useRefPublishData = useRef<number | undefined>();

  const navigate = useNavigate();

  const {
    isLoading,
    isFetching,
    data: bundlingData
    // refetch
  } = useBundling({
    currentPage,
    id: filtersValue.id && (filtersValue.id[0] as string | null),
    name: filtersValue.name && (filtersValue.name[0] as string | null),
    status: filtersValue.status && (filtersValue.status[0] as string | null),
    pid: filtersValue.pid as string | null,
    productId: filtersValue.productId && (filtersValue.productId[0] as string | null),
    onError: onErrorNotification
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    // console.log({ pagination, filters });
    const newPage = pagination?.current || 1;
    setCurrentPage(newPage);
    setFiltersValue(filters);
  };

  const handleRecipeCreation = () => {
    setIsRecipeCreateModalVisible(false);
  };

  const handleEdit = (index: number) => {
    if (bundlingData?.data && bundlingData?.data?.[index]) {
      useRefData.current = bundlingData.data[index] as unknown as BundlingProp;
      // console.log("execute clicked", useRefExecuteData.current);
      setIsRecipeEditModalVisible(true);
    }
  };

  const handlePublish = (id: number) => {
    useRefPublishData.current = id;
    setIsRecipePublishModalVisible(true);
  };

  const handleExecute = (index: number) => {
    if (bundlingData?.data && bundlingData?.data?.[index]) {
      useRefData.current = bundlingData.data[index] as unknown as BundlingProp;
      // console.log("execute clicked", useRefExecuteData.current);
      setIsRecipeExecuteModalVisible(true);
    }
  };

  const handlePastData = (id: number) => {
    navigate(`/home/bundling/create/${id}`);
  };

  const handleSearchRecipeByPID = (value: { pid: string }) => {
    setFiltersValue((prev) => {
      return {
        ...prev,
        pid: value?.pid?.toString() as unknown as FilterValue
      };
    });
  };

  // Delete Recipe
  const { isLoading: recipeDeleteLoading, mutate: deleteRecipe } = useDeleteRecipe({
    onError: onErrorNotification,
    onSuccess: showSuccessToast
  });

  const handleDeleteRecipe = (id: number) => {
    deleteRecipe({ id });
  };

  return (
    <>
      <div className={styles.recipeCreateWrapper}>
        <div className={styles.recipeCreate} style={{ textAlign: "right", marginRight: "1rem" }}>
          {bundlingData?.["can-update"] ? (
            <Button type="primary" onClick={() => setIsRecipeCreateModalVisible(true)}>
              Recipe Create
            </Button>
          ) : (
            <ToolTipButton title={"Recipe Create"} />
          )}
        </div>
      </div>
      <Form
        name="searchByPID"
        layout="inline"
        onFinish={handleSearchRecipeByPID}
        // onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item label="Search By PID" name={"pid"}>
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="id"
        className="m1-t"
        dataSource={bundlingData?.data}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: 15,
          total: bundlingData && bundlingData?.meta.total ? bundlingData?.meta.total : 15,
          showSizeChanger: false
        }}
        loading={isLoading || isFetching || recipeDeleteLoading}>
        <Column
          dataIndex={"id"}
          title={"ID"}
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
          dataIndex={"productId"}
          title={"Bundle PID"}
          align="center"
          filteredValue={filtersValue.productId || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "productId",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.bundleProductId && filtersValue.bundleProductId[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.bundleProductId[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          dataIndex={"name"}
          title={"Name"}
          align="center"
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
              return <HighlightText text={value} highlight={filtersValue.name[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          dataIndex={"status"}
          title={"Status"}
          align="center"
          filters={[
            {
              text: "Published",
              value: "published"
            },
            {
              text: "Unpublished",
              value: "unpublished"
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
          render={(value: string, row: BundlingProp) => {
            if (row?.deleted_at) {
              return <Tag color={tagsColor.dangerTagColor}>Deleted</Tag>;
            } else if (value === "published") {
              return <Tag color={tagsColor.activeTagColor}>Published</Tag>;
            } else if (value === "unpublished") {
              return <Tag color={tagsColor.warningTagColor}>Unpublished</Tag>;
            }
            return <Tag color={tagsColor.disabledTagColor}>Status Invalid</Tag>;
          }}
        />
        <Column
          title={"Action"}
          dataIndex={"action"}
          align="center"
          render={(_, row: BundlingProp, index) => {
            return (
              <BundlingAction
                row={row}
                index={index}
                handleEdit={handleEdit}
                bundlingData={bundlingData}
                handlePublish={handlePublish}
                handleExecute={handleExecute}
                handlePastData={handlePastData}
                handleDeleteRecipe={handleDeleteRecipe}
              />
            );
          }}
        />
      </Table>
      {isRecipeCreateModalVisible && (
        <BundlingRecipeModal
          visible={isRecipeCreateModalVisible}
          handleCancel={() => setIsRecipeCreateModalVisible(false)}
          handleOk={handleRecipeCreation}
          loading={false}
          title="Recipe Create"
        />
      )}
      {isRecipeEditModalVisible && (
        <BundlingRecipeModal
          visible={isRecipeEditModalVisible}
          handleCancel={() => setIsRecipeEditModalVisible(false)}
          handleOk={() => setIsRecipeEditModalVisible(false)}
          loading={false}
          title="Recipe Edit"
          // initialValues={useRefData.current}
          initialValues={formatAccordingToFrontend(useRefData?.current as RecipeCreateAndEditProps)}
        />
      )}

      {isRecipeExecuteModalVisible && (
        <BundlingExecuteModal
          visible={isRecipeExecuteModalVisible}
          handleCancel={() => setIsRecipeExecuteModalVisible(false)}
          handleOk={() => setIsRecipeExecuteModalVisible(false)}
          loading={false}
          title="Recipe Execute"
          data={useRefData?.current}
        />
      )}
      {isRecipePublishModalVisible && (
        <BundlingPublishModal
          visible={isRecipePublishModalVisible}
          handleCancel={() => setIsRecipePublishModalVisible(false)}
          handleOk={() => setIsRecipePublishModalVisible(false)}
          title="Recipe Publish"
          id={useRefPublishData?.current as number}
        />
      )}
    </>
  );
};

export default Bundling;

const formatAccordingToFrontend = (values: RecipeCreateAndEditProps) => {
  // const discount = values.items?.[0]?.discount;

  const payload = {
    ...values
    // discount
  };
  return payload;
};

const toolTipTextTemp = "You don't have the access!";

const ToolTipButton = ({
  title,
  tooltipText = toolTipTextTemp
}: {
  title: string;
  tooltipText?: string;
}) => {
  return (
    <Tooltip title={tooltipText} color="orange">
      <Button type="primary" disabled>
        {title}
      </Button>
    </Tooltip>
  );
};

interface BundlingDataProps {
  "can-update": true;
  "can-execute": true;
  "can-publish": true;
}
interface BundlingActionProps {
  row: BundlingProp;
  index: number;
  handleEdit: (index: number) => void;
  bundlingData: BundlingDataProps;
  handlePublish: (id: number) => void;
  handleExecute: (index: number) => void;
  handlePastData: (id: number) => void;
  handleDeleteRecipe: (id: number) => void;
}

const BundlingAction = ({
  row,
  index,
  handleEdit,
  bundlingData,
  handlePublish,
  handleExecute,
  handlePastData,
  handleDeleteRecipe
}: BundlingActionProps) => {
  if (row?.deleted_at) {
    return (
      <Button
        type="link"
        onClick={() => handlePastData(row.id)}
        style={{ background: "#069A8E", color: "white" }}>
        Past Data
      </Button>
    );
  } else if (row?.status === "unpublished") {
    return (
      <Space>
        {bundlingData?.["can-update"] ? (
          <Button
            type="link"
            onClick={() => handleEdit(index)}
            style={{ background: "#f50", color: "white" }}>
            Edit
          </Button>
        ) : (
          <ToolTipButton title={"Edit"} />
        )}

        {bundlingData?.["can-publish"] ? (
          <Button
            type="link"
            style={{ background: "#2db7f5", color: "white" }}
            onClick={() => handlePublish(row.id)}>
            Publish
          </Button>
        ) : (
          <ToolTipButton title={"Publish"} />
        )}
      </Space>
    );
  } else if (row?.status === "published") {
    return (
      <Space>
        {bundlingData?.["can-execute"] ? (
          <Button
            type="link"
            onClick={() => handleExecute(index)}
            style={{ background: "#87d068", color: "white" }}>
            Execute
          </Button>
        ) : (
          <ToolTipButton title={"Execute"} />
        )}

        <Button
          type="link"
          onClick={() => handlePastData(row.id)}
          style={{ background: "#069A8E", color: "white" }}>
          Past Data
        </Button>
        {bundlingData?.["can-publish"] ? (
          <Popconfirm title="Are you sure？" onConfirm={() => handleDeleteRecipe(row.id)}>
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <ToolTipButton title={"Delete"} />
        )}
      </Space>
    );
  }
  return <>--</>;
};
