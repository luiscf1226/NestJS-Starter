import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: 10,
  retryDelay: 3000, // 3 seconds
  autoLoadEntities: true,
  ssl: false,
  extra: {
    max: 20, // Maximum number of connections in the pool
    connectionTimeoutMillis: 5000, // Connection timeout in milliseconds
  },
}; 