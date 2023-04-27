import { Dropdown, Menu, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
interface DownloadDropdownProps {
  isLoading: boolean;
  handleDownload: (args: number) => void;
  arrayData?: {
    key: number;
    name: string;
    args: number | string;
  }[];
}

export const DownoadDropdown = ({
  isLoading,
  handleDownload,
  arrayData
}: DownloadDropdownProps) => {
  return (
    <>
      {arrayData && (
        <Dropdown
          overlay={
            <Menu>
              {arrayData &&
                arrayData?.map((item: { key: number; name: string; args: string | number }) => {
                  return (
                    <Menu.Item key={`${item.key}`}>
                      {
                        <Button
                          type="text"
                          size="small"
                          loading={isLoading}
                          onClick={() => handleDownload(item.args as number)}>
                          {item.name}
                        </Button>
                      }
                    </Menu.Item>
                  );
                })}
            </Menu>
          }
          trigger={["click"]}>
          <Button type="primary" loading={isLoading}>
            Download <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </>
  );
};
