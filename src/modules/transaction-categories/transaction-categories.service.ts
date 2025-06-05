import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../dto';
import { CreateCategoryDto, UpdateCategoryDto, CreateCategoryMappingDto, UpdateCategoryMappingDto } from './dto';

@Injectable()
export class TransactionCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { limit, offset } = query;

    const [total, categories] = await Promise.all([
      this.prisma.transactionCategory.count(),
      this.prisma.transactionCategory.findMany({
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        offset,
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.transactionCategory.findUnique({
      where: { id },
    });
  }

  async create(createDto: CreateCategoryDto) {
    return this.prisma.transactionCategory.create({
      data: createDto,
    });
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    return this.prisma.transactionCategory.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.transactionCategory.delete({
      where: { id },
    });
  }

  async findMapping(categoryId: string, taxYearId: string) {
    return this.prisma.taxCategoryMapping.findUnique({
      where: {
        categoryId_taxYearId: {
          categoryId,
          taxYearId,
        },
      },
    });
  }

  async createMapping(categoryId: string, taxYearId: string, createDto: CreateCategoryMappingDto) {
    return this.prisma.taxCategoryMapping.create({
      data: {
        ...createDto,
        categoryId,
        taxYearId,
      },
    });
  }

  async updateMapping(categoryId: string, taxYearId: string, updateDto: UpdateCategoryMappingDto) {
    return this.prisma.taxCategoryMapping.update({
      where: {
        categoryId_taxYearId: {
          categoryId,
          taxYearId,
        },
      },
      data: updateDto,
    });
  }

  async removeMapping(categoryId: string, taxYearId: string) {
    return this.prisma.taxCategoryMapping.delete({
      where: {
        categoryId_taxYearId: {
          categoryId,
          taxYearId,
        },
      },
    });
  }
}