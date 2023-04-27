import { useEffect } from "react";
import { Button, Space, Table, Tag } from "antd";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import { Link } from "react-router-dom";
import { ProductData, ProductTags, UseProduct } from "../../types/ProductTypes";
import { getAllProductsFilters, useAllProductsData } from "../../hooks/useRQProducts";
import { onError } from "../../utils/helperFunctions";
import { tagsColor, uomTypes } from "../../utils/constants";
import useTable from "../../hooks/useTable";
import ArrayDataRender from "../../Components/common/ArrayDataRender";
import styles from "./product.module.css";
import { downloadCSVReport } from "../../hooks/useRQCommon";

const { Column } = Table;

const Products = () => {
  const {
    currentPage,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    handleTableChange,
    csvDownloadLoading,
    handleCSVLoading,
    handleReset
  } = useTable();

  const {
    isLoading,
    data,
    refetch
  }: { isLoading: boolean; data: undefined | UseProduct; refetch: () => void } = useAllProductsData(
    {
      currentPage,
      filtersValue: filtersValue,
      onError
    }
  );

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = "api/v1/products/download-csv";
    const filters = getAllProductsFilters(filtersValue);
    if (filters) {
      uri += `?filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: "AllProducts",
      instanceType: "node"
    });
    handleCSVLoading(false);
  };

  return (
    <>
      <div className={styles.buttonWrapper}>
        <Space className={styles.buttons}>
          <Button type="primary" ghost onClick={handleReset}>
            Reset
          </Button>
          <Link to="/home/products/create">
            <Button type="primary">Add Product</Button>
          </Link>
          <Button type="primary" onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Download
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        size="small"
        dataSource={data?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: 15,
          total: data && data?.count ? data?.count : 15,
          showSizeChanger: false
        }}
        loading={isLoading}
        scroll={{ x: 2200 }}>
        <Column
          title="ID"
          dataIndex="id"
          key="id"
          // align="center"
          filteredValue={filtersValue?.id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.id && filtersValue.id[0]) {
              return <HighlightText text={value} highlight={filtersValue.id[0] as string} />;
            }
            return <div>{value}</div>;
          }}
        />
        <Column
          title="NAME"
          dataIndex="name"
          key="name"
          // align="center"
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
              return <HighlightText text={value} highlight={filtersValue.name[0] as string} />;
            }
            return <div>{value}</div>;
          }}
        />
        <Column
          title="BRAND"
          dataIndex="brand"
          key="brand"
          // align="center"
          filteredValue={filtersValue?.brand || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "brand",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.brand && filtersValue.brand[0]) {
              return (
                <HighlightText text={value?.name} highlight={filtersValue.brand[0] as string} />
              );
            }
            return <div>{value?.name}</div>;
          }}
        />
        <Column
          title="GID"
          dataIndex="group_id"
          key="group_id"
          // align="center"
          filteredValue={filtersValue?.group_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "group_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.group_id && filtersValue.group_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.group_id[0] as string} />;
            }
            return <div>{value}</div>;
          }}
        />
        <Column
          title="CL4 ID"
          dataIndex="cl4_id"
          key="cl4_id"
          filteredValue={filtersValue?.cl4_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "cl4_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.cl4_id && filtersValue.cl4_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.cl4_id[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          title="CL4 NAME"
          dataIndex="newCatL4"
          key="newCatL4"
          // align="center"
          filteredValue={filtersValue?.newCatL4 || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "newCatL4",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.newCatL4 && filtersValue.newCatL4[0]) {
              return (
                <HighlightText text={value?.name} highlight={filtersValue.newCatL4[0] as string} />
              );
            }
            return <div>{value?.name}</div>;
          }}
        />
        <Column
          title="CLASS"
          dataIndex="class"
          key="class"
          // align="center"
          filteredValue={filtersValue?.class || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "class",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(_, row: ProductData) => {
            // if (filtersValue.class && filtersValue.class[0]) {
            //   return <HighlightText text={value} highlight={filtersValue.class[0] as string} />;
            // }

            return <div>{row?.warehouseAbc?.class_abc}</div>;
          }}
        />
        <Column
          title="UNIT MRP"
          dataIndex="variants"
          key="mrp"
          render={(_, row: ProductData) => {
            // return (
            //   <div>{row?.warehouseAbc?.unit_mrp && parseInt(row?.warehouseAbc?.unit_mrp)}</div>
            // );
            const variantData = row?.variants;

            for (let i = 0; i < variantData?.length; i++) {
              if (variantData[i]?.value === uomTypes.unit) {
                return variantData[i]?.mrp;
              }
            }

            return "";
          }}
        />
        <Column
          title="MARKETER CODE"
          dataIndex="code"
          key="code"
          // align="center"
          filteredValue={filtersValue?.code || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "code",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.code && filtersValue.code[0]) {
              return <HighlightText text={value} highlight={filtersValue.code[0] as string} />;
            }
            return <div>{value}</div>;
          }}
        />
        <Column title="HSN" dataIndex="hsn_sac_code" key="hsn_sac_code" />
        <Column
          title="BARCODE"
          dataIndex="barcode"
          key="barcode"
          align="center"
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
              return <HighlightText text={value} highlight={filtersValue.barcode[0] as string} />;
            }
            return <div>{value}</div>;
          }}
        />
        <Column
          title="TAX CLASS"
          dataIndex="taxClass"
          key="taxClass"
          align="center"
          filteredValue={filtersValue?.taxClass || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "taxClass",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.taxClass && filtersValue.taxClass[0]) {
              return (
                <HighlightText text={value.name} highlight={filtersValue.taxClass[0] as string} />
              );
            }
            return <div>{value?.name}</div>;
          }}
        />
        <Column
          title="STOCK"
          dataIndex="stock"
          key="stock"
          align="center"
          render={(_, row: ProductData) => {
            return <div>{row?.warehouseAbc?.stock && parseInt(row?.warehouseAbc?.stock)}</div>;
          }}
        />
        <Column
          title="TAGS"
          dataIndex="tags"
          key="tags"
          align="center"
          width={180}
          filteredValue={filtersValue?.tags || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "tags",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value: ProductTags[]) => {
            // if (filtersValue.tags && filtersValue.tags[0]) {
            //   return <HighlightText text={value} highlight={filtersValue.tags[0] as string} />;
            // }
            // return <div>{value?.toString()}</div>;
            return <ArrayDataRender data={value} toShowKey={"name"} />;
          }}
        />
        <Column
          title="PLACEMENT"
          dataIndex="warehouseRacks"
          key="warehouseRacks"
          align="center"
          filteredValue={filtersValue?.warehouseRacks || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "warehouseRacks",
            searchInputRef,
            setSearchText,
            setSearchedColumn
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            // if (filtersValue.placement && filtersValue.placement[0]) {
            //   return <HighlightText text={value} highlight={filtersValue.placement[0] as string} />;
            // }
            return <ArrayDataRender data={value} toShowKey={"reference"} />;
          }}
        />
        <Column
          title="STATUS"
          dataIndex="status"
          key="status"
          filters={[
            {
              text: "Inactive",
              value: 0
            },
            {
              text: "Active",
              value: 1
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            // return record.status.indexOf(value) === 0;
            return true;
          }}
          render={(value) => {
            if (value === 0) {
              return <Tag color={tagsColor.dangerTagColor}>Inactive</Tag>;
            } else if (value === 1) {
              return <Tag color={tagsColor.activeTagColor}>Active</Tag>;
            }
            return <Tag color={tagsColor.warningTagColor}>Invalid</Tag>;
          }}
        />
        <Column
          title="ACTION"
          align="center"
          fixed="right"
          render={(_, record: ProductData) => (
            <Link to={`/home/products/${record.id}`}>
              <Button type="primary" size="small">
                View
              </Button>
            </Link>
          )}
        />
      </Table>
    </>
  );
};

export default Products;
