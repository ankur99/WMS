import { Modal, Button, Table } from "antd";
import { RowComplaintTypes } from "../../types/ComplaintTypes";
import { formatDate } from "../../utils/constants";
import styles from "./complaints.module.css";

const { Column } = Table;

interface InfoModalProps {
  visible: boolean;
  handleInfoCancel: () => void;
  data: RowComplaintTypes;
}

const ComplaintsStatusInfoModal = ({ visible, handleInfoCancel, data }: InfoModalProps) => {
  const tableData = data.status_info;

  return (
    <>
      <Modal
        width={700}
        title="Issue Status"
        visible={visible}
        onCancel={handleInfoCancel}
        footer={<Button onClick={handleInfoCancel}> Close </Button>}>
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            {data?.resolution && (
              <div className={styles.info}>
                <h3> Resolution:</h3>
                <p>{data?.resolution}</p>
              </div>
            )}
            {data?.assignee && (
              <div className={styles.info}>
                <h3> Assignee:</h3>
                <p>{data?.assignee}</p>
              </div>
            )}
            {data?.tentative_date && (
              <div className={styles.info}>
                <h3>Tentative Completion Date:</h3>
                <p>{formatDate(data?.tentative_date)}</p>
              </div>
            )}
          </div>

          <Table dataSource={tableData} pagination={false} bordered>
            <Column title="Status From" dataIndex="status_from" key="status" align="center" />
            <Column title="Status To" dataIndex="status_to" key="status_to" align="center" />
            <Column title="Changed By" dataIndex="updated_by" key="updated_by" align="center" />
            <Column
              title="Changed At"
              dataIndex="updated_at"
              key="updated_at"
              align="center"
              render={(value) => {
                return formatDate(value);
              }}
            />
          </Table>
        </>
      </Modal>
    </>
  );
};

export default ComplaintsStatusInfoModal;
