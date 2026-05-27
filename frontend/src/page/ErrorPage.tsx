import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon, useColorModeValue, Container, Code } from '@chakra-ui/react';
import { FiRefreshCw, FiAlertOctagon } from 'react-icons/fi';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textMuted = useColorModeValue('gray.500', 'gray.400');

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box bg={bg} minH="100vh" py={20} display="flex" alignItems="center">
      <Container maxW="lg">
        <Box
          bg={cardBg}
          border="1px"
          borderColor={borderColor}
          borderRadius="3xl"
          p={8}
          textAlign="center"
          boxShadow="xl"
          position="relative"
          overflow="hidden"
        >
          {/* Top gradient line */}
          <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient="linear(to-r, red.400, orange.500)" />

          <VStack spacing={6}>
            <Box
              p={4}
              bg="orange.50"
              color="orange.500"
              borderRadius="2xl"
              _dark={{ bg: 'orange.900/20', color: 'orange.300' }}
            >
              <Icon as={FiAlertOctagon} boxSize={12} />
            </Box>

            <VStack spacing={2}>
              <Heading size="2xl" fontWeight="black" letterSpacing="tight" color="orange.500">
                500
              </Heading>
              <Heading size="md" fontWeight="bold" fontFamily="'Outfit', sans-serif">
                System Error
              </Heading>
              <Text color={textMuted} fontSize="sm">
                Something went wrong on the server or in the application. Please try reloading or check back shortly.
              </Text>
            </VStack>

            {error && (
              <Box
                w="full"
                maxH="150px"
                overflowY="auto"
                textAlign="left"
                p={3}
                borderRadius="lg"
                bg="gray.100"
                _dark={{ bg: 'gray.900' }}
              >
                <Code colorScheme="red" fontSize="xs" whiteSpace="pre-wrap">
                  {error.message || 'Unknown application error'}
                </Code>
              </Box>
            )}

            <Button
              leftIcon={<FiRefreshCw />}
              colorScheme="orange"
              onClick={handleRetry}
              borderRadius="xl"
              w="full"
              py={6}
              boxShadow="lg"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'xl' }}
              transition="all 0.2s"
            >
              Retry Connection
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
