import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.serive.js';
import { PaginationDto } from '../common/dto/pagination-query.dto.js';
import { Prisma } from '@prisma/client';
import { paginate, skikOf } from '../common/paginate.js';

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
        skip: skikOf(q),
        take: q.limit,
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.category.count({
        where,
      }),
    ]);
    return paginate(data, total, q);
  }
}
