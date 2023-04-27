import React from "react";
import QRCode from "react-qr-code";
import styles from "./print.module.css";

export class PrintLabels extends React.PureComponent<any> {
  render() {
    const data = this.props.printData;
    const count = this.props.count;
    return (
      <div className={styles.container}>
        <GetData data={data} count={count} />
      </div>
    );
  }
}

const GetData = ({ count, data }: { count: number; data: any }) => {
  const array = [];

  for (let i = 0; i < data?.length; i++) {
    for (let j = 0; j < count; j++) {
      array.push(data[i]);
    }
  }

  return (
    <div className={styles.container}>
      {array.map((item: any, index: number) => (
        <div className={styles.qrCodeElement} key={index}>
          <div style={{ textAlign: "center" }}>
            <QRCode size={130} value={item.reference_id} />
            <div style={borderStyle}>
              <div style={{ fontSize: "10px", fontWeight: "bold", lineHeight: "8px" }}>
                #{item?.reference_id || "--"}
              </div>
            </div>
            <div style={{ ...borderStyle, width: "100%" }}>
              <div style={{ fontSize: "8px", lineHeight: "4px" }}>{item?.description || "--"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// const containerStyle: any = {
//   textAlign: "center"
// };

const borderStyle: any = {
  // border: "1px solid black",
  borderRadius: "5px",
  padding: "2px",
  // fontSize: "8px",
  textAlign: "center"
};
