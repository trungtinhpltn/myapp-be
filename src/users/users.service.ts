import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.serive.js';
import { CreateUserDto } from './dto/create-user.dto.js';

const publicSelect = {
  id: true,
  username: true,
  fullName: true,
  phoneNumber: true,
  role: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    if (exists) throw new ConflictException('Username already existed!');
    return this.prisma.user.create({
      data: {
        ...dto,
        password: await bcrypt.hash(dto.password, 10),
      },
      select: publicSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: publicSelect,
      orderBy: {
        id: 'asc',
      },
    });
  }
}
