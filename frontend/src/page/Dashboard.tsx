import React, { useState, useEffect, useMemo } from 'react';
import { Box, Divider, useDisclosure, useToast, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { StatsCards } from './components/StatsCards';
import { SearchFilter } from './components/SearchFilter';
import { CustomTable } from './components/CustomTable';
import { ConfirmDelete } from './components/ConfirmDelete';
import { Pagination } from './components/Pagination';
import { ApiMode } from '../core/api/client';
import { User } from './types/user.types';

import { useUsers } from './hooks/useUsers';
import { useUserStats } from './hooks/useUserStats';
import { useUserMutations } from './hooks/useUserMutations';
import { TableSkeleton } from './components/TableSkeleton';

interface DashboardProps {
  apiMode: ApiMode;
  onApiModeChange: (mode: ApiMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiMode }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const companyFilterStr = JSON.stringify(companyFilter);
  const roleFilterStr = JSON.stringify(roleFilter);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, companyFilterStr, roleFilterStr]);

  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const toast = useToast();
  const panelBg = useColorModeValue('white', 'gray.800');
  const panelBorder = useColorModeValue('gray.200', 'gray.700');

  const {
    users,
    pagination,
    isLoading,
    error: usersError,
    refetch: refetchUsers
  } = useUsers(apiMode, {
    search: search.trim() || undefined,
    companies: companyFilter.length > 0 ? companyFilter : undefined,
    roles: roleFilter.length > 0 ? roleFilter : undefined,
    page: currentPage,
    limit: pageSize
  });

  const { stats, refetch: refetchStats } = useUserStats(apiMode, users);
  const { deleteUser } = useUserMutations(apiMode);

  useEffect(() => {
    if (usersError && apiMode === 'express') {
      toast({
        title: 'Connection Error',
        description: 'Could not connect to Express API (port 5000). Make sure the backend server is running.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }, [usersError, apiMode, toast]);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  useEffect(() => {
    import('./services/user.service').then(({ userService }) => {
      userService
        .getUsers(apiMode, { limit: 1000 })
        .then((result) => {
          setAllUsers(result.users);
        })
        .catch(() => {});
    });
  }, [apiMode]);

  const companies = useMemo(
    () => Array.from(new Set(allUsers.map((u) => u.company?.name || 'Freelance'))).sort(),
    [allUsers]
  );
  const roles = useMemo(
    () => Array.from(new Set(allUsers.map((u) => u.company?.title || u.role || 'Employee'))).sort(),
    [allUsers]
  );

  const handleAddClick = () => navigate('/employees/new');

  const handleEditClick = (user: User) => navigate(`/employees/${user.id}/edit`);

  const handleDeleteClick = (user: User) => {
    setActiveUser(user);
    onOpenDelete();
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteUser(id);
    toast({
      title: 'Employee Removed',
      description: 'The employee record was permanently deleted.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position: 'top-right'
    });
    refetchUsers();
    refetchStats();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCompanyFilter([]);
    setRoleFilter([]);
    setCurrentPage(1);
  };

  return (
    <>
      <StatsCards stats={stats} />

      <Box
        bg={panelBg}
        border="1px"
        borderColor={panelBorder}
        borderRadius="3xl"
        boxShadow="sm"
        p={{ base: 4, md: 6 }}
        mb={8}
      >
        <SearchFilter
          search={search}
          setSearch={setSearch}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          companies={companies}
          roles={roles}
          onOpenAdd={handleAddClick}
          onClear={handleClearFilters}
        />

        <Divider mb={6} />

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <CustomTable users={users} onEdit={handleEditClick} onDelete={handleDeleteClick} isLoading={isLoading} />

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(p) => setCurrentPage(p)}
              onLimitChange={(l) => {
                setPageSize(l);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </Box>

      <ConfirmDelete isOpen={isDeleteOpen} onClose={onCloseDelete} user={activeUser} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Dashboard;
