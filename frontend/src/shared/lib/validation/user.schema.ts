import { UserInput } from '../../../page/types/user.types';

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  role?: string;
  salary?: string;
  'company.name'?: string;
  'company.title'?: string;
}

export const validateUserForm = (
  formData: UserInput,
  isEditMode: boolean = false
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!formData.firstName || !formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName || !formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (formData.age === undefined || formData.age === null || isNaN(formData.age)) {
    errors.age = 'Age is required';
  } else if (formData.age < 0) {
    errors.age = 'Age cannot be negative';
  }

  if (!formData.gender) {
    errors.gender = 'Gender is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  }

  if (!formData.username || !formData.username.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  if (!isEditMode) {
    if (!formData.password || !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.trim().length < 4) {
      errors.password = 'Password must be at least 4 characters long';
    }
  } else {
    if (formData.password && formData.password.trim() && formData.password.trim().length < 4) {
      errors.password = 'Password must be at least 4 characters long';
    }
  }

  if (!formData.birthDate || !formData.birthDate.trim()) {
    errors.birthDate = 'Birth date is required';
  }

  if (!formData.role) {
    errors.role = 'System role is required';
  }

  if (formData.salary === undefined || formData.salary === null || isNaN(formData.salary)) {
    errors.salary = 'Salary is required';
  } else if (formData.salary <= 0) {
    errors.salary = 'Salary must be a positive number';
  }

  if (!formData.company?.name || !formData.company.name.trim()) {
    errors['company.name'] = 'Company name is required';
  }

  if (!formData.company?.title || !formData.company.title.trim()) {
    errors['company.title'] = 'Corporate title is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
