export interface User {
  id: number;
  username: string;
  company: string;
  role: string;
  email: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export interface UserStats {
  totalUsers: number;
  averageSalary: number;
  topCompany: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}
