import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).trim().required().messages({
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 50 characters',
    'any.required': 'Username is required'
  }),
  company: Joi.string().min(2).max(100).trim().required().messages({
    'string.empty': 'Company cannot be empty',
    'string.min': 'Company must be at least 2 characters long',
    'any.required': 'Company is required'
  }),
  role: Joi.string().min(2).max(100).trim().required().messages({
    'string.empty': 'Role cannot be empty',
    'string.min': 'Role must be at least 2 characters long',
    'any.required': 'Role is required'
  }),
  email: Joi.string().email().trim().required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  salary: Joi.number().positive().required().messages({
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be a positive number',
    'any.required': 'Salary is required'
  })
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).trim(),
  company: Joi.string().min(2).max(100).trim(),
  role: Joi.string().min(2).max(100).trim(),
  email: Joi.string().email().trim(),
  salary: Joi.number().positive()
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });
