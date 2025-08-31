export type Client = {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  phone: string;
  address?: string;
  status: "active" | "inactive" | "banned";
  createdAt: string;
  updatedAt: string;
};