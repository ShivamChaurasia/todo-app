import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './app-user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AppUser)
    private readonly userRepository: Repository<AppUser>,
  ) {}

  async findOne(email: string): Promise<AppUser | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, password: string): Promise<AppUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
