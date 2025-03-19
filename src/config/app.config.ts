export const appConfig = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
    origin: process.env.CORS_ORIGIN || '*',
  },
}; 