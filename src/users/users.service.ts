import { UserEntity } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async create(email: string, password: string, admin = false) {
    const user = this.userRepo.create({ email, password, admin });

    return await this.userRepo.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;

    const user = await this.userRepo.findOne({ where: { id } });

    return user;
  }

  async findEmail(email: string) {
    const user = await this.userRepo.find({ where: { email } });

    return user;
  }

  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attrs);

    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.userRepo.remove(user);
  }
}
