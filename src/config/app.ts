import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from '../routes';
import { errorHandler } from '../middlewares/errorHandler.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // ✅ UPDATED CORS - allows all Expo web/mobile origins
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:8081',    // Expo web default
        'http://localhost:19006',   // Expo web alt
        'http://localhost:19000',   // Expo Go
        'http://10.15.8.165:8081',  // Your machine IP - Expo web
        'http://10.15.8.165:19006', // Your machine IP - alt
        'http://10.15.8.165:19000', // Your machine IP - Expo Go
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
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