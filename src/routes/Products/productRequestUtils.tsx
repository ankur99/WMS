import { ProductRequestReceived } from "../../types/productRequestTypes";
import { getKeyLabelFromIdName } from "../../utils/helperFunctions";

export const sanitizeBasicInfoProductRequestData = (productRequestData: ProductRequestReceived) => {
  const name = productRequestData.name;
  const description = productRequestData.description;
  const unit_mrp = productRequestData?.unit_mrp;
  const brand = productRequestData?.brand
    ? getKeyLabelFromIdName(productRequestData.brand)
    : undefined;
  const group = productRequestData?.group
    ? getKeyLabelFromIdName(productRequestData.group)
    : undefined;
  const cl4 = productRequestData?.newCatL4
    ? getKeyLabelFromIdName(productRequestData.newCatL4)
    : undefined;
  const hsn_sac = productRequestData?.hsn_code
    ? { key: productRequestData?.hsn_code, label: productRequestData?.hsn_code }
    : undefined;
  return {
    name,
    description,
    unit_mrp,
    brand,
    group,
    cl4,
    hsn_sac
  };
};
