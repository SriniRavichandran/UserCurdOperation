import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiBriefcase, FiDatabase, FiServer } from 'react-icons/fi';
import { ApiMode } from '../../core/api/client';

interface MainLayoutProps {
  children: React.ReactNode;
  apiMode: ApiMode;
  onApiModeChange: (mode: ApiMode) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, apiMode, onApiModeChange }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const headerBg = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
  );
  const bodyBg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bodyBg} pb={12}>
      <Box bg={headerBg} color="white" py={8} px={4} mb={8} boxShadow="lg" position="relative">
        <Container maxW="container.xl">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
          >
            <Box>
              <HStack spacing={3} mb={1}>
                <Icon as={FiBriefcase} w={8} h={8} />
                <Heading size="lg" fontFamily="'Outfit', sans-serif">
                  Enterprise Directory
                </Heading>
              </HStack>
              <Text opacity={0.8} fontSize="sm">
                A state-of-the-art CRUD interface to manage user databases, salaries, and corporate roles.
              </Text>
            </Box>

            <HStack
              spacing={4}
              align="center"
              width={{ base: '100%', md: 'auto' }}
              justify={{ base: 'space-between', md: 'flex-end' }}
            >
              <Tooltip label="Toggle UI Light/Dark theme">
                <IconButton
                  aria-label="Toggle Theme"
                  icon={colorMode === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  borderRadius="xl"
                />
              </Tooltip>

              <Box bg="whiteAlpha.100" p={2} borderRadius="2xl" border="1px" borderColor="whiteAlpha.200">
                <RadioGroup onChange={(val) => onApiModeChange(val as ApiMode)} value={apiMode}>
                  <Stack direction="row" spacing={4}>
                    <Radio value="express" colorScheme="blue">
                      <HStack spacing={1}>
                        <Icon as={FiServer} size={14} />
                        <Text fontSize="xs" fontWeight="semibold">
                          Express API (Port 5000)
                        </Text>
                      </HStack>
                    </Radio>
                    <Radio value="json-server" colorScheme="purple">
                      <HStack spacing={1}>
                        <Icon as={FiDatabase} size={14} />
                        <Text fontSize="xs" fontWeight="semibold">
                          JSON Server (Port 5001)
                        </Text>
                      </HStack>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl">{children}</Container>
    </Box>
  );
};

export default MainLayout;
