import app from './app';
import { connectDB } from './database/connection';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (): Promise<void> => {
  // Test connection to the MySQL database
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {});
};

startServer().catch(() => {
  process.exit(1);
});
