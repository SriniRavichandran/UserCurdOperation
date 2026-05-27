import { useState, useEffect, useCallback } from 'react';
import { User, PaginationMeta } from '../types/user.types';
import { ApiMode } from '../../core/api/client';
import { userService } from '../services/user.service';

interface UseUsersFilters {
  search?: string;
  companies?: string[];
  roles?: string[];
  page?: number;
  limit?: number;
}

export const useUsers = (apiMode: ApiMode, filters: UseUsersFilters) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { search, companies, roles, page, limit } = filters;

  const companiesStr = JSON.stringify(companies);
  const rolesStr = JSON.stringify(roles);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userService.getUsers(apiMode, { search, companies, roles, page, limit });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMode, search, page, limit, companiesStr, rolesStr]);

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch: fetchUsers
  };
};

export default useUsers;
