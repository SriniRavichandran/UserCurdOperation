import { connectDB } from './database/connection';
import UserRepository from './repositories/user.repository';

const test = async () => {
  await connectDB();
  await UserRepository.findAll();
};

test().catch(() => {});
