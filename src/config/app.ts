import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../routes';
import { errorHandler } from '../middlewares/errorHandler.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging (simple)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Routes
  app.use('/api', router);

  // Error handling
  app.use(errorHandler);

  return app;
};