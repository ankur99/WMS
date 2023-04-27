import { Spin, Form, Row, Col, Button, Divider, InputNumber } from "antd";
import Paper from "../../Components/common/Paper";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import EditableRowShow from "../../Components/Stores/EditableRowShow";
import { RowShowInputTypes } from "../../types/updateStoreTypes";
import {
  fetchProductListNode,
  fetchVendorAddressFromGSTIN,
  fetchVendorAddressFromVendorId,
  fetchVendorsList
} from "../../api/fetchListApi";
import { useEffect, useRef, useState } from "react";
import { useCreateNonInventoryInvoicing } from "../../hooks/useRQNonInventoryInvoicing";
import { onErrorNotification, showErrorToast, showSuccessToast } from "../../utils/helperFunctions";
import {
  AddressDBType,
  AddressType,
  GstinType,
  NonInventoryInvoicingFormValues,
  NonInventoryInvoicingPayloadType,
  ProductType,
  VendorAddressType
} from "../../types/nonInventoryInvoicingTypes";
import { useNavigate } from "react-router-dom";

const { List } = Form;

const CreateNonInventoryInvoice = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [billingAddressData, setBillingAddressData] = useState<AddressType[]>([]);
  const [shippingAddressData, setShippingAddressData] = useState<AddressType[]>([]);
  const searchedVendorsRef = useRef<VendorAddressType[]>();
  const searchedProductsRef = useRef<{
    index: number;
    results: Record<number, ProductType[]>;
  }>();
  // This ref is to store products data from api, along with the index of the current product in the form list.
  // Using this ref, the value of mrp is populated when the user is editing a product

  const onSuccess = () => {
    showSuccessToast("Non Inventory Invoice Created Successfully");
    form.resetFields();
    navigate(-1);
  };

  const { isLoading: createNonInventoryInvoicingLoading, mutate: createNonInventoryInvoicing } =
    useCreateNonInventoryInvoicing({
      onError: onErrorNotification,
      onSuccess
    });

  const onFinish = (values: NonInventoryInvoicingFormValues) => {
    // Loop to check for duplicate items in the products array (form list)
    for (let i = 0; i < values?.["products"]?.length; i++) {
      for (let j = i + 1; j < values?.["products"]?.length; j++) {
        if (values?.["products"][i]?.product?.value === values?.["products"][j]?.product?.value) {
          showErrorToast("Duplicate Products are not allowed");
          return;
        }
      }
    }

    const products = [];

    for (let i = 0; i < values?.products?.length; i++) {
      // Loop to send only those products where the user has selected a product
      if (values?.products[i]?.product?.value) {
        products.push({
          product_id: values?.products[i]?.product?.value,
          quantity: values?.products[i]?.qty,
          selling_price: values?.products[i]?.selling_price
        });
      }
    }

    let shipping_state_id;

    if (values["same-as-billing-address"]) {
      shipping_state_id = values["shipping-address"]?.value;
    }
    if (!values["same-as-billing-address"]) {
      shipping_state_id = values["shipping-address"];
    }

    // Returning the user if there are no products added
    if (!products.length) {
      showErrorToast("Please add atleast one product!");
      return;
    }

    const payload: NonInventoryInvoicingPayloadType = {
      gstin: values?.vendor?.value?.split(" ")[0],
      vendor_id: +values?.vendor?.value?.split(" ")[1],
      billing_state_id: values?.["billing-address"],
      shipping_state_id,
      products
    };
    createNonInventoryInvoicing(payload);
  };

  const selectedVendor = Form.useWatch("vendor", form);
  const products = Form.useWatch("products", form);
  const billingAddress = Form.useWatch("billing-address", form);
  const isSameAsBillingAddress = Form.useWatch("same-as-billing-address", form);

  useEffect(() => {
    // If user has selected a vendor, then getting the gstin and vendor_id from the value of the debounce select (concating it with whitespace)
    if (selectedVendor) {
      const gstin = selectedVendor?.value?.split(" ")[0];
      const vendor_id = selectedVendor?.value?.split(" ")[1];
      if (searchedVendorsRef?.current && searchedVendorsRef.current.length) {
        // From selected vendor data, populating the vendor name field. When the vendor changes resetting the billing and shipping address
        const selectedVendorData = searchedVendorsRef.current.find((vendor: VendorAddressType) => {
          return vendor.vendor_id === +vendor_id;
        });
        if (selectedVendorData) {
          form.setFieldsValue({
            "vendor-name": selectedVendorData?.vendor_name
          });
          form.setFieldsValue({
            "billing-address": null,
            "shipping-address": null
          });
        }
      }
      // Automatically selecting the billing address from vendor id and and selected GSTIN
      // For getting the address from the vendor_id and gstin (For billing address)
      fetchVendorAddressFromGSTIN(vendor_id, gstin).then((res) => {
        const beautified_res = res?.map((item: AddressDBType) => {
          return {
            id: item?.id,
            name: item?.full_address
          };
        });
        setBillingAddressData(beautified_res);
        setShippingAddressData([]);
      });
    }
    // Resetting the fields when selected vendor is deselected
    if (!selectedVendor) {
      form.setFieldsValue({
        "vendor-name": null,
        "billing-address": null,
        "shipping-address": null
      });
    }
  }, [selectedVendor]);

  useEffect(() => {
    // if billing and shipping address is same, setting the shipping address to same as billing address
    if (billingAddress && isSameAsBillingAddress) {
      form.setFieldsValue({
        "shipping-address": {
          label: billingAddressData.find((item: AddressType) => item?.id === +billingAddress)?.name,
          value: billingAddress
        }
      });
    }
    // If billing and shipping address is not same, reset the shipping address.
    if (!isSameAsBillingAddress) {
      form.setFieldsValue({
        "shipping-address": null
      });
      // Fetching all the address from vendor id, to give user options to select shipping address from all the available adresses
      const vendor_id = selectedVendor?.value?.split(" ")[1];
      if (billingAddress && !shippingAddressData.length) {
        fetchVendorAddressFromVendorId(vendor_id).then((res) => {
          const beautified_res = res?.map((item: AddressDBType) => {
            return {
              id: item?.id,
              name: item?.full_address
            };
          });
          setShippingAddressData(beautified_res);
        });
      }
    }
  }, [billingAddress, isSameAsBillingAddress]);

  useEffect(() => {
    // If the data of products from the api call stored in the products ref is there, enter inside the useEffect
    if (searchedProductsRef?.current) {
      const current_product = products?.[searchedProductsRef.current?.index]; //current product from form list array
      const productData = searchedProductsRef?.current?.results?.[
        searchedProductsRef.current?.index
      ]?.find((item: ProductType) => item?.product_id === current_product?.product?.value); //product data from the stored products ref
      if (productData && current_product) {
        if (!current_product?.mrp) {
          form.setFieldsValue({
            products: Object.assign(products, {
              [searchedProductsRef.current?.index]: {
                ...current_product,
                mrp: productData?.mrp,
                selling_price: productData?.mrp,
                qty: 1,
                total: productData?.mrp * 1
              }
            })
          });
        } //if current product doesn't have mrp, enter this condition
        if (current_product?.mrp) {
          if (current_product?.mrp !== productData?.mrp) {
            form.setFieldsValue({
              products: Object.assign(products, {
                [searchedProductsRef.current?.index]: {
                  ...current_product,
                  mrp: productData?.mrp,
                  selling_price: productData?.mrp,
                  qty: 1,
                  total: productData?.mrp * 1
                }
              })
            });
          }
        } //if current product does have mrp, enter this condition
      }
    }
  }, [products]);

  // wrapper function to fetch vendors from backend and store then in the searchedVendorsRef
  const fetchVendorsListWrapper = async (keyword: string) => {
    const res: VendorAddressType[] = await fetchVendorsList(keyword);
    searchedVendorsRef.current = res;
    const data: {
      label: string;
      key: number;
      options: { label: string; value: string }[];
    }[] = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i]) {
        data.push({
          label: res[i]?.vendor_name,
          key: res[i]?.vendor_id,
          options: res[i]?.gstins?.map((gstin: GstinType) => ({
            label: gstin?.gstin,
            value: gstin?.gstin + " " + res[i]?.vendor_id
          }))
        });
      }
    }
    return data;
  };

  // Wrapper function around products api call to store the res in productsRef
  const fetchProductListWrapper = async (keyword: string, index: number) => {
    const res: ProductType[] = await fetchProductListNode(keyword);
    searchedProductsRef.current = {
      results: {
        ...searchedProductsRef?.current?.results,
        [index]: res
      },
      index
    };
    return res;
  };

  return (
    <Spin spinning={createNonInventoryInvoicingLoading}>
      <Paper>
        <Form
          form={form}
          name="create-non-inventory-invoice"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            "same-as-billing-address": true
          }}
          autoComplete="off">
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <EditableRowShow
                label={"Vendor GSTIN"}
                id={"vendor"}
                type={RowShowInputTypes.DEBOUNCE_SELECT_OPTION_GROUP}
                fetchApi={fetchVendorsListWrapper}
                labelToShow={true}
                marginBottom={true}
                required={true}
              />
            </Col>

            <Col xs={24} sm={12}>
              <EditableRowShow
                label={"Vendor Name"}
                id={"vendor-name"}
                type={RowShowInputTypes.TEXT}
                disabled={true}
                labelToShow={true}
                marginBottom={true}
                required={true}
              />
            </Col>

            <Col xs={24} sm={12}>
              <EditableRowShow
                label={"Billing Address"}
                id={"billing-address"}
                type={RowShowInputTypes.SINGLE_SELECT}
                arrayData={billingAddressData}
                labelToShow={true}
                marginBottom={true}
                required={true}
              />
            </Col>
            <Col xs={24} sm={12}>
              <EditableRowShow
                label={"Shipping Address"}
                id={"shipping-address"}
                type={RowShowInputTypes.SINGLE_SELECT}
                labelToShow={true}
                arrayData={shippingAddressData}
                marginBottom={true}
                required={true}
              />
              <EditableRowShow
                label={"Same as billing address"}
                id={"same-as-billing-address"}
                type={RowShowInputTypes.CHECKBOX}
                labelToShow={true}
                marginBottom={true}
              />
            </Col>

            <Divider>Order Details</Divider>
            <Col span={24} style={{ marginBottom: 16 }}>
              <List
                name="products"
                initialValue={[
                  {
                    product: { value: "", label: "" },
                    mrp: 0,
                    selling_price: 0,
                    qty: 0,
                    total: 0
                  }
                ]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }, index) => {
                      return (
                        <Row gutter={8} key={key}>
                          <Col xs={24} md={9}>
                            <EditableRowShow
                              label={"Product Name or Product ID"}
                              id={[name, "product"]}
                              type={RowShowInputTypes.DEBOUNCE_SELECT}
                              fetchApi={(keyword: string) =>
                                fetchProductListWrapper(keyword, index)
                              }
                              labelToShow={true}
                              marginBottom={true}
                              required={true}
                              debounceId="product_id"
                              clearOptionsAfterSelect={true}
                            />
                          </Col>
                          <Col xs={24} md={3}>
                            <EditableRowShow
                              label={"MRP"}
                              id={[name, "mrp"]}
                              disabled
                              type={RowShowInputTypes.NUMBER}
                              labelToShow={true}
                              marginBottom={true}
                              required={true}
                            />
                          </Col>
                          <Col xs={24} md={4}>
                            <Form.Item
                              label={"Selling price"}
                              name={[name, "selling_price"]}
                              rules={[
                                { required: true, message: `Please input valid Selling price!` },
                                {
                                  validator: (rule: unknown, typedValue: number) => {
                                    if (
                                      typedValue &&
                                      typedValue > form.getFieldValue("products")?.[index]?.mrp
                                    ) {
                                      return Promise.reject(
                                        "Selling price should be less than MRP"
                                      );
                                    }
                                    return Promise.resolve();
                                  }
                                }
                              ]}>
                              <InputNumber
                                disabled={false}
                                style={{ width: "100%" }}
                                min={0}
                                onChange={(value: number) => {
                                  form.setFieldsValue({
                                    products: Object.assign(products, {
                                      [index]: {
                                        ...products[index],
                                        selling_price: value,
                                        total: value * products[index]?.qty
                                      }
                                    })
                                  });
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={3}>
                            <Form.Item
                              label={"Quantity"}
                              name={[name, "qty"]}
                              rules={[{ required: true, message: `Please input valid Quantity!` }]}>
                              <InputNumber
                                disabled={false}
                                style={{ width: "100%" }}
                                min={0}
                                onChange={(value: number) => {
                                  form.setFieldsValue({
                                    products: Object.assign(products, {
                                      [index]: {
                                        ...products[index],
                                        qty: value,
                                        total: value * products[index]?.selling_price
                                      }
                                    })
                                  });
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={3}>
                            <EditableRowShow
                              label={"Total"}
                              id={[name, "total"]}
                              type={RowShowInputTypes.NUMBER}
                              labelToShow={true}
                              disabled
                              marginBottom={true}
                              required={true}
                            />
                          </Col>
                          <Col
                            xs={24}
                            md={1}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "24px"
                            }}>
                            <DeleteOutlined
                              style={{ color: "red" }}
                              onClick={() => {
                                remove(name);
                              }}
                            />
                          </Col>
                        </Row>
                      );
                    })}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() =>
                          add({
                            product: { value: "", label: "" },
                            mrp: 0,
                            selling_price: 0,
                            qty: 0,
                            total: 0
                          })
                        }
                        block
                        icon={<PlusOutlined />}>
                        Add Product
                      </Button>
                    </Form.Item>
                  </>
                )}
              </List>
            </Col>
            <Col xs={24} style={{ marginTop: ".5rem" }}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Paper>
    </Spin>
  );
};

export default CreateNonInventoryInvoice;
