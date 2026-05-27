import React from 'react';
import { HStack, Button, Text, Select, Flex, IconButton, useColorModeValue, Badge } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange
}) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'stretch', md: 'center' }}
      justify="space-between"
      mt={4}
      px={4}
      py={3}
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      gap={3}
    >
      <HStack spacing={2}>
        <Text fontSize="sm" color={textColor}>
          Showing
        </Text>
        <Badge colorScheme="blue" borderRadius="md" px={2}>
          {total > 0 ? `${start}–${end}` : '0'}
        </Badge>
        <Text fontSize="sm" color={textColor}>
          of <strong>{total}</strong> employees
        </Text>
      </HStack>

      <HStack spacing={1}>
        <IconButton
          aria-label="First page"
          icon={<FiChevronsLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(1)}
          isDisabled={page <= 1}
          borderRadius="lg"
        />
        <IconButton
          aria-label="Previous page"
          icon={<FiChevronLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          isDisabled={page <= 1}
          borderRadius="lg"
        />

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <Text key={`dots-${i}`} px={2} color={textColor} fontSize="sm">
              …
            </Text>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === page ? 'solid' : 'ghost'}
              colorScheme={p === page ? 'blue' : 'gray'}
              onClick={() => onPageChange(p as number)}
              borderRadius="lg"
              minW="36px"
              fontWeight={p === page ? 'bold' : 'normal'}
            >
              {p}
            </Button>
          )
        )}

        <IconButton
          aria-label="Next page"
          icon={<FiChevronRight />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page >= totalPages}
          borderRadius="lg"
        />
        <IconButton
          aria-label="Last page"
          icon={<FiChevronsRight />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(totalPages)}
          isDisabled={page >= totalPages}
          borderRadius="lg"
        />
      </HStack>

      <HStack spacing={2}>
        <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
          Rows per page:
        </Text>
        <Select
          size="sm"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          borderRadius="lg"
          w="80px"
          bg={bg}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </Select>
      </HStack>
    </Flex>
  );
};

export default Pagination;
