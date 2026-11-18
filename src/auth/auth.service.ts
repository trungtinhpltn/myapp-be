import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.serive.js';
import { LoginDto } from './dto/login.dto.js';

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

@Injectable()
export class AuthService {
  private readonly refreshTtlMs: number;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    config: ConfigService,
  ) {
    this.refreshTtlMs =
      Number(config.get('REFRESH_TOKEN_DAYS') ?? 7) * 24 * 60 * 60 * 1000;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });
    const valid =
      !!user &&
      user.isActive &&
      (await bcrypt.compare(dto.password, user.password));
    if (!valid)
      throw new UnauthorizedException('username or password invalid!');
    return this.createToken(user);
  }

  async createToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtlMs),
      },
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async handleRefreshToken(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: {
        tokenHash: sha256(refreshToken),
      },
      include: {
        user: true,
      },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid!');
    }
    const { count } = await this.prisma.refreshToken.deleteMany({
      where: {
        id: stored.id,
      },
    });
    if (count === 0)
      throw new UnauthorizedException('Refresh token is invalid!');
    return this.createToken(stored.user);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        tokenHash: sha256(refreshToken),
      },
    });
  }

  async logoutAll(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
