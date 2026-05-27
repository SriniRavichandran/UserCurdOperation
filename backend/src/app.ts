import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/customErrors';

const app: Application = express();

// Basic middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core API routes
app.use('/api/users', userRoutes);

// Root route for sanity check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'CRUD Application User Service API'
  });
});

// Fallback for undefined routes (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
