import { getClient, ApiMode } from '../../core/api/client';
import { User, UserInput, UserStats, ApiResponse } from '../types/user.types';

export const userService = {
  /**
   * Get all users, filtered by search query, company, or role.
   */
  getUsers: async (mode: ApiMode, filters?: { search?: string; company?: string; role?: string }): Promise<User[]> => {
    const client = getClient(mode);
    const prefix = '/users';

    if (mode === 'express') {
      const response = await client.get<ApiResponse<User[]>>(prefix, { params: filters });
      return response.data.data;
    } else {
      const params: any = {};
      if (filters?.search) params.q = filters.search;
      if (filters?.company) params.company = filters.company;
      if (filters?.role) params.role = filters.role;

      const response = await client.get<User[]>(prefix, { params });
      return response.data;
    }
  },

  /**
   * Get user by ID.
   */
  getUserById: async (mode: ApiMode, id: number): Promise<User> => {
    const client = getClient(mode);
    const prefix = `/users/${id}`;

    if (mode === 'express') {
      const response = await client.get<ApiResponse<User>>(prefix);
      return response.data.data;
    } else {
      const response = await client.get<User>(prefix);
      return response.data;
    }
  },

  /**
   * Create a new user.
   */
  createUser: async (mode: ApiMode, userData: UserInput): Promise<User> => {
    const client = getClient(mode);
    const prefix = '/users';
    const payload = {
      ...userData,
      salary: Number(userData.salary)
    };

    if (mode === 'express') {
      const response = await client.post<ApiResponse<User>>(prefix, payload);
      return response.data.data;
    } else {
      const response = await client.post<User>(prefix, payload);
      return response.data;
    }
  },

  /**
   * Update an existing user.
   */
  updateUser: async (mode: ApiMode, id: number, userData: Partial<UserInput>): Promise<User> => {
    const client = getClient(mode);
    const prefix = `/users/${id}`;
    const payload = {
      ...userData,
      salary: userData.salary !== undefined ? Number(userData.salary) : undefined
    };

    if (mode === 'express') {
      const response = await client.put<ApiResponse<User>>(prefix, payload);
      return response.data.data;
    } else {
      const response = await client.put<User>(prefix, payload);
      return response.data;
    }
  },

  /**
   * Delete a user.
   */
  deleteUser: async (mode: ApiMode, id: number): Promise<void> => {
    const client = getClient(mode);
    const prefix = `/users/${id}`;

    if (mode === 'express') {
      await client.delete<ApiResponse<null>>(prefix);
    } else {
      await client.delete(prefix);
    }
  },

  /**
   * Get user metrics / statistics.
   */
  getUserStats: async (mode: ApiMode): Promise<UserStats> => {
    if (mode === 'express') {
      const client = getClient(mode);
      const response = await client.get<ApiResponse<UserStats>>('/users/stats');
      return response.data.data;
    } else {
      // Calculate locally if JSON Server is selected
      const users = await userService.getUsers('json-server');
      const totalUsers = users.length;
      if (totalUsers === 0) {
        return { totalUsers: 0, averageSalary: 0, topCompany: 'N/A' };
      }

      const totalSalary = users.reduce((sum, user) => sum + Number(user.salary), 0);
      const averageSalary = Math.round((totalSalary / totalUsers) * 100) / 100;

      const companyCounts: { [key: string]: number } = {};
      users.forEach((user) => {
        companyCounts[user.company] = (companyCounts[user.company] || 0) + 1;
      });

      let topCompany = 'N/A';
      let maxCount = 0;
      Object.entries(companyCounts).forEach(([company, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topCompany = company;
        }
      });

      return { totalUsers, averageSalary, topCompany };
    }
  }
};
