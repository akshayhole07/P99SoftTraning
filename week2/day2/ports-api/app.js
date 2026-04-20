import 'dotenv/config';
import express from 'express';
import portsRouter from './routes/ports.routes.js';
import { errorHandler } from './utils/apiError.js';
import prisma from './utils/prisma.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Ports API running' });
});

app.use('/ports', portsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Database connection test and server startup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  console.log('✓ Database disconnected');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
