import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/customErrors';
import { sendError } from '../utils/responseHelper';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  console.error('--- ERROR LOG ---');
  console.error(err);

  // Handle custom AppErrors (Operational errors)
  if (err instanceof AppError) {
    sendError(res, err.message, null, err.statusCode);
    return;
  }

  // Handle Sequelize Unique Constraint Errors
  if (err instanceof UniqueConstraintError) {
    const details = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} must be unique. value '${e.value}' already exists.`
    }));
    sendError(res, 'Unique Constraint Error', details, 409);
    return;
  }

  // Handle general Sequelize Validation Errors
  if (err instanceof SequelizeValidationError) {
    const details = err.errors.map((e) => ({
      field: e.path,
      message: e.message
    }));
    sendError(res, 'Database Validation Error', details, 400);
    return;
  }

  // Handle generic Unknown Server Errors (500)
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred on the server.'
      : err.message || 'Internal Server Error';

  sendError(res, message, null, 500);
};
