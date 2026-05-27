import UserRepository from '../repositories/user.repository';
import { UserAttributes, UserCreationAttributes } from '../models/user.model';
import { NotFoundError, ConflictError } from '../utils/customErrors';

export class UserService {
  /**
   * Get all users, filtered by search query, company or role.
   */
  public async getAllUsers(filters?: { search?: string; company?: string; role?: string }) {
    return await UserRepository.findAll(filters);
  }

  /**
   * Get a user by ID. Throws NotFoundError if not found.
   */
  public async getUserById(id: number) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Create a new user. Throws ConflictError if email exists.
   */
  public async createUser(userData: UserCreationAttributes) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError(`Email '${userData.email}' is already in use`);
    }
    return await UserRepository.create(userData);
  }

  /**
   * Update an existing user. Throws ConflictError if updating to an existing email.
   */
  public async updateUser(id: number, userData: Partial<UserAttributes>) {
    await this.getUserById(id); // Ensure user exists

    if (userData.email) {
      const existingUser = await UserRepository.findByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(`Email '${userData.email}' is already in use by another user`);
      }
    }

    return await UserRepository.update(id, userData);
  }

  /**
   * Delete user by ID.
   */
  public async deleteUser(id: number) {
    await this.getUserById(id); // Ensure user exists
    return await UserRepository.delete(id);
  }

  /**
   * Get user database metrics/statistics for frontend cards.
   */
  public async getUserStats() {
    const users = await UserRepository.findAll();
    const totalUsers = users.length;
    if (totalUsers === 0) {
      return {
        totalUsers: 0,
        averageSalary: 0,
        topCompany: 'N/A'
      };
    }

    const totalSalary = users.reduce((sum, user) => sum + Number(user.salary), 0);
    const averageSalary = Math.round((totalSalary / totalUsers) * 100) / 100;

    const companyCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      companyCounts[user.company] = (companyCounts[user.company] || 0) + 1;
    });

    let topCompany = 'N/A';
    let maxCount = 0;
    Object.entries(companyCounts).forEach(([company, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCompany = company;
      }
    });

    return {
      totalUsers,
      averageSalary,
      topCompany
    };
  }
}

export default new UserService();
