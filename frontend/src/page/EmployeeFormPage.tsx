import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  useToast,
  useColorModeValue,
  SimpleGrid,
  Text,
  Badge,
  Divider,
  Heading,
  Container,
  Flex,
  Icon,
  Spinner,
  Center,
  Avatar,
  Progress,
  Circle
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight, FiSave, FiCheck } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { UserInput } from './types/user.types';
import { FormErrors, validateUserForm } from '../shared/lib/validation/user.schema';
import { userService } from './services/user.service';
import { ApiMode } from '../core/api/client';

interface EmployeeFormPageProps {
  apiMode: ApiMode;
  mode: 'add' | 'edit';
}

const STEPS = [
  { label: 'Personal', emoji: '👤' },
  { label: 'Account', emoji: '📧' },
  { label: 'Company', emoji: '🏢' },
  { label: 'Financial', emoji: '💰' },
  { label: 'Technical', emoji: '🖥️' }
];

const STEP_REQUIRED_FIELDS: (keyof FormErrors)[][] = [
  ['firstName', 'lastName', 'age', 'birthDate'],
  ['email', 'phone', 'username', 'password'],
  ['company.name', 'company.title'],
  ['salary'],
  []
];

const initialFormState: UserInput = {
  firstName: '',
  lastName: '',
  maidenName: '',
  age: 30,
  gender: 'female',
  email: '',
  phone: '',
  username: '',
  password: '',
  birthDate: '',
  image: '',
  bloodGroup: '',
  height: 170,
  weight: 65,
  eyeColor: '',
  hair: { color: '', type: '' },
  address: {
    address: '',
    city: '',
    state: '',
    stateCode: '',
    postalCode: '',
    coordinates: { lat: 0, lng: 0 },
    country: 'United States'
  },
  ip: '',
  macAddress: '',
  university: '',
  bank: { cardExpire: '', cardNumber: '', cardType: '', currency: 'USD', iban: '' },
  company: {
    department: '',
    name: '',
    title: '',
    address: {
      address: '',
      city: '',
      state: '',
      stateCode: '',
      postalCode: '',
      coordinates: { lat: 0, lng: 0 },
      country: 'United States'
    }
  },
  ein: '',
  ssn: '',
  userAgent: '',
  crypto: { coin: 'Bitcoin', wallet: '', network: 'Ethereum (ERC20)' },
  role: 'user',
  salary: 50000
};

