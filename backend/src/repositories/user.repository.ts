import { User, UserAttributes, UserCreationAttributes } from '../models/user.model';
import { Op } from 'sequelize';

export class UserRepository {
  /**
   * Find all users matching optional search/filter criteria.
   */
  public async findAll(filters?: { search?: string; company?: string; role?: string }): Promise<User[]> {
    const whereClause: any = {};

    if (filters) {
      const { search, company, role } = filters;

      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { company: { [Op.like]: `%${search}%` } }
        ];
      }

      if (company) {
        whereClause.company = company;
      }

      if (role) {
        whereClause.role = role;
      }
    }

    return await User.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });
  }

  /**
   * Find a single user by ID.
   */
  public async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  /**
   * Find a user by Email (used for unique email checks).
   */
  public async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  /**
   * Create a new user.
   */
  public async create(userData: UserCreationAttributes): Promise<User> {
    return await User.create(userData);
  }

  /**
   * Update an existing user.
   */
  public async update(id: number, userData: Partial<UserAttributes>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) {
      return null;
    }
    return await user.update(userData);
  }

  /**
   * Delete a user.
   */
  public async delete(id: number): Promise<boolean> {
    const user = await User.findByPk(id);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  }
}

export default new UserRepository();
