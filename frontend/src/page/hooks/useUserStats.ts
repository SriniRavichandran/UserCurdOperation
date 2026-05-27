import { useState, useEffect, useCallback } from 'react';
import { UserStats } from '../types/user.types';
import { ApiMode } from '../../core/api/client';
import { userService } from '../services/user.service';

export const useUserStats = (apiMode: ApiMode, usersDependency?: any) => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    averageSalary: 0,
    topCompany: 'N/A'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUserStats(apiMode);
      setStats(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiMode]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, usersDependency]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};

export default useUserStats;
