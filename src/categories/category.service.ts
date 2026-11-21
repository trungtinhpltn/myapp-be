import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.serive.js';
import { PaginationDto } from '../common/dto/pagination-query.dto.js';
import { Prisma } from '@prisma/client';
import { paginate, skipOf } from '../common/paginate.js';
import { CategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(q: PaginationDto) {
    const where: Prisma.CategoryWhereInput = q.search
      ? { name: { contains: q.search, mode: 'insensitive' } }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip: skipOf(q),
        take: q.limit,
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.category.count({
        where,
      }),
    ]);
    return paginate(data, total, q);
  }

  async findOneById(id: number) {
    const ct = await this.prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    if (!ct) throw new NotFoundException('Category not found!');
    return ct;
  }

  async create(dto: CategoryDto) {
    try {
      return await this.prisma.category.create({
        data: dto,
      });
    } catch (e) {
      this.handleUnique(e);
    }
  }

  async update(id: number, dto: CategoryDto) {
    await this.findOneById(id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handleUnique(error);
    }
  }

  async remove(id: number) {
    await this.findOneById(id);
    const count = await this.prisma.product.count({
      where: {
        categoryId: id,
      },
    });
    if (count > 0) {
      throw new ConflictException(
        `Danh muc co chua ${count} san pham. Khong the xoa!`,
      );
    }
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  private handleUnique(e: unknown): never {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new ConflictException('Name already exist!');
    }
    throw e;
  }
}
