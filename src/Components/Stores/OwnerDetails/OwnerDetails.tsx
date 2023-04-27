import { useState } from "react";
import { Spin } from "antd";
import { useOwnerDetailsData } from "../../../hooks/useRQUpdateStore";
import { onError } from "../../../utils/helperFunctions";

import Paper from "../../common/Paper";
import EditableOwnerDetails from "./EditableOwnerDetails";
import NonEditableOwnerDetails from "./NonEditableOwnerDetails";

const OwnerDetails = ({ storeId }: { storeId: number }) => {
  const [isEditable, setIsEditable] = useState(false);

  const { isLoading, data: ownerDetailsData } = useOwnerDetailsData({ storeId, onError });

  const handleEditOwnerDetails = (value: boolean) => {
    setIsEditable(value);
  };

  return (
    <Spin spinning={isLoading}>
      <Paper>
        {isEditable ? (
          <EditableOwnerDetails
            handleEditOwnerDetails={handleEditOwnerDetails}
            ownerDetailsData={ownerDetailsData}
            title="Owner Details"
          />
        ) : (
          <NonEditableOwnerDetails
            handleEditOwnerDetails={handleEditOwnerDetails}
            ownerDetailsData={ownerDetailsData}
            title="Owner Details"
          />
        )}
      </Paper>
    </Spin>
  );
};

export default OwnerDetails;
