import { Table } from "antd";
import React from "react";
import { DataType } from "../constants/interface";
import { userListTablecolumns } from "../constants/tableData";

export type TablePagination = {
  current: number;
  pageSize: number;
  total: number;
};

interface Props {
  userList: DataType[];
  loading: boolean;
  pagination: TablePagination;
  onTableChange: (pagination: any) => void;
  isUserEdit: (user: DataType) => void;
  onDelete: (id: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

const UsersListTable: React.FC<Props> = ({
  userList,
  loading,
  pagination,
  onTableChange,
  isUserEdit,
  onDelete,
  setIsModalOpen,
}) => {
  const handleEdit = (id: number) => {
    setIsModalOpen(true);
    const userToEdit = userList.find((user) => user?.id === id);
    if (userToEdit) {
      isUserEdit(userToEdit);
    }
  };

  return (
    <div className="mt-5">
      <Table<DataType>
        columns={userListTablecolumns(handleEdit, onDelete)}
        dataSource={userList}
        loading={loading}
        rowKey="id"
        pagination={pagination}
        onChange={onTableChange}
      />
    </div>
  );
};

export default UsersListTable;
