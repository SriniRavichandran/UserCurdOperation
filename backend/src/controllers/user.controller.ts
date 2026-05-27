import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { sendSuccess } from '../utils/responseHelper';
import { BadRequestError } from '../utils/customErrors';

function generateRandomMac(): string {
  const hexDigits = '0123456789abcdef';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    mac += hexDigits.charAt(Math.floor(Math.random() * 16));
    if (i < 5) mac += ':';
  }
  return mac;
}

export class UserController {
  /**
   * Get all users with pagination and multi-select filters.
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, companies, roles, page, limit } = req.query;

      // Support comma-separated or array values for companies and roles
      const companiesArr = companies
        ? Array.isArray(companies)
          ? (companies as string[])
          : String(companies).split(',').filter(Boolean)
        : undefined;

      const rolesArr = roles
        ? Array.isArray(roles)
          ? (roles as string[])
          : String(roles).split(',').filter(Boolean)
        : undefined;

      const result = await UserService.getAllUsersPaginated({
        search: search ? String(search) : undefined,
        companies: companiesArr && companiesArr.length > 0 ? companiesArr : undefined,
        roles: rolesArr && rolesArr.length > 0 ? rolesArr : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 10
      });

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a user by ID.
   */
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError('Invalid user ID format');
      }

      const user = await UserService.getUserById(id);
      sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new user.
   */
  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Automatic IP retrieval
      let clientIp = req.ip || req.headers['x-forwarded-for'] || '12.13.116.142';
      if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1' || clientIp === '127.0.0.1') {
        clientIp = '12.13.116.142'; // realistic mock IP for local testing
      }
      if (Array.isArray(clientIp)) {
        clientIp = clientIp[0];
      }

      // Automatic MAC generation
      const macAddress = generateRandomMac();

      const userData = {
        ...req.body,
        ip: clientIp,
        macAddress: macAddress
      };

      const user = await UserService.createUser(userData);
      sendSuccess(res, 'User created successfully', user, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a user.
   */
  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError('Invalid user ID format');
      }

      const user = await UserService.updateUser(id, req.body);
      sendSuccess(res, 'User updated successfully', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a user.
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new BadRequestError('Invalid user ID format');
      }

      await UserService.deleteUser(id);
      sendSuccess(res, 'User deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user metrics / statistics.
   */
  public async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await UserService.getUserStats();
      sendSuccess(res, 'User statistics retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
