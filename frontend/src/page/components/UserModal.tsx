import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  NumberInput,
  NumberInputField,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { User, UserInput } from '../types/user.types';
import { FormErrors, validateUserForm } from '../../shared/lib/validation/user.schema';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserInput) => Promise<void>;
  user: User | null; // Null means Add mode, otherwise Edit mode
}

const initialFormState: UserInput = {
  username: '',
  company: '',
  role: '',
  email: '',
  salary: 50000
};

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<UserInput>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Populate form if we are editing an existing user
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        company: user.company,
        role: user.role,
        email: user.email,
        salary: Number(user.salary)
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [user, isOpen]);

  // Handle textual input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UserInput) => ({ ...prev, [name]: value }));
    // Clear validation error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle number input changes for Salary
  const handleSalaryChange = (valueString: string) => {
    setFormData((prev: UserInput) => ({ ...prev, salary: Number(valueString) }));
    if (errors.salary) {
      setErrors((prev: FormErrors) => ({ ...prev, salary: undefined }));
    }
  };

  // Run frontend validation
  const validateForm = (): boolean => {
    const { isValid, errors: validationErrors } = validateUserForm(formData);
    setErrors(validationErrors);
    return isValid;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      // Capture Joi errors or express duplicate errors
      const apiMessage = error.response?.data?.message || 'Failed to save employee';
      const apiErrors = error.response?.data?.errors;

      if (Array.isArray(apiErrors)) {
        // Map Joi validation error details to UI form fields
        const mappedErrors: FormErrors = {};
        apiErrors.forEach((err: any) => {
          if (err.field) {
            mappedErrors[err.field as keyof FormErrors] = err.message;
          }
        });
        setErrors(mappedErrors);
      } else {
        toast({
          title: 'Error Saving Employee',
          description: apiMessage,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <form onSubmit={handleSubmit}>
          <ModalHeader fontSize="xl" fontWeight="bold">
            {user ? 'Edit Employee Details' : 'Add New Employee'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <VStack spacing={4}>
              {/* Username Field */}
              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel fontWeight="semibold">Username</FormLabel>
                <Input
                  name="username"
                  placeholder="e.g. johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  borderRadius="xl"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              {/* Company Field */}
              <FormControl isInvalid={!!errors.company} isRequired>
                <FormLabel fontWeight="semibold">Company</FormLabel>
                <Input
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  borderRadius="xl"
                />
                <FormErrorMessage>{errors.company}</FormErrorMessage>
              </FormControl>

              {/* Role Field */}
              <FormControl isInvalid={!!errors.role} isRequired>
                <FormLabel fontWeight="semibold">Role</FormLabel>
                <Input
                  name="role"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.role}
                  onChange={handleChange}
                  borderRadius="xl"
                />
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>

              {/* Email Field */}
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel fontWeight="semibold">Email Address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  placeholder="e.g. john.doe@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  borderRadius="xl"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              {/* Salary Field */}
              <FormControl isInvalid={!!errors.salary} isRequired>
                <FormLabel fontWeight="semibold">Salary (USD/year)</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  value={formData.salary}
                  onChange={handleSalaryChange}
                  borderRadius="xl"
                >
                  <NumberInputField name="salary" placeholder="e.g. 85000" borderRadius="xl" />
                </NumberInput>
                <FormErrorMessage>{errors.salary}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} gap={2}>
            <Button onClick={onClose} variant="ghost" borderRadius="xl">
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue" isLoading={isSubmitting} borderRadius="xl" boxShadow="sm">
              {user ? 'Save Changes' : 'Add Employee'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
