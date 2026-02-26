/**
 * Server Entry Point
 * Initializes database connection and starts the Express server
 */

const app = require('./app');
const { connectDB } = require('./config/database');
const { initRedis } = require('./services/redis');
const { initializeEmailTransport } = require('./utils/email');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ Database connected');

    // Initialize Redis
    try {
      await initRedis();
      console.log('✓ Redis initialized');
    } catch (error) {
      console.warn('⚠ Redis unavailable - continuing without caching/locking');
    }

    // Initialize Email Transport
    try {
      initializeEmailTransport();
      console.log('✓ Email transport initialized');
    } catch (error) {
      console.warn('⚠ Email service unavailable - continuing');
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} (${NODE_ENV})`);
      console.log(`✓ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
