import dotenv from 'dotenv';
import { createApp } from './config/app';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = createApp();

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📌 Environment: ${NODE_ENV}`);
  logger.info(`🔗 API available at: http://localhost:${PORT}/api`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});