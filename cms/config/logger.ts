import type { Logger } from '@strapi/logger';


const environment = process.env.NODE_ENV || 'development';

export default ({ env }) => {
  const config: any = {
    level: env('LOG_LEVEL', 'info'),
    exposeInContext: true,
    requests: true,
  };

  // In production, add Logstash transport for centralized logging
  if (environment === 'production' || env.bool('ENABLE_LOGSTASH', false)) {
    try {
      // Dynamic import to avoid issues if winston-logstash-transport is not installed
      const winston = require('winston');

      config.transports = [
        // Console transport with JSON format
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
      ];

      config.format = winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      );
    } catch (error) {
      console.warn('Winston Logstash transport not available, using default logging:', error.message);
    }
  }

  return config;
};
