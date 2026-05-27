import { User, UserAttributes, UserCreationAttributes } from '../models/user.model';
import { Op } from 'sequelize';
import { sequelize } from '../database/connection';

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper: safely escape a string for use in SQL LIKE / IN patterns
function escapeSql(val: string): string {
  return val.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export class UserRepository {
  /**
   * Find all users matching optional search/filter criteria with pagination.
   */
  public async findAllPaginated(filters?: {
    search?: string;
    companies?: string[];
    roles?: string[];
    page?: number;
    limit?: number;
  }): Promise<PaginatedUsers> {
    const whereClause: any = {};
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.min(100, Math.max(1, filters?.limit || 10));
    const offset = (page - 1) * limit;

    const andConditions: any[] = [];

    if (filters) {
      const { search, companies, roles } = filters;

      if (search) {
        const s = escapeSql(search);
        andConditions.push({
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.name')) LIKE '%${s}%'`),
            sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.title')) LIKE '%${s}%'`)
          ]
        });
      }

      if (companies && companies.length > 0) {
        const inList = companies.map((c) => `'${escapeSql(c)}'`).join(', ');
        andConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.name')) IN (${inList})`));
      }

      if (roles && roles.length > 0) {
        const inList = roles.map((r) => `'${escapeSql(r)}'`).join(', ');
        andConditions.push({
          [Op.or]: [
            { role: { [Op.in]: roles } },
            sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.title')) IN (${inList})`)
          ]
        });
      }
    }

    if (andConditions.length > 0) {
      whereClause[Op.and] = andConditions;
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      order: [['id', 'DESC']],
      limit,
      offset
    });

    return {
      users: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  /**
   * Find all users (non-paginated, used for stats).
   */
  public async findAll(filters?: { search?: string; company?: string; role?: string }): Promise<User[]> {
    const whereClause: any = {};

    if (filters) {
      const { search, company, role } = filters;

      if (search) {
        whereClause[Op.or] = [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      if (company) {
        whereClause[Op.and] = [
          sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.name')) = '${escapeSql(company)}'`)
        ];
      }

      if (role) {
        const roleLiteral = sequelize.literal(
          `JSON_UNQUOTE(JSON_EXTRACT(\`company\`, '$.title')) = '${escapeSql(role)}'`
        );
        const roleCond = { [Op.or]: [{ role: role }, roleLiteral] };
        whereClause[Op.and] = whereClause[Op.and] ? [...whereClause[Op.and], roleCond] : [roleCond];
      }
    }

    return await User.findAll({ where: whereClause, order: [['id', 'DESC']] });
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
