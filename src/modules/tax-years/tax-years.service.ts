import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaxYearResponse } from '../../types/tax-year.type';

@Injectable()
export class TaxYearsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TaxYearResponse[]> {
    return this.prisma.taxYear.findMany({
      orderBy: { startDate: 'desc' },
    });
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