const EmployeeFormPage: React.FC<EmployeeFormPageProps> = ({ apiMode, mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<UserInput>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedStep, setTouchedStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(mode === 'edit');

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textMuted = useColorModeValue('gray.500', 'gray.400');
  const stepBg = useColorModeValue('gray.100', 'gray.700');
  const footerBg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const backBtnBg = useColorModeValue('gray.50', 'gray.700');
  const backBtnHoverBg = useColorModeValue('gray.100', 'gray.600');

  const totalSteps = STEPS.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isEditMode = mode === 'edit';

  const allErrors: FormErrors = useMemo(() => validateUserForm(formData, isEditMode).errors, [formData, isEditMode]);

  const currentStepFields = STEP_REQUIRED_FIELDS[currentStep];
  const stepHasErrors = currentStepFields.some((field) => !!allErrors[field]);
  const nextDisabled = stepHasErrors;

  const canJumpToStep = (targetStep: number) => {
    if (targetStep <= currentStep) return true;
    for (let i = 0; i < targetStep; i++) {
      if (STEP_REQUIRED_FIELDS[i].some((field) => !!allErrors[field])) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (mode === 'edit' && id) {
      setIsLoadingUser(true);
      userService
        .getUserById(apiMode, parseInt(id))
        .then((user) => {
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            maidenName: user.maidenName || '',
            age: user.age || 0,
            gender: user.gender || 'female',
            email: user.email || '',
            phone: user.phone || '',
            username: user.username || '',
            password: '',
            birthDate: user.birthDate || '',
            image: user.image || '',
            bloodGroup: user.bloodGroup || '',
            height: user.height ? Number(user.height) : 0,
            weight: user.weight ? Number(user.weight) : 0,
            eyeColor: user.eyeColor || '',
            hair: { color: user.hair?.color || '', type: user.hair?.type || '' },
            address: {
              address: user.address?.address || '',
              city: user.address?.city || '',
              state: user.address?.state || '',
              stateCode: user.address?.stateCode || '',
              postalCode: user.address?.postalCode || '',
              coordinates: {
                lat: user.address?.coordinates?.lat ? Number(user.address.coordinates.lat) : 0,
                lng: user.address?.coordinates?.lng ? Number(user.address.coordinates.lng) : 0
              },
              country: user.address?.country || 'United States'
            },
            ip: user.ip || '',
            macAddress: user.macAddress || '',
            university: user.university || '',
            bank: {
              cardExpire: user.bank?.cardExpire || '',
              cardNumber: user.bank?.cardNumber || '',
              cardType: user.bank?.cardType || '',
              currency: user.bank?.currency || 'USD',
              iban: user.bank?.iban || ''
            },
            company: {
              department: user.company?.department || '',
              name: user.company?.name || '',
              title: user.company?.title || '',
              address: {
                address: user.company?.address?.address || '',
                city: user.company?.address?.city || '',
                state: user.company?.address?.state || '',
                stateCode: user.company?.address?.stateCode || '',
                postalCode: user.company?.address?.postalCode || '',
                coordinates: {
                  lat: user.company?.address?.coordinates?.lat ? Number(user.company.address.coordinates.lat) : 0,
                  lng: user.company?.address?.coordinates?.lng ? Number(user.company.address.coordinates.lng) : 0
                },
                country: user.company?.address?.country || 'United States'
              }
            },
            ein: user.ein || '',
            ssn: user.ssn || '',
            userAgent: user.userAgent || '',
            crypto: {
              coin: user.crypto?.coin || 'Bitcoin',
              wallet: user.crypto?.wallet || '',
              network: user.crypto?.network || 'Ethereum (ERC20)'
            },
            role: user.role || 'user',
            salary: user.salary ? Number(user.salary) : 50000
          });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Could not load employee data',
            status: 'error',
            position: 'top-right'
          });
          navigate('/');
        })
        .finally(() => setIsLoadingUser(false));
    }
  }, [mode, id, apiMode, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData((prev: any) => {
        const updated = { ...prev };
        let cur = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = { ...cur[parts[i]] };
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNumberChange = (name: string, valueString: string) => {
    const numericValue = valueString === '' ? 0 : Number(valueString);
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData((prev: any) => {
        const updated = { ...prev };
        let cur = updated;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = { ...cur[parts[i]] };
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = numericValue;
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    }
  };

  const handleNext = () => {
    setTouchedStep(true);
    if (stepHasErrors) {
      const stepErrors: FormErrors = {};
      currentStepFields.forEach((f) => {
        if (allErrors[f]) stepErrors[f] = allErrors[f];
      });
      setErrors(stepErrors);
      return;
    }
    setTouchedStep(false);
    setErrors({});
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setTouchedStep(false);
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const { isValid, errors: validationErrors } = validateUserForm(formData, isEditMode);
    if (!isValid) {
      setErrors(validationErrors);
      toast({
        title: 'Validation Errors',
        description: 'Please check all steps — some required fields are missing.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await userService.updateUser(apiMode, parseInt(id), formData);
        toast({ title: 'Employee Updated', status: 'success', duration: 3000, position: 'top-right' });
      } else {
        await userService.createUser(apiMode, formData);
        toast({ title: 'Employee Added! 🎉', status: 'success', duration: 3000, position: 'top-right' });
      }
      navigate('/');
    } catch (error: any) {
      const apiMessage = error.response?.data?.message || 'Failed to save employee';
      toast({ title: 'Error', description: apiMessage, status: 'error', duration: 4000, position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <Center h="60vh">
        <VStack>
          <Spinner size="xl" thickness="4px" color="blue.500" />
          <Text color={textMuted}>Loading employee data…</Text>
        </VStack>
      </Center>
    );
  }

  const stepError = (field: keyof FormErrors) => (touchedStep ? errors[field] : undefined);

  return (
    <Box bg={pageBg} minH="100vh" pb={10}>
      <Container maxW="5xl" pt={6}>
        <Flex
          align="center"
          justify="space-between"
          mb={6}
          bg={headerBg}
          backdropFilter="blur(12px)"
          border="1px"
          borderColor={borderColor}
          borderRadius="2xl"
          p={5}
          boxShadow="lg"
          position="relative"
        >
          {/* Top accent line */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bgGradient="linear(to-r, blue.400, purple.500)"
            borderTopRadius="2xl"
          />

          <HStack spacing={5} w="full" justify="space-between">
            <HStack spacing={4}>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="outline"
                onClick={() => navigate('/')}
                borderRadius="xl"
                size="sm"
                borderColor={borderColor}
                bg={backBtnBg}
                _hover={{
                  bg: backBtnHoverBg,
                  transform: 'translateX(-3px)',
                  boxShadow: 'md'
                }}
                _active={{ transform: 'translateX(-1px)' }}
                transition="all 0.2s"
                fontWeight="semibold"
              >
                Back to List
              </Button>
              <Divider orientation="vertical" h="30px" borderColor={borderColor} />
              <HStack spacing={4}>
                {mode === 'edit' && formData.image && !formData.image.includes('placeholder') ? (
                  <Avatar
                    src={formData.image}
                    name={`${formData.firstName} ${formData.lastName}`}
                    size="md"
                    borderRadius="xl"
                    boxShadow="sm"
                    border="2px"
                    borderColor="blue.400"
                  />
                ) : (
                  <Circle
                    size="48px"
                    bgGradient="linear(to-br, blue.400, purple.500)"
                    color="white"
                    borderRadius="xl"
                    boxShadow="md"
                  >
                    <Heading size="sm" fontWeight="bold">
                      {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 'E'}
                    </Heading>
                  </Circle>
                )}
                <Box>
                  <Heading size="md" fontWeight="bold" fontFamily="'Outfit', sans-serif" letterSpacing="tight">
                    {mode === 'add' ? 'Add Employee' : `Edit: ${formData.firstName} ${formData.lastName}`}
                  </Heading>
                  <HStack spacing={3} mt={1} align="center">
                    <Badge
                      bgGradient={
                        mode === 'add' ? 'linear(to-r, green.400, teal.500)' : 'linear(to-r, blue.400, purple.500)'
                      }
                      color="white"
                      borderRadius="lg"
                      px={2.5}
                      py={0.5}
                      fontSize="2xs"
                      fontWeight="bold"
                      textShadow="0 1px 2px rgba(0,0,0,0.15)"
                      border="none"
                    >
                      {mode === 'add' ? 'CREATE' : 'UPDATE'}
                    </Badge>
                    <HStack spacing={1.5}>
                      <Box w="6px" h="6px" borderRadius="full" bg="blue.400" className="pulse-dot" />
                      <Text fontSize="xs" color={textMuted} fontWeight="semibold">
                        Step {currentStep + 1} of {totalSteps} — {STEPS[currentStep].emoji} {STEPS[currentStep].label}
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
              </HStack>
            </HStack>

            {/* Premium step progress display on the right side of header */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              {STEPS.map((_, idx) => (
                <Box
                  key={idx}
                  w="16px"
                  h="6px"
                  borderRadius="full"
                  bg={idx <= currentStep ? 'blue.400' : borderColor}
                  transition="all 0.3s"
                />
              ))}
            </HStack>
          </HStack>
        </Flex>

        <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="2xl" px={6} py={4} mb={4} boxShadow="sm">
          <Flex justify="space-between" align="center" mb={3}>
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              const clickable = canJumpToStep(idx);
              return (
                <Flex
                  key={idx}
                  direction="column"
                  align="center"
                  flex={1}
                  cursor={clickable ? 'pointer' : 'not-allowed'}
                  onClick={() => {
                    if (clickable) {
                      setCurrentStep(idx);
                      setTouchedStep(false);
                      setErrors({});
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (clickable) {
                        setCurrentStep(idx);
                        setTouchedStep(false);
                        setErrors({});
                      }
                    }
                  }}
                  outline="none"
                >
                  <HStack w="100%" justify="center" position="relative">
                    {idx > 0 && (
                      <Box
                        position="absolute"
                        left="0"
                        right="50%"
                        h="2px"
                        bg={isDone || isActive ? 'blue.400' : stepBg}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={0}
                      />
                    )}
                    {idx < totalSteps - 1 && (
                      <Box
                        position="absolute"
                        left="50%"
                        right="0"
                        h="2px"
                        bg={isDone ? 'blue.400' : stepBg}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={0}
                      />
                    )}
                    <Circle
                      size="36px"
                      bg={isDone ? 'green.400' : isActive ? 'blue.500' : stepBg}
                      color={isDone || isActive ? 'white' : textMuted}
                      fontWeight="bold"
                      fontSize="sm"
                      zIndex={1}
                      boxShadow={isActive ? '0 0 0 3px rgba(66,153,225,0.4)' : 'none'}
                      transition="all 0.2s"
                      _hover={clickable ? { transform: 'scale(1.1)', filter: 'brightness(1.1)' } : {}}
                    >
                      {isDone ? <Icon as={FiCheck} /> : idx + 1}
                    </Circle>
                  </HStack>
                  <Text
                    mt={1}
                    fontSize="xs"
                    textAlign="center"
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'blue.500' : isDone ? 'green.500' : textMuted}
                    _hover={clickable ? { color: 'blue.400' } : {}}
                    transition="all 0.15s"
                  >
                    {step.emoji} {step.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
          <Progress value={progress} size="xs" colorScheme="blue" borderRadius="full" hasStripe isAnimated />
        </Box>

        <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="3xl" boxShadow="sm" overflow="hidden">
          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <Box p={6}>
                <VStack spacing={5} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={!!stepError('firstName')} isRequired>
                      <FormLabel fontWeight="semibold">First Name</FormLabel>
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} borderRadius="xl" />
                      <FormErrorMessage>{stepError('firstName')}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!stepError('lastName')} isRequired>
                      <FormLabel fontWeight="semibold">Last Name</FormLabel>
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} borderRadius="xl" />
                      <FormErrorMessage>{stepError('lastName')}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Maiden Name</FormLabel>
                      <Input name="maidenName" value={formData.maidenName} onChange={handleChange} borderRadius="xl" />
                    </FormControl>
                    <FormControl isInvalid={!!stepError('age')} isRequired>
                      <FormLabel fontWeight="semibold">Age</FormLabel>
                      <NumberInput min={0} value={formData.age} onChange={(val) => handleNumberChange('age', val)}>
                        <NumberInputField name="age" borderRadius="xl" />
                      </NumberInput>
                      <FormErrorMessage>{stepError('age')}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Gender</FormLabel>
                      <Select name="gender" value={formData.gender} onChange={handleChange} borderRadius="xl">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>
                    <FormControl isInvalid={!!stepError('birthDate')} isRequired>
                      <FormLabel fontWeight="semibold">Birth Date</FormLabel>
                      <Input
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                      <FormErrorMessage>{stepError('birthDate')}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Blood Group</FormLabel>
                      <Input
                        name="bloodGroup"
                        placeholder="e.g. O-, A+"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Avatar Image URL</FormLabel>
                      <Input
                        name="image"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Height (cm)</FormLabel>
                      <NumberInput
                        precision={2}
                        value={formData.height}
                        onChange={(val) => handleNumberChange('height', val)}
                      >
                        <NumberInputField name="height" borderRadius="xl" />
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Weight (kg)</FormLabel>
                      <NumberInput
                        precision={2}
                        value={formData.weight}
                        onChange={(val) => handleNumberChange('weight', val)}
                      >
                        <NumberInputField name="weight" borderRadius="xl" />
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Eye Color</FormLabel>
                      <Input name="eyeColor" value={formData.eyeColor} onChange={handleChange} borderRadius="xl" />
                    </FormControl>
                    <SimpleGrid columns={2} spacing={2}>
                      <FormControl>
                        <FormLabel fontWeight="semibold">Hair Color</FormLabel>
                        <Input
                          name="hair.color"
                          value={formData.hair?.color}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontWeight="semibold">Hair Type</FormLabel>
                        <Input name="hair.type" value={formData.hair?.type} onChange={handleChange} borderRadius="xl" />
                      </FormControl>
                    </SimpleGrid>
                  </SimpleGrid>
                  <Divider />
                  <Text fontWeight="bold" fontSize="md">
                    📍 Personal Address
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Street Address</FormLabel>
                      <Input
                        name="address.address"
                        value={formData.address?.address}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">City</FormLabel>
                      <Input
                        name="address.city"
                        value={formData.address?.city}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">State / State Code</FormLabel>
                      <HStack spacing={2}>
                        <Input
                          name="address.state"
                          placeholder="State"
                          value={formData.address?.state}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                        <Input
                          name="address.stateCode"
                          placeholder="Code"
                          w="100px"
                          value={formData.address?.stateCode}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">ZIP / Country</FormLabel>
                      <HStack spacing={2}>
                        <Input
                          name="address.postalCode"
                          placeholder="ZIP"
                          value={formData.address?.postalCode}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                        <Input
                          name="address.country"
                          placeholder="Country"
                          value={formData.address?.country}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </HStack>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>
            )}

            {currentStep === 1 && (
              <Box p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                  <FormControl isInvalid={!!stepError('email')} isRequired>
                    <FormLabel fontWeight="semibold">Email Address</FormLabel>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} borderRadius="xl" />
                    <FormErrorMessage>{stepError('email')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!stepError('phone')} isRequired>
                    <FormLabel fontWeight="semibold">Phone Number</FormLabel>
                    <Input name="phone" value={formData.phone} onChange={handleChange} borderRadius="xl" />
                    <FormErrorMessage>{stepError('phone')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!stepError('username')} isRequired>
                    <FormLabel fontWeight="semibold">Username</FormLabel>
                    <Input name="username" value={formData.username} onChange={handleChange} borderRadius="xl" />
                    <FormErrorMessage>{stepError('username')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!stepError('password')} isRequired={!id}>
                    <FormLabel fontWeight="semibold">Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      placeholder={id ? 'Leave blank to keep same' : 'At least 4 chars'}
                      value={formData.password}
                      onChange={handleChange}
                      borderRadius="xl"
                    />
                    <FormErrorMessage>{stepError('password')}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold">System Role</FormLabel>
                    <Select name="role" value={formData.role} onChange={handleChange} borderRadius="xl">
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="semibold">University</FormLabel>
                    <Input name="university" value={formData.university} onChange={handleChange} borderRadius="xl" />
                  </FormControl>
                </SimpleGrid>
              </Box>
            )}

            {currentStep === 2 && (
              <Box p={6}>
                <VStack spacing={5} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isInvalid={!!stepError('company.name')} isRequired>
                      <FormLabel fontWeight="semibold">Company Name</FormLabel>
                      <Input
                        name="company.name"
                        value={formData.company?.name}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                      <FormErrorMessage>{stepError('company.name')}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!stepError('company.title')} isRequired>
                      <FormLabel fontWeight="semibold">Corporate Title</FormLabel>
                      <Input
                        name="company.title"
                        value={formData.company?.title}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                      <FormErrorMessage>{stepError('company.title')}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Department</FormLabel>
                      <Input
                        name="company.department"
                        value={formData.company?.department}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                  </SimpleGrid>
                  <Divider />
                  <Text fontWeight="bold" fontSize="md">
                    🏢 Company Address
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Street Address</FormLabel>
                      <Input
                        name="company.address.address"
                        value={formData.company?.address?.address}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">City</FormLabel>
                      <Input
                        name="company.address.city"
                        value={formData.company?.address?.city}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">State / Code</FormLabel>
                      <HStack spacing={2}>
                        <Input
                          name="company.address.state"
                          placeholder="State"
                          value={formData.company?.address?.state}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                        <Input
                          name="company.address.stateCode"
                          placeholder="Code"
                          w="100px"
                          value={formData.company?.address?.stateCode}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">ZIP / Country</FormLabel>
                      <HStack spacing={2}>
                        <Input
                          name="company.address.postalCode"
                          placeholder="ZIP"
                          value={formData.company?.address?.postalCode}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                        <Input
                          name="company.address.country"
                          placeholder="Country"
                          value={formData.company?.address?.country}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </HStack>
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>
            )}

            {currentStep === 3 && (
              <Box p={6}>
                <VStack spacing={5} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl isInvalid={!!stepError('salary')} isRequired>
                      <FormLabel fontWeight="semibold">Salary (USD/year)</FormLabel>
                      <NumberInput
                        min={0}
                        value={formData.salary}
                        onChange={(val) => handleNumberChange('salary', val)}
                      >
                        <NumberInputField name="salary" borderRadius="xl" />
                      </NumberInput>
                      <FormErrorMessage>{stepError('salary')}</FormErrorMessage>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">EIN</FormLabel>
                      <Input
                        name="ein"
                        placeholder="000-000"
                        value={formData.ein}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">SSN</FormLabel>
                      <Input
                        name="ssn"
                        placeholder="000-000-000"
                        value={formData.ssn}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                  </SimpleGrid>
                  <Divider />
                  <Text fontWeight="bold" fontSize="md">
                    🏦 Bank Account
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Card Number</FormLabel>
                      <Input
                        name="bank.cardNumber"
                        value={formData.bank?.cardNumber}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Card Type</FormLabel>
                      <Input
                        name="bank.cardType"
                        value={formData.bank?.cardType}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Expire / Currency</FormLabel>
                      <HStack spacing={2}>
                        <Input
                          name="bank.cardExpire"
                          placeholder="MM/YY"
                          value={formData.bank?.cardExpire}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                        <Input
                          name="bank.currency"
                          placeholder="USD"
                          value={formData.bank?.currency}
                          onChange={handleChange}
                          borderRadius="xl"
                        />
                      </HStack>
                    </FormControl>
                    <FormControl gridColumn={{ md: 'span 3' }}>
                      <FormLabel fontWeight="semibold">IBAN</FormLabel>
                      <Input name="bank.iban" value={formData.bank?.iban} onChange={handleChange} borderRadius="xl" />
                    </FormControl>
                  </SimpleGrid>
                  <Divider />
                  <Text fontWeight="bold" fontSize="md">
                    ₿ Crypto Wallet
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Coin</FormLabel>
                      <Input
                        name="crypto.coin"
                        value={formData.crypto?.coin}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Network</FormLabel>
                      <Input
                        name="crypto.network"
                        value={formData.crypto?.network}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">Wallet Address</FormLabel>
                      <Input
                        name="crypto.wallet"
                        value={formData.crypto?.wallet}
                        onChange={handleChange}
                        borderRadius="xl"
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>
            )}

            {currentStep === 4 && (
              <Box p={6}>
                <VStack spacing={5} align="stretch">
                  <Badge colorScheme="blue" alignSelf="flex-start" p={2} borderRadius="md">
                    IP and MAC addresses are automatically assigned on creation.
                  </Badge>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel fontWeight="semibold">IP Address (Auto-assigned)</FormLabel>
                      <Input name="ip" value={formData.ip || 'Auto-generated'} isDisabled borderRadius="xl" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="semibold">MAC Address (Auto-generated)</FormLabel>
                      <Input
                        name="macAddress"
                        value={formData.macAddress || 'Auto-generated'}
                        isDisabled
                        borderRadius="xl"
                      />
                    </FormControl>
                    <FormControl gridColumn={{ md: 'span 2' }}>
                      <FormLabel fontWeight="semibold">User Agent String</FormLabel>
                      <Input name="userAgent" value={formData.userAgent} onChange={handleChange} borderRadius="xl" />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </Box>
            )}

            <Flex
              justify="space-between"
              align="center"
              px={6}
              py={4}
              borderTop="1px"
              borderColor={borderColor}
              bg={footerBg}
            >
              <Button
                leftIcon={<FiArrowLeft />}
                variant="outline"
                onClick={handleBack}
                isDisabled={isFirst}
                borderRadius="xl"
              >
                Back
              </Button>

              <Text fontSize="sm" color={textMuted} fontWeight="medium">
                {currentStep + 1} / {totalSteps}
              </Text>

              {!isLast ? (
                <Button
                  rightIcon={<FiArrowRight />}
                  colorScheme="blue"
                  onClick={handleNext}
                  isDisabled={nextDisabled}
                  borderRadius="xl"
                  boxShadow={nextDisabled ? 'none' : 'md'}
                  _hover={nextDisabled ? {} : { transform: 'translateY(-1px)', boxShadow: 'lg' }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  leftIcon={<FiSave />}
                  colorScheme="green"
                  isLoading={isSubmitting}
                  borderRadius="xl"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
                >
                  {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                </Button>
              )}
            </Flex>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default EmployeeFormPage;
