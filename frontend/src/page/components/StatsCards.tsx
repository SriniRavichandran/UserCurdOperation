import React from 'react';
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiUsers, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { UserStats } from '../types/user.types';

interface StatsCardsProps {
  stats: UserStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }} mb={8}>
      {/* Total Employees */}
      <Box
        px={{ base: 4, md: 6 }}
        py="5"
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        boxShadow="sm"
        position="relative"
        overflow="hidden"
        _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out', boxShadow: 'md' }}
        transition="all 0.2s"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stat>
            <StatLabel fontSize="sm" fontWeight="semibold" color={labelColor} textTransform="uppercase">
              Total Headcount
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mt={1}>
              {stats.totalUsers}
            </StatNumber>
            <StatHelpText mb={0}>Active staff members</StatHelpText>
          </Stat>
          <Flex
            h={12}
            w={12}
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            bg="blue.50"
            color="blue.500"
            _dark={{ bg: 'blue.900/30', color: 'blue.300' }}
          >
            <Icon as={FiUsers} h={6} w={6} />
          </Flex>
        </Flex>
      </Box>

      {/* Average Salary */}
      <Box
        px={{ base: 4, md: 6 }}
        py="5"
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        boxShadow="sm"
        position="relative"
        overflow="hidden"
        _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out', boxShadow: 'md' }}
        transition="all 0.2s"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stat>
            <StatLabel fontSize="sm" fontWeight="semibold" color={labelColor} textTransform="uppercase">
              Average Salary
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mt={1}>
              {formatCurrency(stats.averageSalary)}
            </StatNumber>
            <StatHelpText mb={0}>Annual average pay</StatHelpText>
          </Stat>
          <Flex
            h={12}
            w={12}
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            bg="green.50"
            color="green.500"
            _dark={{ bg: 'green.900/30', color: 'green.300' }}
          >
            <Icon as={FiDollarSign} h={6} w={6} />
          </Flex>
        </Flex>
      </Box>

      {/* Top Company */}
      <Box
        px={{ base: 4, md: 6 }}
        py="5"
        bg={cardBg}
        border="1px"
        borderColor={cardBorder}
        borderRadius="2xl"
        boxShadow="sm"
        position="relative"
        overflow="hidden"
        _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s ease-in-out', boxShadow: 'md' }}
        transition="all 0.2s"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Stat>
            <StatLabel fontSize="sm" fontWeight="semibold" color={labelColor} textTransform="uppercase">
              Top Employer
            </StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mt={1} isTruncated maxW="180px">
              {stats.topCompany}
            </StatNumber>
            <StatHelpText mb={0}>Company with most users</StatHelpText>
          </Stat>
          <Flex
            h={12}
            w={12}
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            bg="purple.50"
            color="purple.500"
            _dark={{ bg: 'purple.900/30', color: 'purple.300' }}
          >
            <Icon as={FiBriefcase} h={6} w={6} />
          </Flex>
        </Flex>
      </Box>
    </SimpleGrid>
  );
};
