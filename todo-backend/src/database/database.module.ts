import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from '../user/app-user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: parseInt(configService.getOrThrow('DATABASE_PORT'), 10),
        username: configService.getOrThrow('DATABASE_USER'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        database: configService.getOrThrow('DATABASE_NAME'),
        entities: [AppUser],
        synchronize: configService.getOrThrow('DATABASE_SYNC'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
