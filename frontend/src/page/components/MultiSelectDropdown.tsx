import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  Checkbox,
  VStack,
  HStack,
  Text,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  colorScheme?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  colorScheme = 'blue'
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const filtered = options.filter((o) => o.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const clearAll = () => onChange([]);
  const selectAll = () => onChange([...options]);

  return (
    <Popover placement="bottom-start" closeOnBlur>
      <PopoverTrigger>
        <Button
          rightIcon={<FiChevronDown />}
          variant="outline"
          borderRadius="xl"
          size="md"
          bg={bg}
          borderColor={selected.length > 0 ? `${colorScheme}.400` : borderColor}
          color={selected.length > 0 ? `${colorScheme}.600` : 'gray.500'}
          fontWeight="normal"
          _dark={{
            color: selected.length > 0 ? `${colorScheme}.300` : 'gray.400'
          }}
          minW="160px"
          justifyContent="space-between"
        >
          {selected.length === 0
            ? `All ${label}s`
            : selected.length === 1
              ? selected[0].length > 18
                ? selected[0].substring(0, 18) + '…'
                : selected[0]
              : `${selected.length} ${label}s selected`}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="280px" bg={bg} borderColor={borderColor} borderRadius="2xl" boxShadow="xl" zIndex={200}>
        <PopoverBody p={3}>
          <InputGroup size="sm" mb={2}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder={`Search ${label.toLowerCase()}s…`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="lg"
              bg={bg}
            />
          </InputGroup>

          <HStack spacing={2} mb={2}>
            <Button size="xs" variant="ghost" colorScheme={colorScheme} onClick={selectAll} borderRadius="md">
              All
            </Button>
            <Button size="xs" variant="ghost" colorScheme="gray" onClick={clearAll} borderRadius="md">
              Clear
            </Button>
          </HStack>

          <Divider mb={2} />

          <VStack align="stretch" spacing={0} maxH="220px" overflowY="auto">
            {filtered.length === 0 ? (
              <Text fontSize="sm" color="gray.400" textAlign="center" py={2}>
                No results
              </Text>
            ) : (
              filtered.map((opt) => (
                <Box key={opt} px={2} py={1.5} borderRadius="lg" cursor="pointer" _hover={{ bg: hoverBg }}>
                  <Checkbox
                    isChecked={selected.includes(opt)}
                    onChange={() => toggle(opt)}
                    colorScheme={colorScheme}
                    w="100%"
                    size="sm"
                    fontWeight={selected.includes(opt) ? 'semibold' : 'normal'}
                  >
                    <Text fontSize="sm" noOfLines={1}>
                      {opt}
                    </Text>
                  </Checkbox>
                </Box>
              ))
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectDropdown;
