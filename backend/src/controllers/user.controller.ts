import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { sendSuccess } from '../utils/responseHelper';
import { BadRequestError } from '../utils/customErrors';

export class UserController {
  /**
   * Get all users, optionally filtered.
   */
  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, company, role } = req.query;

      const users = await UserService.getAllUsers({
        search: search ? String(search) : undefined,
        company: company ? String(company) : undefined,
        role: role ? String(role) : undefined
      });

      sendSuccess(res, 'Users retrieved successfully', users);
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
      const user = await UserService.createUser(req.body);
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
