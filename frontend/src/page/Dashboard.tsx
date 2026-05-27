import React, { useState, useEffect, useMemo } from 'react';
import { Box, Divider, Spinner, Center, useDisclosure, useToast, useColorModeValue } from '@chakra-ui/react';

// Components & Services
import { StatsCards } from './components/StatsCards';
import { SearchFilter } from './components/SearchFilter';
import { CustomTable } from './components/CustomTable';
import { UserModal } from './components/UserModal';
import { ConfirmDelete } from './components/ConfirmDelete';
import { ApiMode } from '../core/api/client';
import { User, UserInput } from './types/user.types';

// Custom Hooks
import { useUsers } from './hooks/useUsers';
import { useUserStats } from './hooks/useUserStats';
import { useUserMutations } from './hooks/useUserMutations';

interface DashboardProps {
  apiMode: ApiMode;
  onApiModeChange: (mode: ApiMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiMode }) => {
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals state management
  const { isOpen: isAddEditOpen, onOpen: onOpenAddEdit, onClose: onCloseAddEdit } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [activeUser, setActiveUser] = useState<User | null>(null);

  const toast = useToast();

  const panelBg = useColorModeValue('white', 'gray.800');
  const panelBorder = useColorModeValue('gray.200', 'gray.700');

  // Invoke custom hooks
  const { users, isLoading, error: usersError, refetch: refetchUsers } = useUsers(apiMode, {});
  const { stats, refetch: refetchStats } = useUserStats(apiMode, users);
  const { createUser, updateUser, deleteUser } = useUserMutations(apiMode);

  // Watch for API connection errors
  useEffect(() => {
    if (usersError) {
      toast({
        title: 'Connection Error',
        description: `Could not connect to ${apiMode === 'express' ? 'Express API server' : 'JSON Server'}. Make sure your local server is running.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }, [usersError, apiMode, toast]);

  // Client-side filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Keyword search
      const matchesSearch =
        !search.trim() ||
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.company.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase());

      // Company check
      const matchesCompany = !companyFilter || user.company === companyFilter;

      // Role check
      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesCompany && matchesRole;
    });
  }, [users, search, companyFilter, roleFilter]);

  // Extract unique companies & roles from the unfiltered list (so all dropdown options stay visible)
  const [companies, roles] = useMemo(() => {
    const comps = Array.from(new Set(users.map((u) => u.company))).sort();
    const rls = Array.from(new Set(users.map((u) => u.role))).sort();
    return [comps, rls];
  }, [users]);

  // Trigger Add User
  const handleAddClick = () => {
    setActiveUser(null);
    onOpenAddEdit();
  };

  // Trigger Edit User
  const handleEditClick = (user: User) => {
    setActiveUser(user);
    onOpenAddEdit();
  };

  // Trigger Delete User
  const handleDeleteClick = (user: User) => {
    setActiveUser(user);
    onOpenDelete();
  };

  // Save or Update User
  const handleSaveUser = async (formData: UserInput) => {
    if (activeUser) {
      // Edit mode
      await updateUser(activeUser.id, formData);
      toast({
        title: 'Employee Updated',
        description: `${formData.username}'s record was updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    } else {
      // Add mode
      await createUser(formData);
      toast({
        title: 'Employee Added',
        description: `${formData.username} has been added to the system.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
    refetchUsers();
    refetchStats();
  };

  // Delete User
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

  // Clear filters
  const handleClearFilters = () => {
    setSearch('');
    setCompanyFilter('');
    setRoleFilter('');
  };

  return (
    <>
      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Filters and Table Area */}
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
          <Center py={20}>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Center>
        ) : (
          <CustomTable
            users={filteredUsers}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        )}
      </Box>

      {/* Add / Edit Form Modal */}
      <UserModal isOpen={isAddEditOpen} onClose={onCloseAddEdit} onSave={handleSaveUser} user={activeUser} />

      {/* Confirm Delete Dialog */}
      <ConfirmDelete isOpen={isDeleteOpen} onClose={onCloseDelete} user={activeUser} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default Dashboard;
