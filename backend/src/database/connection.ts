import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD === '' ? undefined : process.env.DB_PASSWORD || undefined;
const dbName = process.env.DB_NAME || 'crud_db';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
  } catch {
    process.exit(1);
  }
};
