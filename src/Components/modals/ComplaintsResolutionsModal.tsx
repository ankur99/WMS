import { Button, Form, Input, Modal, Spin, DatePicker } from "antd";
import moment from "moment";
import fetchUserList from "../../api/fetchUserList";
import { useStatusComplaintUpdate } from "../../hooks/useRQComplaints";
import { AssignDataRefProps, IssueStatus } from "../../types/ComplaintTypes";
import {
  disabledDate,
  disabledDateTime,
  onErrorNotification,
  showSuccessToast
} from "../../utils/helperFunctions";
import DebounceSelect from "../common/DebounceSelect";

const { TextArea } = Input;

interface ComplaintsActionProps {
  visible: boolean;
  setIsActionModalVisible: (arg0: boolean) => void;
  handleActionCancel: () => void;
  rowData: AssignDataRefProps;
}

interface OnFinishProps {
  resolution?: string;
  assignDate?: moment.Moment;
  assignTo?: {
    key: string;
  };
}

const ComplaintsResolutionsModal = ({
  visible,
  setIsActionModalVisible,
  handleActionCancel,
  rowData
}: ComplaintsActionProps) => {
  const [form] = Form.useForm();

  const { prevStatus, changedStatus, id } = rowData;

  const onSuccess = (msg: string) => {
    setIsActionModalVisible(false);
    showSuccessToast(msg);
  };

  const { isLoading, mutate: assignStatus } = useStatusComplaintUpdate({
    onError: onErrorNotification,
    onSuccess: onSuccess
  });

  const onFinish = (values: OnFinishProps) => {
    const tentative_date = values.assignDate
      ? moment(values.assignDate).format("DD-MM-YYYY HH:mm")
      : undefined;

    const payload = {
      resolution: values?.resolution,
      tentative_date,
      assignee_id: values?.assignTo?.key,
      status: changedStatus
    };

    assignStatus({ id, payload });
  };

  return (
    <Modal
      title="Enter Data"
      visible={visible}
      onCancel={handleActionCancel}
      destroyOnClose={true}
      footer={null}>
      <Spin spinning={isLoading}>
        <Form form={form} name="action-modal" onFinish={onFinish} layout="vertical">
          <GetFormItem prevStatus={prevStatus} changedStatus={changedStatus} />
          <Form.Item>
            <Button disabled={!rowData} htmlType="submit" type="primary">
              Confirm
            </Button>
            <Button style={{ marginLeft: "1rem" }} onClick={handleActionCancel}>
              Close
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ComplaintsResolutionsModal;

const GetFormItem = ({
  prevStatus,
  changedStatus
}: {
  prevStatus: string;
  changedStatus: string;
}) => {
  if (prevStatus === IssueStatus.Not_Picked && changedStatus === IssueStatus.In_Progress) {
    return (
      <>
        <Form.Item
          label="Assigned To"
          name="assignTo"
          rules={[{ required: true, message: " Missing Assignee Name" }]}>
          <DebounceSelect
            placeholder="Select Assignee"
            fetchOptions={fetchUserList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Tentative Completion Date" name="assignDate" rules={[{ required: true }]}>
          <DatePicker
            format="DD-MM-YYYY HH:mm"
            showTime
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            style={{ width: "100%" }}
            showNow={false}
          />
        </Form.Item>
      </>
    );
  } else if (prevStatus === IssueStatus.Not_Picked) {
    // Now Changed status will be resolved or rejected
    return (
      <>
        <Form.Item
          label="Assigned To"
          name="assignTo"
          rules={[{ required: true, message: "Missing Assignee Name" }]}>
          <DebounceSelect
            placeholder="Select Assignee"
            fetchOptions={fetchUserList}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Tentative Completion Date" name="assignDate" rules={[{ required: true }]}>
          <DatePicker
            format="DD-MM-YYYY HH:mm"
            showTime
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            style={{ width: "100%" }}
            showNow={false}
          />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: "Missing Resolution" }]} name="resolution">
          <TextArea
            bordered
            autoSize={{ minRows: 2, maxRows: 8 }}
            placeholder="Enter Resolution"
            allowClear
          />
        </Form.Item>
      </>
    );
  } else if (prevStatus === IssueStatus.In_Progress) {
    return (
      <Form.Item rules={[{ required: true, message: "Missing Resolution" }]} name="resolution">
        <TextArea
          bordered
          autoSize={{ minRows: 2, maxRows: 8 }}
          placeholder="Enter Resolution"
          allowClear
        />
      </Form.Item>
    );
  }
  return <>Invalid</>;
};
