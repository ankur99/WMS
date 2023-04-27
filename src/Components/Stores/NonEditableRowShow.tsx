import { Tag } from "antd";
import { IdName } from "../../types/commonTypes";

import { NonEditableRowShowProps, RowShowInputTypes } from "../../types/updateStoreTypes";
import { tagsColor } from "../../utils/constants";

const NonEditableRowShow = ({ value, type }: NonEditableRowShowProps) => {
  switch (type) {
    case RowShowInputTypes.TEXT:
      return <>{value === null || value === undefined ? "--" : value}</>;
    case RowShowInputTypes.NUMBER:
      return <>{value === null || value === undefined ? "--" : value}</>;
    case RowShowInputTypes.MULTI_TAGS:
      return (
        <>
          {Array.isArray(value) &&
            value?.map((item: IdName) => (
              <Tag color={tagsColor.activeTagColor} key={item.id}>
                {item.name}
              </Tag>
            ))}
        </>
      );
    case RowShowInputTypes.TAG:
      return (
        <>
          {value === true || value === 1 ? (
            <Tag color={tagsColor.successTagColor}>Yes</Tag>
          ) : (
            <Tag color={tagsColor.dangerTagColor}>No</Tag>
          )}
        </>
      );

    default:
      return <>{value === null || value === undefined ? "--" : value}</>;
  }
};

export default NonEditableRowShow;
