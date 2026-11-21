import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from './supplier.service.js';
import { PaginationDto } from '../common/dto/pagination-query.dto.js';
import { Roles } from '../auth/decorators/role.decorator.js';
import { Role } from '@prisma/client';
import { CreateSupplierDto } from './dto/supplier.dto.js';

@Controller('suppliers')
@ApiBearerAuth('access-token')
export class SupplierController {
  constructor(private readonly service: SupplierService) {}

  @Get()
  findAll(@Query() q: PaginationDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSupplierDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, dto: CreateSupplierDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
