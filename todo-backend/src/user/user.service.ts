import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppUser } from './app-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AppUser)
    private readonly userRepository: Repository<AppUser>,
  ) {}

  async findOneById(id: number): Promise<AppUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<AppUser | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async create(email: string, password: string): Promise<AppUser> {
    const newUser = this.userRepository.create({
      email,
      password,
    });
    return this.userRepository.save(newUser);
  }
}
