import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionResponse } from '../../types/transaction.type';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    hobbyId?: string,
  ): Promise<TransactionResponse[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        ...(hobbyId && { hobbyId }),
      },
    });
  }

  async findOne(
    userId: string,
    id: string,
  ): Promise<TransactionResponse | null> {
    return this.prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
}
