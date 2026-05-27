import { connectDB } from './database/connection';
import UserRepository from './repositories/user.repository';

const test = async () => {
  await connectDB();
  const users = await UserRepository.findAll();
  console.log('Total users:', users.length);
  if (users.length > 0) {
    const user = users[0];
    console.log('User model:', user);
    console.log('User json:', user.toJSON());
    console.log('Username:', user.username);
    console.log('Company:', user.company);
    console.log('Salary:', user.salary);
    console.log('Salary type:', typeof user.salary);
  }
};

test().catch(console.error);
