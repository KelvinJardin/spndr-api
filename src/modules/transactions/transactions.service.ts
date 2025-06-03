import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../../dtos/pagination.dto';
import { TransactionResponse } from '../../types/transaction.type';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    query: PaginationQueryDto,
    hobbyId?: string,
  ) {
    const where = {
      userId,
      ...(hobbyId && { hobbyId }),
    };

    const [total, transactions] = await Promise.all([
      this.prisma.transaction.count({ where }),
      this.prisma.transaction.findMany({
        where,
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        orderBy: { date: 'desc' },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page: query.page,
        lastPage: Math.ceil(total / query.limit),
      },
    };
  }
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
