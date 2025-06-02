import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedArtist(prisma: PrismaClient) {
  console.log('🌱 Seeding artist scenario...');

  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'artist@example.com',
    },
    update: {},
    create: {
      email: 'artist@example.com',
      name: 'Emma Artist',
      type: 'user',
      provider: 'email',
      providerAccountId: 'artist@example.com',
    },
  });

  // Create hobbies
  const hobbies = [
    {
      name: 'Digital Art',
      description: 'Digital illustrations and designs',
      isActive: true,
      userId: user.id,
    },
    {
      name: 'Art Teaching',
      description: 'Online art classes and workshops',
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
      amount: 850.00,
      date: new Date('2024-05-25'),
      description: 'Commission Work - Book Illustrations',
      reference: 'ART-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 249.99,
      date: new Date('2024-05-10'),
      description: 'Digital Art Software Subscription',
      categoryId: expenseCategories.find(c => c.name === 'Software Subscriptions')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },

    // 2023/24 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 1200.00,
      date: new Date('2023-07-15'),
      description: 'Character Design Commission',
      reference: 'ART-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.INCOME,
      amount: 600.00,
      date: new Date('2023-08-20'),
      description: 'Online Art Workshop Series',
      reference: 'TEACH-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[1].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },

    // 2022/23 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 750.00,
      date: new Date('2022-06-01'),
      description: 'Logo Design Project',
      reference: 'ART-2022-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2022)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 899.99,
      date: new Date('2022-05-15'),
      description: 'Drawing Tablet',
      categoryId: expenseCategories.find(c => c.name === 'Equipment')!.id,
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