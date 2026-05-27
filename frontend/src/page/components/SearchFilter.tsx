import React from 'react';
import {
  Stack,
  Flex,
  Input,
  Select,
  Button,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';

interface SearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  companyFilter: string;
  setCompanyFilter: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  companies: string[];
  roles: string[];
  onOpenAdd: () => void;
  onClear: () => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  search,
  setSearch,
  companyFilter,
  setCompanyFilter,
  roleFilter,
  setRoleFilter,
  companies,
  roles,
  onOpenAdd,
  onClear
}) => {
  const inputBg = useColorModeValue('white', 'gray.800');
  const selectBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const hasActiveFilters = search || companyFilter || roleFilter;

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      spacing={4}
      mb={6}
      w="100%"
      alignItems={{ base: 'stretch', lg: 'center' }}
    >
      {/* Search Bar */}
      <InputGroup maxW={{ base: '100%', lg: '350px' }} size="md">
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.400" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search by username, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg={inputBg}
          borderColor={borderColor}
          borderRadius="xl"
          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
        />
      </InputGroup>

      {/* Filter by Company */}
      <Select
        placeholder="All Companies"
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        maxW={{ base: '100%', lg: '200px' }}
        bg={selectBg}
        borderColor={borderColor}
        borderRadius="xl"
        size="md"
      >
        {companies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      {/* Filter by Role */}
      <Select
        placeholder="All Roles"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        maxW={{ base: '100%', lg: '200px' }}
        bg={selectBg}
        borderColor={borderColor}
        borderRadius="xl"
        size="md"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Select>

      {/* Action Buttons */}
      <Flex gap={2} ml={{ lg: 'auto' }} width={{ base: '100%', lg: 'auto' }}>
        {hasActiveFilters && (
          <Button
            leftIcon={<Icon as={FiX} />}
            variant="ghost"
            onClick={onClear}
            colorScheme="red"
            borderRadius="xl"
            flex={{ base: 1, lg: 'initial' }}
          >
            Clear Filters
          </Button>
        )}
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="blue"
          onClick={onOpenAdd}
          borderRadius="xl"
          boxShadow="md"
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          _active={{ transform: 'translateY(0)' }}
          flex={{ base: 1, lg: 'initial' }}
        >
          Add Employee
        </Button>
      </Flex>
    </Stack>
  );
};
