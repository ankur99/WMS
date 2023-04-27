import { Tag } from "antd";

interface ArrayDataRenderProps {
  data: { id: number; name: string }[];
  toShowKey: string;
}

const ArrayDataRender = ({ data, toShowKey }: ArrayDataRenderProps) => {
  try {
    return (
      <div>
        {data.map((item, index) => {
          return (
            <Tag color="blue" key={item.id + index}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              {item[toShowKey]}
            </Tag>
          );
        })}
      </div>
    );
  } catch (error) {
    console.log({ error });
  }
  return <>Something went Wrong!!</>;
};

export default ArrayDataRender;
