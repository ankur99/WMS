import { Button, Space, Table } from "antd";
import Column from "antd/lib/table/Column";

import { useState } from "react";
import { useParams } from "react-router-dom";
import getColumnSearchPropsForTable from "../../Components/common/ColumnSearchPropsForTable";
import HighlightText from "../../Components/common/HighlightText";
import PODPreviewModal from "../../Components/modals/PODPreviewModal";
import UploadImagesPOD from "../../Components/modals/UploadImagesPOD";
import { DownoadDropdown } from "../../Components/ProofOfDelivery/DownloadButtonDropdown";
import { downloadPodListImages, useFetchStoresPod } from "../../hooks/useRQStores";
import useTable from "../../hooks/useTable";
import { ReasonTypes, StoreApiRecievedData, StoreResultDataTypes } from "../../types/podTypes";
import { FilterTypes, formatDate } from "../../utils/constants";
import { onError, onErrorNotification, showSuccessToast } from "../../utils/helperFunctions";

const ProofOfDelivery = () => {
  const { storeId } = useParams();

  const {
    currentPage,
    setSearchText,
    setSearchedColumn,
    searchInputRef,
    filtersValue,
    pageSize,
    handleTableChange
  } = useTable({
    // sedning initial filter values as storeId which we get from query parameters.
    initialFiltersValue: storeId
      ? {
          store_id: [`${storeId}`]
        }
      : {}
  });

  const [podPreviewModalVisible, setPodPreviewModalVisible] = useState(false);
  const [uploadStorePodModalVisible, setUploadStorePodModalVisible] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [shipmentId, setShipmentId] = useState<string>();

  const {
    isLoading,
    data: storeData
  }: {
    isLoading: boolean;
    data: StoreApiRecievedData | undefined;
  } = useFetchStoresPod({
    currentPage,
    filtersValue,
    pageSize,
    onError
  });

  const handlePreviewPod = (rowShipmentId: number) => {
    if (storeData?.results) {
      setShipmentId(rowShipmentId.toString());
    }
    setPodPreviewModalVisible(true);
  };

  const uploadImages = (rowShipmentId: number) => {
    setShipmentId(rowShipmentId.toString());
    setUploadStorePodModalVisible(true);
  };

  const handleDownload = async (args: number) => {
    setIsDataLoading(true);
    try {
      const res = await downloadPodListImages(args, filtersValue);
      if (res.status) {
        showSuccessToast("POD list downloaded successfully check Downloads section in sidebar");
        return;
      }
    } catch (error: any) {
      onErrorNotification(error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleUpload = () => {
    setShipmentId("");
    setUploadStorePodModalVisible(true);
  };

  return (
    <>
      <div className="buttonWrapper">
        <Space className="buttons">
          <Button type="primary" onClick={handleUpload}>
            Upload
          </Button>
          <DownoadDropdown
            isLoading={isDataLoading}
            handleDownload={handleDownload}
            arrayData={[
              { key: 0, args: 0, name: "All POD" },
              { key: 1, args: 1, name: "Finance" }
            ]}
          />
        </Space>
      </div>

      <Table
        dataSource={storeData?.results}
        loading={isLoading}
        rowKey="shipment_id"
        scroll={{ x: 1300 }}
        onChange={handleTableChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: storeData && storeData?.count ? storeData?.count : 15,
          showSizeChanger: true
        }}>
        <Column
          dataIndex={"store_id"}
          title={"Store Id"}
          filteredValue={filtersValue.store_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "store_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.store_id && filtersValue.store_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.store_id[0] as string} />;
            }
            return <>{value}</>;
          }}
        />

        <Column
          title={"Store Name"}
          key="store_name"
          dataIndex="store_name"
          filteredValue={filtersValue.store_name || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "store_name",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.input
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.store_name && filtersValue.store_name[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.store_name[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title={"Order Id"}
          dataIndex="order_id"
          filteredValue={filtersValue.order_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "order_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.order_id && filtersValue.order_id[0]) {
              return <HighlightText text={value} highlight={filtersValue.order_id[0] as string} />;
            }
            return <>{value}</>;
          }}
        />
        <Column
          title={"Shipment Id"}
          dataIndex="shipment_id"
          filteredValue={filtersValue.shipment_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "shipment_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.inputNumber
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.shipment_id && filtersValue.shipment_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.shipment_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />

        <Column
          title={"NT Order Id"}
          dataIndex="nt_order_id"
          filteredValue={filtersValue.nt_order_id || null}
          {...getColumnSearchPropsForTable({
            dataIndex: "nt_order_id",
            searchInputRef,
            setSearchText,
            setSearchedColumn,
            filterType: FilterTypes.input
          })}
          onFilter={() => {
            return true;
          }}
          render={(value) => {
            if (filtersValue.nt_order_id && filtersValue.nt_order_id[0]) {
              return (
                <HighlightText text={value} highlight={filtersValue.nt_order_id[0] as string} />
              );
            }
            return <>{value}</>;
          }}
        />
        <Column
          title={"Created At"}
          dataIndex="shipment_created_at"
          render={(value) => {
            return formatDate(value);
          }}
        />
        <Column
          title="Reason"
          dataIndex={"reason"}
          filters={[
            {
              text: ReasonTypes.NOT_CLEAR,
              value: ReasonTypes.NOT_CLEAR
            },
            {
              text: ReasonTypes.NOT_UPLOADED,
              value: ReasonTypes.NOT_UPLOADED
            }
          ]}
          filteredValue={filtersValue?.reason || null}
          filterMultiple={false}
          onFilter={() => {
            return true;
          }}
        />
        <Column
          title={"Action"}
          align="center"
          fixed="right"
          width={200}
          render={(row: StoreResultDataTypes) => {
            const rowShipmentId = row?.shipment_id;

            return (
              <Space size="small">
                {row?.shipment_has_pod_image == true && (
                  <Button type="link" size="small" onClick={() => handlePreviewPod(rowShipmentId)}>
                    View POD
                  </Button>
                )}
                <Button type="link" size="small" onClick={() => uploadImages(rowShipmentId)}>
                  Upload
                </Button>
              </Space>
            );
          }}
        />
      </Table>
      {podPreviewModalVisible && (
        <PODPreviewModal
          visible={podPreviewModalVisible}
          handleCancel={() => setPodPreviewModalVisible(false)}
          shipment_id={shipmentId as string}
        />
      )}
      {uploadStorePodModalVisible && (
        <UploadImagesPOD
          visible={uploadStorePodModalVisible}
          handleCancel={() => setUploadStorePodModalVisible(false)}
          setUploadStorePodModalVisible={setUploadStorePodModalVisible}
          shipment_id={shipmentId}
        />
      )}
    </>
  );
};

export default ProofOfDelivery;
