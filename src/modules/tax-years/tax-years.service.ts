import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../../dtos/pagination.dto';
import { TaxYearResponse } from '../../types/tax-year.type';

@Injectable()
export class TaxYearsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const [total, taxYears] = await Promise.all([
      this.prisma.taxYear.count(),
      this.prisma.taxYear.findMany({
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: taxYears,
      meta: {
        total,
        page: query.page,
        lastPage: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: string): Promise<TaxYearResponse | null> {
    return this.prisma.taxYear.findUnique({
      where: { id },
    });
  }

  async findCurrent(): Promise<TaxYearResponse | null> {
    return this.prisma.taxYear.findFirst({
      where: { isCurrent: true },
    });
  }
}