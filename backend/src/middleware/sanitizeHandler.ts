import { Request, Response, NextFunction } from 'express';

/**
 * Strips all HTML/script tags from a string.
 */
export const sanitizeText = (str: string): string => {
  if (!str) return str;
  // Remove script tags and their contents
  let cleaned = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove all other HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  return cleaned.trim();
};

/**
 * Recursively scans and sanitizes string values inside objects and arrays.
 */
const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

/**
 * Express middleware to sanitize body, query, and path params.
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};
