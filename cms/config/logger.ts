import type { Logger } from '@strapi/logger';

const logstashHost = process.env.LOGSTASH_HOST || 'logstash';
const logstashPort = parseInt(process.env.LOGSTASH_PORT || '5000');
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
      const { LogstashTransport } = require('winston-logstash-transport');

      config.transports = [
        // Console transport with JSON format
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        }),
        // Logstash transport for ELK
        new LogstashTransport({
          host: logstashHost,
          port: logstashPort,
          reconnect: {
            enabled: true,
            maxRetries: 10,
            delay: 5000,
          },
          meta: {
            service: 'taxibrousse-cms',
            service_type: 'nodejs',
            environment: environment,
          },
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
