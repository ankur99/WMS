import { Spin } from "antd";
import { useState } from "react";
import { useBusinessDetailsData } from "../../../hooks/useRQUpdateStore";
import { onError } from "../../../utils/helperFunctions";

import Paper from "../../common/Paper";
import EditableBusinessDetails from "./EditableBusinessDetails";
import NonEditableBusinessDetails from "./NonEditableBusinessDetails";

const BusinessDetails = ({ storeId }: { storeId: number }) => {
  const [isEditable, setIsEditable] = useState(false);

  const { isLoading, data: businessDetailsData } = useBusinessDetailsData({ storeId, onError });

  const handleEditBusinessDetails = (value: boolean) => {
    setIsEditable(value);
  };
  return (
    <Spin spinning={isLoading}>
      <Paper>
        {isEditable ? (
          <EditableBusinessDetails
            handleEditBusinessDetails={handleEditBusinessDetails}
            businessDetailsData={businessDetailsData?.data?.data}
            title="Business Details"
          />
        ) : (
          <NonEditableBusinessDetails
            handleEditBusinessDetails={handleEditBusinessDetails}
            businessDetailsData={businessDetailsData?.data?.data}
            title="Business Details"
          />
        )}
      </Paper>
    </Spin>
  );
};

export default BusinessDetails;
