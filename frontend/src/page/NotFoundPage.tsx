import React from 'react';
import { Box, Heading, Text, Button, VStack, Icon, useColorModeValue, Container } from '@chakra-ui/react';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textMuted = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box bg={bg} minH="100vh" py={20} display="flex" alignItems="center">
      <Container maxW="md">
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
          {/* Subtle top gradient line */}
          <Box position="absolute" top={0} left={0} right={0} h="4px" bgGradient="linear(to-r, blue.400, purple.500)" />

          <VStack spacing={6}>
            <Box p={4} bg="red.50" color="red.500" borderRadius="2xl" _dark={{ bg: 'red.900/20', color: 'red.300' }}>
              <Icon as={FiAlertTriangle} boxSize={12} />
            </Box>

            <VStack spacing={2}>
              <Heading size="2xl" fontWeight="black" letterSpacing="tight" color="red.500">
                404
              </Heading>
              <Heading size="md" fontWeight="bold" fontFamily="'Outfit', sans-serif">
                Page Not Found
              </Heading>
              <Text color={textMuted} fontSize="sm">
                The page you are looking for does not exist or has been moved.
              </Text>
            </VStack>

            <Button
              leftIcon={<FiHome />}
              colorScheme="blue"
              onClick={() => navigate('/')}
              borderRadius="xl"
              w="full"
              py={6}
              boxShadow="lg"
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'xl' }}
              transition="all 0.2s"
            >
              Return Home
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
