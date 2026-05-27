import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user.types';
import { ApiMode } from '../../core/api/client';
import { userService } from '../services/user.service';

interface UseUsersFilters {
  search?: string;
  company?: string;
  role?: string;
}

export const useUsers = (apiMode: ApiMode, filters: UseUsersFilters) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { search, company, role } = filters;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(apiMode, { search, company, role });
      setUsers(data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiMode, search, company, role]);

  useEffect(() => {
    fetchUsers().catch(() => {});
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers
  };
};

export default useUsers;
