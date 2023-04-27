import { useEffect } from "react";

import { Button, Space, Table, Tag } from "antd";
import Column from "antd/lib/table/Column";

import { Link } from "react-router-dom";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";

import useTable from "../../hooks/useTable";
import {
  getAllProductsRequestFilters,
  useAllProductRequestsData
} from "../../hooks/useRQProductRequest";
import { onError } from "../../utils/helperFunctions";
import {
  ProductRequestData,
  ProductRequestStatus,
  UseProductRequest
} from "../../types/productRequestTypes";
import { FilterTypes, formatDate, tagsColor } from "../../utils/constants";
import { ProductBrand } from "../../types/ProductTypes";
import styles from "./product.module.css";
import { downloadCSVReport } from "../../hooks/useRQCommon";

const ProductRequest = () => {
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
  }: { isLoading: boolean; data: undefined | UseProductRequest; refetch: () => void } =
    useAllProductRequestsData({
      currentPage,
      filtersValue: filtersValue,
      onError
    });

  useEffect(() => {
    refetch();
  }, [filtersValue]);

  const downloadCSV = async () => {
    handleCSVLoading(true);
    let uri = "api/v1/product-requests/download-csv";
    const filters = getAllProductsRequestFilters(filtersValue);
    if (filters) {
      uri += `?filters=${filters}`;
    }
    await downloadCSVReport({
      uri,
      fileName: "AllProductsRequest",
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
          <Link to="create">
            <Button type="primary">Create</Button>
          </Link>
          <Button type="primary" onClick={downloadCSV} loading={csvDownloadLoading}>
            CSV Download
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        dataSource={data?.results}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: 15,
          total: data && data?.count ? data?.count : 15,
          showSizeChanger: false
        }}
        loading={isLoading}
        scroll={{ x: 1200 }}>
        <Column
          title="ID"
          dataIndex="id"
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
          dataIndex={"product_created_at"}
          title={"Created At"}
          filteredValue={filtersValue.product_created_at || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "product_created_at",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.date
          })}
          onFilter={() => {
            return true;
          }}
          render={(_, row: ProductRequestData) => {
            return formatDate(row?.created_at);
          }}
        />
        <Column
          title="Brand"
          dataIndex="brand"
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
          render={(value: ProductBrand) => {
            if (filtersValue.brand && filtersValue.brand[0]) {
              return (
                <HighlightText text={value?.name} highlight={filtersValue.brand[0] as string} />
              );
            }
            return <div>{value?.name}</div>;
          }}
        />
        <Column
          title="BARCODE"
          dataIndex="barcode"
          // align="center"
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
          title="MRP"
          dataIndex="unit_mrp"
          // align="center"
        />
        <Column
          title="Category"
          dataIndex="category"
          // align="center"
          render={(_, row: ProductRequestData) => {
            return <div>{row?.newCatL4?.name}</div>;
          }}
        />
        <Column
          title="STATUS"
          dataIndex="status"
          key="status"
          filters={[
            {
              text: "Pending",
              value: ProductRequestStatus.pending
            },
            {
              text: "Product Created",
              value: ProductRequestStatus.product_created
            }
          ]}
          filteredValue={filtersValue.status || null}
          filterMultiple={false}
          onFilter={() => {
            // return record.status.indexOf(value) === 0;
            return true;
          }}
          render={(value) => {
            if (value === ProductRequestStatus.pending) {
              return <Tag color={tagsColor.warningTagColor}>Pending</Tag>;
            } else if (value === ProductRequestStatus.product_created) {
              return <Tag color={tagsColor.activeTagColor}>Product Created</Tag>;
            }
            return <Tag color={tagsColor.warningTagColor}>Invalid</Tag>;
          }}
        />
        <Column
          title="ACTION"
          align="center"
          fixed="right"
          render={(_, row: ProductRequestData) => {
            if (row?.status === ProductRequestStatus.product_created) {
              return (
                <Link to={`/home/products/${row.product_id}`}>
                  <Button type="primary" size="small">
                    View Product
                  </Button>
                </Link>
              );
            } else if (row?.status === ProductRequestStatus.pending) {
              return (
                <Link to={`${row.id}`}>
                  <Button type="primary" size="small">
                    View
                  </Button>
                </Link>
              );
            }
            return <p>--</p>;
          }}
        />
      </Table>
    </>
  );
};

export default ProductRequest;
