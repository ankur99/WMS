import {
  AttributesDataReceived,
  MiscInfoDataReceived,
  MiscInfoForm,
  ProductAttributesForm,
  ProductAttributesGet,
  ProductData,
  ProductGroupForm,
  ProductTags
  // WarehouseRack
} from "../../types/ProductTypes";
import { getKeyLabelFromIdName } from "../../utils/helperFunctions";

export const checkIfNoDataPresent = (data: Record<string, any>) => {
  if (!data || Object.keys(data)?.length === 0) {
    return false;
  }
  return true;
};

export const sanitizeBasicInfoProductData = (productData: ProductData) => {
  if (!checkIfNoDataPresent(productData)) return undefined;
  // basic info sanitization
  const name = productData.name;
  const description = productData.description;
  const type = productData.type;
  // const hsn_sac = {
  //   key: productData.hsn_sac_code,
  //   // label: productData.hsn_sac_name
  //   label: productData.hsn_sac_code + " " + productData.description
  // };
  const hsn_sac = productData?.hsn_sac_code
    ? {
        key: productData.hsn_sac_code,
        label: productData.hsn_sac_code
      }
    : null;
  const brand = {
    key: productData.brand?.id ? productData.brand?.id.toString() : "",
    label: productData.brand?.name
  };
  const taxClass = {
    key: productData.taxClass ? productData.taxClass.id.toString() : "",
    label: productData.taxClass ? productData.taxClass.name : ""
  };
  const tags = productData.tags?.map((tag: ProductTags) => getKeyLabelFromIdName(tag));
  const status = productData.status;
  const barcode = productData.barcode;
  const code = productData.code;
  // const allow_back_orders = productData.allow_back_orders === 1 ? true : false;
  const uom = productData.uom;
  // const racks = productData?.warehouseRacks?.map((rack: WarehouseRack) => {
  //   return {
  //     key: "" + rack.id,
  //     label: rack.reference
  //   };
  // });
  const min_price = productData.min_price;
  const mrp = productData.mrp;

  return {
    name,
    description,
    type,
    hsn_sac,
    brand,
    taxClass,
    tags,
    status,
    barcode,
    code,
    // allow_back_orders,
    uom,
    // racks
    min_price,
    mrp
  };
};

export const sanitizeAttributesProductData = (attributeData: AttributesDataReceived) => {
  if (!checkIfNoDataPresent(attributeData)) return undefined;

  const sanitizedAttributeData = attributeData?.data?.map((attribute: ProductAttributesGet) => {
    return {
      value: attribute.value,
      attribute: {
        key: attribute.id,
        label: attribute.name
      }
    };
  });

  return {
    attributes: sanitizedAttributeData as unknown as ProductAttributesForm[]
  };
};

export const sanitizeProductGroupProductData = (productData: ProductData) => {
  if (!checkIfNoDataPresent(productData)) return undefined;

  return {
    group: productData.group?.id
      ? {
          key: productData.group?.id ? productData.group?.id.toString() : "",
          label: productData.group?.name
        }
      : undefined,
    // cl2: productData.cl2?.id
    //   ? {
    //       key: productData.cl2?.id ? productData.cl2?.id.toString() : "",
    //       label: productData.cl2?.name
    //     }
    //   : undefined,
    cl4: productData.newCatL4
      ? {
          key: productData.newCatL4?.id ? productData.newCatL4?.id.toString() : "",
          label: productData.newCatL4?.name
        }
      : undefined
  } as unknown as ProductGroupForm;
};

export const sanitizeMiscInfoProductData = (
  productData: ProductData,
  miscInfoData: MiscInfoDataReceived | undefined
) => {
  if (!checkIfNoDataPresent(productData)) return undefined;

  return {
    account: miscInfoData?.account,
    is_app_saleable: productData?.is_app_saleable,
    is_pos_saleable: productData?.is_pos_saleable,
    is_returnable: productData?.is_returnable,
    misc_info: miscInfoData?.misc_info,
    sales_info: miscInfoData?.sales_info
  } as unknown as MiscInfoForm;
};
