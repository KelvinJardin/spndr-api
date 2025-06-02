import { PrismaClient } from '@prisma/client';

export async function seedTaxYears(prisma: PrismaClient, userId: string) {
  const taxYears = [
    {
      startDate: new Date('2023-04-06'),
      endDate: new Date('2024-04-05'),
      isCurrent: true,
      userId,
    },
    {
      startDate: new Date('2022-04-06'),
      endDate: new Date('2023-04-05'),
      isCurrent: false,
      userId,
    },
  ];

  console.log('🌱 Seeding tax years...');

  for (const taxYear of taxYears) {
    await prisma.taxYear.upsert({
      where: {
        userId_startDate_endDate: {
          userId: taxYear.userId,
          startDate: taxYear.startDate,
          endDate: taxYear.endDate,
        },
      },
      update: taxYear,
      create: taxYear,
    });
  }
}