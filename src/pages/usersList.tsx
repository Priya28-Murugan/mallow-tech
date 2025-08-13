import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Radio, Space, message } from "antd";
import { useEffect, useState } from "react";
import UsersListTable from "./components/usersListTable";
import { DataType } from "./constants/interface";
import { API_BASE_URL } from "./constants/api";
import UserCard from "./components/usersCard";

const UsersList = () => {
  const { Search } = Input;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<DataType[]>([]);
  const [form] = Form.useForm();
  const [view, setView] = useState<"table" | "card">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserData, setEditUserData] = useState<DataType | null>(null);
  const [users, setUsers] = useState<DataType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredUsers(users);
      } else {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredUsers(
          users.filter(
            (u) =>
              u.first_name.toLowerCase().includes(lowerTerm) ||
              u.last_name.toLowerCase().includes(lowerTerm) ||
              u.email.toLowerCase().includes(lowerTerm)
          )
        );
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, users]);

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, []);

  const handleViewChange = (e: any) => {
    setView(e.target.value);
    fetchUsers();
  };

  const fetchUsers = async (page = 1, pageSize = 6) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}users?page=${page}&per_page=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "reqres-free-v1",
          },
        }
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setUsers(data.data || []);
      setTotal(data.total);
      setPagination((p) => ({
        ...p,
        total: data.total || data.total_pages || 0,
        current: data.page || page,
      }));
    } catch (err) {
      console.error(err);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (userData: DataType) => {
    setIsEdit(true);
    setEditUserData(userData);
    form.setFieldsValue({
      firstName: userData.first_name,
      lastName: userData.last_name,
      email: userData.email,
      profile: userData.avatar,
    });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsEdit(false);
    setEditUserData({} as DataType);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination((p) => ({
      ...p,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    fetchUsers(newPagination.current, newPagination.pageSize);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      message.success("User deleted");
      fetchUsers(pagination.current, pagination.pageSize); // Refresh list
    } catch (err) {
      console.error(err);
      message.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const endPoint = isEdit
      ? `${API_BASE_URL}users/${editUserData?.id}`
      : `${API_BASE_URL}users`;
    try {
      const response = await fetch(endPoint, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
        },
        body: JSON.stringify({
          first_name: values.firstName,
          email: values.email,
          last_name: values.lastName,
          avatar: values.profile,
        }),
      });
      const data = await response.json();
      if (data?.id || data?.updatedAt) {
        setIsModalOpen(false);
        fetchUsers(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error("Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#DEDEDE]">
      <div className="w-[90%] p-5 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-start">
          <p className="text-2xl font-bold text-center">Users</p>
          <div className="flex justify-end items-center gap-5">
            <Search
              placeholder="input search text"
              allowClear
              size="middle"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="primary" onClick={handleCreate}>
              Create User
            </Button>
            <Modal
              title={isEdit ? "Edit User" : "Create New User"}
              closable={{ "aria-label": "Custom Close Button" }}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                name="user_form"
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter first name",
                    },
                  ]}
                >
                  <Input placeholder="Please enter first name" size="large" />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter last name",
                    },
                  ]}
                >
                  <Input placeholder="Please enter last name" size="large" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter email",
                    },
                  ]}
                >
                  <Input placeholder="Please enter email" size="large" />
                </Form.Item>
                <Form.Item
                  label="Profile Image Link"
                  name="profile"
                  rules={[
                    {
                      required: true,
                      message: "Please enter profile image link",
                    },
                  ]}
                >
                  <Input
                    placeholder="Please enter profile image link"
                    size="large"
                  />
                </Form.Item>
                <Form.Item>
                  <Space className="flex justify-end">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <div className="mt-5">
          <Radio.Group value={view} onChange={handleViewChange}>
            <Radio.Button value="table">
              {" "}
              <AppstoreOutlined /> Table
            </Radio.Button>
            <Radio.Button value="card">
              {" "}
              <UnorderedListOutlined /> Card
            </Radio.Button>
          </Radio.Group>
          {view === "table" ? (
            <UsersListTable
              isUserEdit={handleEdit}
              onDelete={handleDelete}
              userList={filteredUsers}
              loading={loading}
              pagination={pagination}
              onTableChange={handleTableChange}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <UserCard
              total={total}
              users={filteredUsers}
              isUserEdit={handleEdit}
              onDelete={handleDelete}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
