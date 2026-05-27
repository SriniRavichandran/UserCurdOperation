import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Skeleton,
  SkeletonCircle,
  Box,
  useColorModeValue
} from '@chakra-ui/react';

export const TableSkeleton: React.FC = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // Create an array of 5 rows to render
  const rows = Array.from({ length: 5 });

  return (
    <Box overflowX="auto" borderRadius="2xl" border="1px" borderColor={borderColor} bg={bg} p={2}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w="80px">Employee</Th>
            <Th>Details</Th>
            <Th>Company</Th>
            <Th>Role</Th>
            <Th isNumeric>Salary</Th>
            <Th w="100px" textAlign="center">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((_, index) => (
            <Tr key={index}>
              <Td>
                <HStack spacing={3}>
                  <SkeletonCircle size="10" />
                  <Box>
                    <Skeleton h="16px" w="120px" mb={2} />
                    <Skeleton h="12px" w="80px" />
                  </Box>
                </HStack>
              </Td>
              <Td>
                <Skeleton h="16px" w="180px" mb={2} />
                <Skeleton h="12px" w="140px" />
              </Td>
              <Td>
                <Skeleton h="16px" w="130px" mb={2} />
                <Skeleton h="12px" w="90px" />
              </Td>
              <Td>
                <Skeleton h="20px" w="70px" borderRadius="full" />
              </Td>
              <Td isNumeric>
                <Skeleton h="16px" w="60px" ml="auto" />
              </Td>
              <Td>
                <HStack spacing={2} justify="center">
                  <Skeleton h="32px" w="32px" borderRadius="lg" />
                  <Skeleton h="32px" w="32px" borderRadius="lg" />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableSkeleton;
