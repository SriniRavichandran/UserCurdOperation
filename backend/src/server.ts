import app from './app';
import { connectDB } from './database/connection';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (): Promise<void> => {
  // Test connection to the MySQL database
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`  Backend is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`  Local URL: http://localhost:${PORT}`);
    console.log(`=========================================`);
  });
};

startServer().catch((error) => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});
