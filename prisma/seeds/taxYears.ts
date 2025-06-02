import { PrismaClient } from '@prisma/client';

export async function seedTaxYears(prisma: PrismaClient) {
  const taxYears = [
    {
      startDate: new Date('2024-04-06'),
      endDate: new Date('2025-04-05'),
      isCurrent: true,
    },
    {
      startDate: new Date('2023-04-06'),
      endDate: new Date('2024-04-05'),
    },
    {
      startDate: new Date('2022-04-06'),
      endDate: new Date('2023-04-05'),
      isCurrent: false,
    },
  ];

  console.log('🌱 Seeding tax years...');

  for (const taxYear of taxYears) {
    await prisma.taxYear.upsert({
      where: {
        startDate_endDate: {
          startDate: taxYear.startDate,
          endDate: taxYear.endDate,
        },
      },
      update: taxYear,
      create: taxYear,
    });
  }
}
