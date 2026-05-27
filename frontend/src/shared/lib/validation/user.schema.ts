import { UserInput } from '../../../page/types/user.types';

export interface FormErrors {
  username?: string;
  company?: string;
  role?: string;
  email?: string;
  salary?: string;
}

/**
 * Validates the user form data on the client side.
 * Returns whether the form is valid and an object containing error messages.
 */
export const validateUserForm = (formData: UserInput): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  if (!formData.company.trim()) {
    errors.company = 'Company is required';
  }

  if (!formData.role.trim()) {
    errors.role = 'Role is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (formData.salary === undefined || formData.salary === null || isNaN(formData.salary)) {
    errors.salary = 'Salary is required';
  } else if (formData.salary <= 0) {
    errors.salary = 'Salary must be a positive number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
