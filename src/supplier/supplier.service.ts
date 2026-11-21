import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination-query.dto.js';
import { paginate, skipOf } from '../common/paginate.js';
import { PrismaService } from '../prisma/prisma.serive.js';
import { CreateSupplierDto } from './dto/supplier.dto.js';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(q: PaginationDto) {
    const where: Prisma.SupplierWhereInput = q.search
      ? {
          OR: [
            { name: { contains: q.search, mode: 'insensitive' } },
            {
              phoneNumber: {
                contains: q.search,
              },
            },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.supplier.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip: skipOf(q),
        take: q.limit,
      }),
      this.prisma.supplier.count({
        where,
      }),
    ]);
    return paginate(data, total, q);
  }

  async findOne(id: number) {
    const sp = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!sp) throw new NotFoundException('Supplier not found!');
    return sp;
  }

  create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: dto,
    });
  }

  async update(id: number, dto: CreateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const count = await this.prisma.purchaseOrder.count({
      where: {
        supplierId: id,
      },
    });
    if (count > 0)
      throw new ConflictException(
        'Nha cung cap da co phieu nhap hang khong the xoa!',
      );
    await this.prisma.supplier.delete({
      where: { id },
    });
  }
}
