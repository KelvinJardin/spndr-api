import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedPhotographer(prisma: PrismaClient) {
  console.log('🌱 Seeding photographer scenario...');

  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'photographer@example.com',
    },
    update: {},
    create: {
      email: 'photographer@example.com',
      name: 'Sarah Photo',
      type: 'user',
      provider: 'email',
      providerAccountId: 'photographer@example.com',
    },
  });

  // Create hobbies
  const hobbies = [
    {
      name: 'Wedding Photography',
      description: 'Wedding and engagement photoshoots',
      isActive: true,
      userId: user.id,
    },
    {
      name: 'Stock Photography',
      description: 'Stock photo sales',
      isActive: true,
      userId: user.id,
    },
  ];

  const createdHobbies = await Promise.all(
    hobbies.map((hobby) =>
      prisma.hobby.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: hobby.name,
          },
        },
        update: hobby,
        create: hobby,
      }),
    ),
  );

  // Get categories
  const incomeCategory = await prisma.transactionCategory.findFirstOrThrow({
    where: { name: 'Self Employment' },
  });
  
  const expenseCategories = await prisma.transactionCategory.findMany({
    where: { type: TransactionType.EXPENSE },
  });

  // Get all tax years
  const taxYears = await prisma.taxYear.findMany({
    orderBy: { startDate: 'desc' },
  });

  // Create transactions for each tax year
  const transactions = [
    // 2024/25 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 1800.00,
      date: new Date('2024-05-10'),
      description: 'Wedding Photography Session',
      reference: 'WEDDING-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -799.99,
      date: new Date('2024-05-05'),
      description: 'New Camera Lens',
      categoryId: expenseCategories.find(c => c.name === 'Equipment')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },

    // 2023/24 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 2500.00,
      date: new Date('2023-07-15'),
      description: 'Corporate Event Photography',
      reference: 'CORP-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.INCOME,
      amount: 350.00,
      date: new Date('2023-08-20'),
      description: 'Stock Photo Sales Q2',
      reference: 'STOCK-2023-Q2',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[1].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },

    // 2022/23 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 1500.00,
      date: new Date('2022-06-01'),
      description: 'Graduation Photography Sessions',
      reference: 'GRAD-2022-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2022)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -1200.00,
      date: new Date('2022-05-15'),
      description: 'Photography Workshop Registration',
      categoryId: expenseCategories.find(c => c.name === 'Professional Development')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2022)!.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }
}