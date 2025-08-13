import { Avatar, Button, Space, TableProps } from "antd";
import { DataType } from "./interface";

export const userListTablecolumns = (
  handleEdit: (id: number) => void,
  handleDelete: (id: number) => void
): TableProps<DataType>["columns"] => [
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (text) => <Avatar src={text} />,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => <p className="text-blue-500">{text}</p>,
  },
  {
    title: "First Name",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Action", 
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          type="primary" 
          className="bg-[#1990FF]" 
          onClick={() => handleEdit(record.id)}
        >
          Edit
        </Button>
        <Button
          type="primary"
          className="bg-[#FF4D4E] text-white"
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </Button>
      </Space>
    ),
  },
];
