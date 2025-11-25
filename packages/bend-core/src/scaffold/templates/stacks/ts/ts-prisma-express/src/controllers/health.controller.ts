import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getHealthStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true,
        status: 'healthy',
      },
      memory: {
        usage: process.memoryUsage(),
        free: require('os').freemem(),
        total: require('os').totalmem(),
      },
    };

    res.status(200).json({
      success: true,
      data: healthCheck,
    });
  } catch (error) {
    const healthCheck = {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: false,
        status: 'unhealthy',
      },
    };

    res.status(503).json({
      success: false,
      data: healthCheck,
    });
  }
};
