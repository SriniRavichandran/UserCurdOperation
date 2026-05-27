import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Tag,
  TagLabel,
  Text,
  Badge,
  Flex,
  Heading,
  HStack,
  useColorModeValue,
  Center,
  VStack,
  Icon
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiInbox, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { User } from '../types/user.types';

interface CustomTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading: boolean;
}

type SortField = 'username' | 'company' | 'role' | 'email' | 'salary';
type SortOrder = 'asc' | 'desc';

export const CustomTable: React.FC<CustomTableProps> = ({ users, onEdit, onDelete, isLoading }) => {
  const [sortField, setSortField] = useState<SortField>('username');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const headerBg = useColorModeValue('gray.50/50', 'gray.900/30');
  const hoverBg = useColorModeValue('gray.50/50', 'gray.800/40');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Helper for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <Icon as={FiChevronUp} ml={1} /> : <Icon as={FiChevronDown} ml={1} />;
  };

  // Sort logic
  const sortedUsers = [...users].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'salary') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Helper for role coloring
  const getRoleColorScheme = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('engineer') || r.includes('developer')) return 'blue';
    if (r.includes('manager') || r.includes('lead')) return 'purple';
    if (r.includes('designer') || r.includes('ux') || r.includes('ui')) return 'pink';
    if (r.includes('analyst') || r.includes('data') || r.includes('science')) return 'teal';
    if (r.includes('admin') || r.includes('ops') || r.includes('devops')) return 'orange';
    return 'gray';
  };

  if (!isLoading && sortedUsers.length === 0) {
    return (
      <Center py={16} bg={bg} border="1px" borderColor={borderColor} borderRadius="2xl" boxShadow="sm">
        <VStack spacing={4}>
          <Icon as={FiInbox} w={12} h={12} color="gray.400" />
          <Heading size="md" color="gray.500">
            No employees found
          </Heading>
          <Text color="gray.400">Try adjusting your search query or filters.</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <TableContainer
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      boxShadow="sm"
      position="relative"
      overflowX="auto"
    >
      <Table variant="simple" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort('username')} userSelect="none" py={4}>
              <Flex align="center">Username {getSortIcon('username')}</Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('company')} userSelect="none" py={4}>
              <Flex align="center">Company {getSortIcon('company')}</Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('role')} userSelect="none" py={4}>
              <Flex align="center">Role {getSortIcon('role')}</Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('email')} userSelect="none" py={4}>
              <Flex align="center">Email {getSortIcon('email')}</Flex>
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('salary')} userSelect="none" py={4} isNumeric>
              <Flex align="center" justify="flex-end">
                Salary {getSortIcon('salary')}
              </Flex>
            </Th>
            <Th py={4} textAlign="center" width="120px">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers.map((user) => (
            <Tr key={user.id} _hover={{ bg: hoverBg }} transition="background 0.15s">
              {/* Username */}
              <Td py={4} fontWeight="medium">
                <Text color={textColor}>{user.username}</Text>
              </Td>

              {/* Company */}
              <Td py={4}>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="gray"
                  textTransform="none"
                  fontWeight="semibold"
                >
                  {user.company}
                </Badge>
              </Td>

              {/* Role */}
              <Td py={4}>
                <Tag size="md" variant="subtle" colorScheme={getRoleColorScheme(user.role)} borderRadius="full">
                  <TagLabel fontWeight="medium">{user.role}</TagLabel>
                </Tag>
              </Td>

              {/* Email */}
              <Td py={4}>
                <Text color="gray.500" _dark={{ color: 'gray.400' }} fontSize="sm">
                  {user.email}
                </Text>
              </Td>

              {/* Salary */}
              <Td py={4} isNumeric fontWeight="semibold">
                <Text color="green.600" _dark={{ color: 'green.300' }}>
                  {formatCurrency(user.salary)}
                </Text>
              </Td>

              {/* Actions */}
              <Td py={4}>
                <HStack spacing={2} justify="center">
                  <IconButton
                    aria-label="Edit employee"
                    icon={<FiEdit2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onEdit(user)}
                    borderRadius="lg"
                  />
                  <IconButton
                    aria-label="Delete employee"
                    icon={<FiTrash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(user)}
                    borderRadius="lg"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
