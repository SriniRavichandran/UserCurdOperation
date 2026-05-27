import React from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { MultiSelectDropdown } from './MultiSelectDropdown';

interface SearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  companyFilter: string[];
  setCompanyFilter: (val: string[]) => void;
  roleFilter: string[];
  setRoleFilter: (val: string[]) => void;
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
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const hasActiveFilters = search || companyFilter.length > 0 || roleFilter.length > 0;

  const removeCompany = (c: string) => setCompanyFilter(companyFilter.filter((x) => x !== c));
  const removeRole = (r: string) => setRoleFilter(roleFilter.filter((x) => x !== r));

  return (
    <Box>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing={3}
        mb={3}
        w="100%"
        alignItems={{ base: 'stretch', lg: 'center' }}
      >
        <InputGroup maxW={{ base: '100%', lg: '320px' }} size="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search by name, email, username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            borderRadius="xl"
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)' }}
          />
        </InputGroup>

        <MultiSelectDropdown
          label="Company"
          options={companies}
          selected={companyFilter}
          onChange={setCompanyFilter}
          colorScheme="purple"
        />

        <MultiSelectDropdown
          label="Role"
          options={roles}
          selected={roleFilter}
          onChange={setRoleFilter}
          colorScheme="teal"
        />

        <Flex gap={2} ml={{ lg: 'auto' }} width={{ base: '100%', lg: 'auto' }}>
          {hasActiveFilters && (
            <Button
              leftIcon={<Icon as={FiX} />}
              variant="ghost"
              onClick={onClear}
              colorScheme="red"
              borderRadius="xl"
              flex={{ base: 1, lg: 'initial' }}
              size="md"
            >
              Clear All
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

      {(companyFilter.length > 0 || roleFilter.length > 0) && (
        <Wrap spacing={2} mb={2}>
          {companyFilter.map((c) => (
            <WrapItem key={`company-${c}`}>
              <Tag size="sm" colorScheme="purple" borderRadius="full" variant="subtle">
                <TagLabel>🏢 {c}</TagLabel>
                <TagCloseButton onClick={() => removeCompany(c)} />
              </Tag>
            </WrapItem>
          ))}
          {roleFilter.map((r) => (
            <WrapItem key={`role-${r}`}>
              <Tag size="sm" colorScheme="teal" borderRadius="full" variant="subtle">
                <TagLabel>👔 {r}</TagLabel>
                <TagCloseButton onClick={() => removeRole(r)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </Box>
  );
};

export default SearchFilter;
