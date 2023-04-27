import React, { useState } from "react";
import {
  useAllTags,
  useAllWareHouses,
  useStoreDetailsData,
  useAllFranchiseFees
} from "../../../hooks/useRQUpdateStore";

import { Spin } from "antd";

import Paper from "../../common/Paper";
import EditableStoreDetails from "./EditableStoreDetails";
import NonEditableStoreDetails from "./NonEditableStoreDetails";
import { onError } from "../../../utils/helperFunctions";

const StoreDetails = ({ storeId }: { storeId: number }) => {
  const [isEditable, setIsEditable] = useState(false);

  const { isLoading, data: storeDetailsData } = useStoreDetailsData({ storeId, onError });
  const { isLoading: tagsLoading, data: allTagsData } = useAllTags({ onError });
  // const { isLoading: beatsLoading, data: allBeatsData } = useAllBeats({ onError });
  const { isLoading: wareHouseLoading, data: allWareHousesData } = useAllWareHouses({ onError });

  // All Franchisee Fees Data
  const { isLoading: allFranchiseFeesLoading, data: allFranchiseFeesData } = useAllFranchiseFees({
    onError
  });

  const handleEditStoreDetails = (value: boolean) => {
    setIsEditable(value);
  };

  return (
    <Spin spinning={isLoading || tagsLoading || wareHouseLoading || allFranchiseFeesLoading}>
      <Paper>
        {isEditable ? (
          <EditableStoreDetails
            handleEditStoreDetails={handleEditStoreDetails}
            storeDetailsData={storeDetailsData}
            allTagsData={allTagsData?.data?.data}
            allFranchiseFeesData={allFranchiseFeesData}
            // allBeatsData={allBeatsData?.data?.data}
            title="Store Details"
            allWareHousesData={allWareHousesData?.data?.data}
          />
        ) : (
          <NonEditableStoreDetails
            handleEditStoreDetails={handleEditStoreDetails}
            storeDetailsData={storeDetailsData}
            title="Store Details"
          />
        )}
      </Paper>
    </Spin>
  );
};

export default StoreDetails;
