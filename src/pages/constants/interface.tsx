export interface DataType {
  id: number;
  key: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  tags: string[];
}

export interface UserListTableProps {
    isUserEdit: (user: DataType) => void;
    userList:[];
    setIsModalOpen: (isOpen: boolean) => void;
  }