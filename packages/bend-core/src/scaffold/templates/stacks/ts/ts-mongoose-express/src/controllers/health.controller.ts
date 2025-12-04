import { Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';

export const getHealthStatus = async (_req: Request, res: Response): Promise<void> => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
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
