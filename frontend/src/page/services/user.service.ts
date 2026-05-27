import { getClient, ApiMode } from '../../core/api/client';
import { User, UserInput, UserStats, ApiResponse, PaginationMeta } from '../types/user.types';

export interface GetUsersParams {
  search?: string;
  companies?: string[];
  roles?: string[];
  page?: number;
  limit?: number;
}

export interface GetUsersResult {
  users: User[];
  pagination: PaginationMeta;
}

export const userService = {
  getUsers: async (mode: ApiMode, filters?: GetUsersParams): Promise<GetUsersResult> => {
    const client = getClient(mode);

    if (mode === 'express') {
      const params: Record<string, any> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.companies && filters.companies.length > 0) params.companies = filters.companies.join(',');
      if (filters?.roles && filters.roles.length > 0) params.roles = filters.roles.join(',');
      if (filters?.page) params.page = filters.page;
      if (filters?.limit) params.limit = filters.limit;

      const response = await client.get<ApiResponse<User[]>>('/users', { params });
      return {
        users: response.data.data,
        pagination: response.data.pagination || {
          total: response.data.data.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      };
    } else {
      const params: any = {};
      if (filters?.search) params.q = filters.search;

      const response = await client.get<User[]>('/users', { params });
      let users = response.data;

      if (filters?.companies && filters.companies.length > 0) {
        users = users.filter((u) => filters.companies!.includes(u.company?.name || 'Freelance'));
      }

      if (filters?.roles && filters.roles.length > 0) {
        users = users.filter((u) => filters.roles!.includes(u.company?.title || '') || filters.roles!.includes(u.role));
      }

      const total = users.length;
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      const paginatedUsers = users.slice(start, start + limit);

      return {
        users: paginatedUsers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }
  },

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

  updateUser: async (mode: ApiMode, id: number, userData: Partial<UserInput>): Promise<User> => {
    const client = getClient(mode);
    const prefix = `/users/${id}`;
    const payload = {
      ...userData,
      salary: userData.salary !== undefined ? Number(userData.salary) : undefined
    };

    if (payload.password === '') {
      delete payload.password;
    }

    if (mode === 'express') {
      const response = await client.put<ApiResponse<User>>(prefix, payload);
      return response.data.data;
    } else {
      const response = await client.put<User>(prefix, payload);
      return response.data;
    }
  },

  deleteUser: async (mode: ApiMode, id: number): Promise<void> => {
    const client = getClient(mode);
    const prefix = `/users/${id}`;

    if (mode === 'express') {
      await client.delete<ApiResponse<null>>(prefix);
    } else {
      await client.delete(prefix);
    }
  },

  getUserStats: async (mode: ApiMode): Promise<UserStats> => {
    if (mode === 'express') {
      const client = getClient(mode);
      const response = await client.get<ApiResponse<UserStats>>('/users/stats');
      return response.data.data;
    } else {
      const result = await userService.getUsers('json-server', { limit: 1000 });
      const users = result.users;
      const totalUsers = result.pagination.total;
      if (totalUsers === 0) {
        return { totalUsers: 0, averageSalary: 0, topCompany: 'N/A' };
      }

      const totalSalary = users.reduce((sum, user) => sum + Number(user.salary), 0);
      const averageSalary = Math.round((totalSalary / totalUsers) * 100) / 100;

      const companyCounts: { [key: string]: number } = {};
      users.forEach((user) => {
        const companyName = user.company?.name || 'Freelance';
        companyCounts[companyName] = (companyCounts[companyName] || 0) + 1;
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
