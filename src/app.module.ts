import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/infra/database/prisma.module';
import { JwtAuthModule } from './shared/infra/auth/jwt-auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      },
    }),
    PrismaModule,
    JwtAuthModule,
    UsersModule,
  ],
})
export class AppModule {}