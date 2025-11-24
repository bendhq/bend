import { prisma } from '../config/prisma.js';
import os from 'os';

export const getHealthStatus = async (req, res) => {
  let dbStatus = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = true;
  } catch (e) {
    dbStatus = false;
  }

  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbStatus,
    },
    memory: {
      usage: process.memoryUsage(),
      free: os.freemem(),
      total: os.totalmem(),
    },
  };

  const httpCode = healthCheck.database.connected ? 200 : 503;

  res.status(httpCode).json({
    success: healthCheck.database.connected,
    data: healthCheck,
  });
};
