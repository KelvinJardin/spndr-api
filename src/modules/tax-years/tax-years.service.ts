import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../../dtos/pagination.dto';
import { TaxYearResponse } from '../../types/tax-year.type';

@Injectable()
export class TaxYearsService {
  constructor(private readonly prisma: PrismaService) {
  }

  async findAll(query: PaginationQueryDto) {
    const { limit, offset } = query;

    const [total, taxYears] = await Promise.all([
      this.prisma.taxYear.count(),
      this.prisma.taxYear.findMany({
        take: limit,
        skip: offset,
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return {
      data: taxYears,
      meta: {
        total,
        offset,
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