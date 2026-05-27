import { useState } from 'react';
import { UserInput } from '../types/user.types';
import { ApiMode } from '../../core/api/client';
import { userService } from '../services/user.service';

export const useUserMutations = (apiMode: ApiMode) => {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<any>(null);

  const createUser = async (userData: UserInput) => {
    setIsMutating(true);
    setError(null);
    try {
      const newUser = await userService.createUser(apiMode, userData);
      return newUser;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateUser = async (id: number, userData: Partial<UserInput>) => {
    setIsMutating(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(apiMode, id, userData);
      return updatedUser;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteUser = async (id: number) => {
    setIsMutating(true);
    setError(null);
    try {
      await userService.deleteUser(apiMode, id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    isMutating,
    error
  };
};

export default useUserMutations;
