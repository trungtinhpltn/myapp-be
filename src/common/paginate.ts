import { PaginationDto } from './dto/pagination-query.dto.js';

export function paginate<T>(data: T[], total: number, q: PaginationDto) {
  return {
    data,
    meta: {
      total,
      page: q.page,
      limit: q.limit,
      totalPage: Math.ceil(total / q.limit),
    },
  };
}

export const skipOf = (q: PaginationDto) => (q.page - 1) * q.limit;
