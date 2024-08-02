import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUser } from './app-user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppUser])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
