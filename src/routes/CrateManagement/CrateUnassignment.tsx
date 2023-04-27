import { useState } from "react";
import { Form, Input, Button, Spin, Typography, Popconfirm } from "antd";

import Paper from "../../Components/common/Paper";
import styles from "./crateUnassignemnt.module.css";
import { getCrateData, unassignCrateFromBackend } from "../../api/crateAPI";
import {
  onErrorNotification,
  showErrorNotification,
  showSuccessToast
} from "../../utils/helperFunctions";
import { BarcodeSearchProps, CratesData } from "../../types/crateUnassignmentTypes";
import RightSideDesign from "../../Components/crateManagement/CrateUnassignment/RightSideDesign";
import LeftCrateDesign from "../../Components/crateManagement/CrateUnassignment/LeftCrateDesign";

const { Text } = Typography;
const markAllText = "Are you Sure you want to mark all the crates as unassigned?";

const CrateUnassignment = () => {
  const [cratesData, setCratesData] = useState<CratesData>({});
  const [loading, setLoading] = useState(false);

  const [currentCrateSelected, setCurrentCrateSelected] = useState("");

  const [form] = Form.useForm();

  const onBarcodeSearch = async (values: BarcodeSearchProps) => {
    if (cratesData[values?.barcode] !== undefined) {
      showErrorNotification({ msg: "Error", desc: "Crate Already Present" });
      return;
    }
    setLoading(true);
    await getCrateData(values?.barcode)
      .then((res) => {
        // setCrateData(res.data);
        const response = res?.data;
        setCratesData((prev: CratesData) => {
          return {
            ...prev,
            [response.reference_id]: response
          };
        });
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
    form.resetFields();
  };

  const removeCrateData = (referenceId: string) => {
    const temp = { ...cratesData };
    delete temp[referenceId];
    setCratesData({
      ...temp
    });
  };

  const unassignCrates = async (crateIds: number[], referenceIds: string[]) => {
    setLoading(true);
    await unassignCrateFromBackend(crateIds)
      .then(() => {
        showSuccessToast("Crate Unassigned Successfully");
        //Remove crates
        const tempCratesData = { ...cratesData };

        for (let i = 0; i < referenceIds?.length; i++) {
          delete tempCratesData?.[referenceIds[i]];
        }
        setCratesData({
          ...tempCratesData
        });
        setCurrentCrateSelected("");
      })
      .catch((err) => {
        onErrorNotification(err);
      });
    setLoading(false);
  };

  const changeCurrentCrateSelected = (referenceId: string) => {
    setCurrentCrateSelected(referenceId);
  };

  const unassignAll = () => {
    const keys = Object.keys(cratesData);

    const crateIds = [];
    const referenceIds = [...keys];

    for (let i = 0; i < keys.length; i++) {
      const id = cratesData[keys[i]]?.id;
      crateIds.push(id);
    }

    unassignCrates(crateIds, referenceIds);
  };

  return (
    <Spin spinning={loading}>
      {Object?.keys(cratesData)?.length > 0 && (
        <div className={styles.unassignAllWrapper}>
          <div className={styles.unassignAll} style={{ textAlign: "right", marginRight: "1rem" }}>
            <Popconfirm
              title={markAllText}
              onConfirm={unassignAll}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No">
              <Button type="primary">Unassign All</Button>
            </Popconfirm>
          </div>
        </div>
      )}

      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Paper>
            <h3>QR Code of the Crate</h3>
            <Form form={form} style={{ width: "100%" }} onFinish={onBarcodeSearch}>
              <Form.Item
                style={{ marginBottom: "12px" }}
                name="barcode"
                rules={[{ required: true, message: "Please input your barcode!" }]}>
                <Input placeholder="Scan QR code of the crate or enter manually to search" />
              </Form.Item>
              <Form.Item style={{ marginBottom: "12px" }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>
            <div>
              {Object?.keys(cratesData)?.length > 0 ? (
                Object?.keys(cratesData)?.map((crateReferenceId) => (
                  <LeftCrateDesign
                    key={crateReferenceId}
                    crateData={cratesData[crateReferenceId]}
                    removeCrateData={removeCrateData}
                    currentCrateSelected={currentCrateSelected}
                    changeCurrentCrateSelected={changeCurrentCrateSelected}
                  />
                ))
              ) : (
                <></>
              )}
            </div>
          </Paper>
        </div>

        <div className={styles.right}>
          <Paper>
            {currentCrateSelected === "" ? (
              <Text type="secondary">
                After you’ve selected a crate, Selected crate’s last order details will be shown
                here
              </Text>
            ) : (
              <>
                {Object?.keys(cratesData)?.map((crateReferenceId) => {
                  if (crateReferenceId === currentCrateSelected) {
                    return (
                      <RightSideDesign
                        key={crateReferenceId}
                        crateData={cratesData[crateReferenceId]}
                        unassignCrates={unassignCrates}
                      />
                    );
                  }
                })}
              </>
            )}
          </Paper>
        </div>
      </div>
    </Spin>
  );
};

export default CrateUnassignment;
