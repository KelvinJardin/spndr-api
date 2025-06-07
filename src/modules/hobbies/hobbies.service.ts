import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsService } from '../../services';
import { PaginationQueryDto, PaginatedResponseDto } from '../dto';
import { CreateHobbyDto, UpdateHobbyDto } from './dto';
import type { HobbyResponse, HobbyStatsOptions, HobbyStatsResponse } from './types';

@Injectable()
export class HobbiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statsService: StatsService,
  ) {
  }

  async findAll(userId: string, query: PaginationQueryDto): Promise<PaginatedResponseDto<HobbyResponse>> {
    const { limit, offset } = query;

    const [total, hobbies] = await Promise.all([
      this.prisma.hobby.count({
        where: { userId },
      }),
      this.prisma.hobby.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { transactions: true },
          },
        },
      }),
    ]);

    return {
      data: hobbies.map(hobby => ({
        ...hobby,
        transactions: {
          count: hobby._count.transactions,
        },
      })),
      meta: {
        total,
        offset,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<HobbyResponse | null> {
    const hobby = await this.prisma.hobby.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    if (!hobby) return null;

    return {
      ...hobby,
      transactions: {
        count: hobby._count.transactions,
      },
    };
  }

  async create(userId: string, createDto: CreateHobbyDto): Promise<HobbyResponse> {
    const hobby = await this.prisma.hobby.create({
      data: {
        ...createDto,
        userId,
      },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return {
      ...hobby,
      transactions: {
        count: hobby._count.transactions,
      },
    };
  }

  async update(
    userId: string,
    id: string,
    updateDto: UpdateHobbyDto,
  ): Promise<HobbyResponse | null> {
    try {
      const hobby = await this.prisma.hobby.update({
        where: {
          id,
          userId,
        },
        data: updateDto,
        include: {
          _count: {
            select: { transactions: true },
          },
        },
      });

      return {
        ...hobby,
        transactions: {
          count: hobby._count.transactions,
        },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<boolean> {
    try {
      await this.prisma.hobby.delete({
        where: {
          id,
          userId,
        },
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async getHobbyStats(
    userId: string,
    hobbyId: string,
    options: HobbyStatsOptions,
  ): Promise<HobbyStatsResponse> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (options.months ?? 12));

    // Base query for transactions within the time period
    const baseWhere = {
      userId,
      hobbyId,
      date: {
        gte: startDate,
      },
    };

    return this.statsService.getStats(baseWhere, options);
  }
}
