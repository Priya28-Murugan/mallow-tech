import { Avatar, Pagination } from "antd";
import React, { useState } from "react";
import { DataType } from "../constants/interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Props {
  total: number;
  users: DataType[];
  isUserEdit: (user: DataType) => void;
  onDelete: (id: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

const UserCard: React.FC<Props> = ({
  total,
  users,
  isUserEdit,
  onDelete,
  setIsModalOpen,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);
  console.log("sdsdfsd", users);

  const handleEdit = (id: number) => {
    setIsModalOpen(true);
    const userToEdit = users.find((user) => user?.id === id);
    if (userToEdit) {
      isUserEdit(userToEdit);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="relative bg-white rounded-xl shadow-md p-6 text-center group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-80 transition duration-300 z-10"></div>

            <div className="absolute inset-0 flex justify-center items-center space-x-3 opacity-0 group-hover:opacity-100 transition duration-300 z-20">
              <button
                className="bg-[#8686E6] p-4 rounded-full text-white hover:[#8686E6]"
                onClick={() => handleEdit(user.id)}
              >
                <EditOutlined />
              </button>
              <button
                className="bg-[#FD0100] p-4 rounded-full text-white hover:bg-[#FD0100]"
                onClick={() => onDelete(user.id)}
              >
                <DeleteOutlined />
              </button>
            </div>

            <div className="relative z-0 flex flex-col items-center">
              <Avatar src={user.avatar} size={80} />
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default UserCard;
