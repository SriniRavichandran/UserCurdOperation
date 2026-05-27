import request from 'supertest';
import app from '../app';
import userRepository from '../repositories/user.repository';

// Mock the UserRepository
jest.mock('../repositories/user.repository');

describe('User Routes', () => {
  describe('GET /', () => {
    it('should return 200 and a sanity check message', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: 'CRUD Application User Service API'
      });
    });
  });

  describe('GET /api/users', () => {
    it('should return 200 and a list of paginated users', async () => {
      const mockUsers = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }];
      const mockResponse = {
        users: mockUsers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      };

      // Mock the findAllPaginated method
      (userRepository.findAllPaginated as jest.Mock).mockResolvedValue(mockResponse);

      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].firstName).toBe('John');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 200 and the user if found', async () => {
      const mockUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      (userRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get('/api/users/1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.firstName).toBe('John');
    });

    it('should return 404 if user not found', async () => {
      (userRepository.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/users/999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
