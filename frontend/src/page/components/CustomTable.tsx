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
  Flex,
  Heading,
  HStack,
  useColorModeValue,
  Center,
  VStack,
  Icon,
  Avatar,
  Box
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiInbox, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { User } from '../types/user.types';

interface CustomTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading: boolean;
}

type SortField = 'name' | 'company' | 'role' | 'country';
type SortOrder = 'asc' | 'desc';

export const CustomTable: React.FC<CustomTableProps> = ({ users, onEdit, onDelete, isLoading }) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('blue.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <Icon as={FiChevronUp} ml={1} opacity={0.3} />;
    return sortOrder === 'asc' ? (
      <Icon as={FiChevronUp} ml={1} color="blue.400" />
    ) : (
      <Icon as={FiChevronDown} ml={1} color="blue.400" />
    );
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aVal = '';
    let bVal = '';

    if (sortField === 'name') {
      aVal = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
      bVal = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
    } else if (sortField === 'company') {
      aVal = (a.company?.name || 'Freelance').toLowerCase();
      bVal = (b.company?.name || 'Freelance').toLowerCase();
    } else if (sortField === 'role') {
      aVal = (a.company?.title || a.role || '').toLowerCase();
      bVal = (b.company?.title || b.role || '').toLowerCase();
    } else if (sortField === 'country') {
      aVal = (a.address?.country || '').toLowerCase();
      bVal = (b.address?.country || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getRoleBadge = (title: string) => {
    const t = (title || '').toLowerCase();
    if (t.includes('chief') || t.includes('ceo') || t.includes('cfo') || t.includes('cto') || t.includes('director'))
      return 'purple';
    if (t.includes('manager') || t.includes('lead')) return 'blue';
    if (t.includes('engineer') || t.includes('developer') || t.includes('architect')) return 'cyan';
    if (t.includes('analyst') || t.includes('data') || t.includes('scientist')) return 'teal';
    if (t.includes('designer') || t.includes('ux') || t.includes('ui')) return 'pink';
    if (t.includes('support') || t.includes('specialist') || t.includes('consultant')) return 'orange';
    if (t.includes('legal') || t.includes('counsel') || t.includes('compliance')) return 'red';
    if (t.includes('hr') || t.includes('human resource') || t.includes('recruiter')) return 'green';
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
          <Text color="gray.400">Try adjusting your search or filters.</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <TableContainer bg={bg} border="1px" borderColor={borderColor} borderRadius="2xl" boxShadow="sm" overflowX="auto">
      <Table variant="simple" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th
              cursor="pointer"
              onClick={() => handleSort('name')}
              userSelect="none"
              py={4}
              fontSize="xs"
              letterSpacing="wider"
            >
              <Flex align="center">
                Employee <SortIcon field="name" />
              </Flex>
            </Th>

            <Th
              cursor="pointer"
              onClick={() => handleSort('company')}
              userSelect="none"
              py={4}
              fontSize="xs"
              letterSpacing="wider"
            >
              <Flex align="center">
                Company <SortIcon field="company" />
              </Flex>
            </Th>

            <Th
              cursor="pointer"
              onClick={() => handleSort('role')}
              userSelect="none"
              py={4}
              fontSize="xs"
              letterSpacing="wider"
            >
              <Flex align="center">
                Role <SortIcon field="role" />
              </Flex>
            </Th>

            <Th
              cursor="pointer"
              onClick={() => handleSort('country')}
              userSelect="none"
              py={4}
              fontSize="xs"
              letterSpacing="wider"
            >
              <Flex align="center">
                Country <SortIcon field="country" />
              </Flex>
            </Th>

            <Th py={4} textAlign="center" fontSize="xs" letterSpacing="wider" width="110px">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedUsers.map((user) => (
            <Tr key={user.id} _hover={{ bg: hoverBg }} transition="background 0.15s" cursor="default">
              <Td py={4}>
                <HStack spacing={3}>
                  <Avatar name={`${user.firstName} ${user.lastName}`} src={user.image} size="sm" borderRadius="xl" />
                  <Box>
                    <Text fontWeight="semibold" color={textColor} fontSize="sm">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text fontSize="xs" color={subTextColor} noOfLines={1}>
                      {user.email}
                    </Text>
                  </Box>
                </HStack>
              </Td>

              <Td py={4}>
                <Box>
                  <Text fontWeight="semibold" color={textColor} fontSize="sm">
                    {user.company?.name || 'Freelance'}
                  </Text>
                  {user.company?.department && (
                    <Text fontSize="xs" color={subTextColor}>
                      {user.company.department}
                    </Text>
                  )}
                </Box>
              </Td>

              <Td py={4}>
                <Tag
                  size="md"
                  variant="subtle"
                  colorScheme={getRoleBadge(user.company?.title || '')}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  <TagLabel fontWeight="medium" fontSize="xs">
                    {user.company?.title || user.role}
                  </TagLabel>
                </Tag>
              </Td>

              <Td py={4}>
                <HStack spacing={2}>
                  <Text fontSize="sm" color={textColor} fontWeight="medium">
                    {user.address?.country || 'United States'}
                  </Text>
                </HStack>
              </Td>

              <Td py={4}>
                <HStack spacing={2} justify="center">
                  <IconButton
                    aria-label="Edit employee"
                    icon={<FiEdit2 size={15} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onEdit(user)}
                    borderRadius="lg"
                    _hover={{ bg: 'blue.50', _dark: { bg: 'blue.900' } }}
                  />
                  <IconButton
                    aria-label="Delete employee"
                    icon={<FiTrash2 size={15} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(user)}
                    borderRadius="lg"
                    _hover={{ bg: 'red.50', _dark: { bg: 'red.900' } }}
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

export default CustomTable;
