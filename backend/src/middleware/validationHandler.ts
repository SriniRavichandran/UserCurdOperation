import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { sendError } from '../utils/responseHelper';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: ''
        }
      }
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      sendError(res, 'Validation Error', details, 400);
      return;
    }

    req.body = value;
    next();
  };
};
