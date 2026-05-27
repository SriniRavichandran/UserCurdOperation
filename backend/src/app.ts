import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/sanitizeHandler';
import { NotFoundError } from './utils/customErrors';

const app: Application = express();

// CORS must come before Helmet to ensure preflight OPTIONS requests are handled
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Helmet security headers (crossOriginResourcePolicy set to cross-origin to allow browser fetches)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput);

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
