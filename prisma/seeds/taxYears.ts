import { PrismaClient } from '@prisma/client';

export async function seedTaxYears(prisma: PrismaClient) {
  const taxYears = [
    {
      startYear: 2025,
      startDate: new Date('2025-04-06'),
      endDate: new Date('2026-04-05'),
      isCurrent: true,
    },
    {
      startYear: 2024,
      startDate: new Date('2024-04-06'),
      endDate: new Date('2025-04-05'),
      isCurrent: false,
    },
    {
      startYear: 2023,
      startDate: new Date('2023-04-06'),
      endDate: new Date('2024-04-05'),
      isCurrent: false,
    },
    {
      startYear: 2022,
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