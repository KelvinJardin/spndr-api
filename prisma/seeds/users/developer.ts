import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedDeveloper(prisma: PrismaClient) {
  console.log('🌱 Seeding developer scenario...');

  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'developer@example.com',
    },
    update: {},
    create: {
      email: 'developer@example.com',
      name: 'John Developer',
      type: 'user',
      provider: 'email',
      providerAccountId: 'developer@example.com',
    },
  });

  // Create hobbies
  const hobbies = [
    {
      name: 'Freelance Development',
      description: 'Web and mobile app development projects',
      isActive: true,
      userId: user.id,
    },
    {
      name: 'Technical Writing',
      description: 'Writing technical articles and documentation',
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

  // Get categories for transactions
  const incomeCategory = await prisma.transactionCategory.findFirstOrThrow({
    where: { name: 'Freelance Work' },
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
      amount: 2500.0,
      date: new Date('2024-05-15'),
      description: 'E-commerce website development',
      reference: 'INV-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2024)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -49.99,
      date: new Date('2024-05-20'),
      description: 'IDE Subscription',
      categoryId: expenseCategories.find((c) => c.name === 'Software Subscriptions')!
        .id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2024)!.id,
    },

    // 2023/24 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 3000.0,
      date: new Date('2023-06-15'),
      description: 'Mobile app development project',
      reference: 'INV-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -1200.0,
      date: new Date('2023-07-01'),
      description: 'New Development Laptop',
      categoryId: expenseCategories.find((c) => c.name === 'Equipment')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.INCOME,
      amount: 500.0,
      date: new Date('2023-08-20'),
      description: 'Technical documentation writing',
      reference: 'INV-2023-002',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[1].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2023)!.id,
    },

    // 2022/23 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 2000.0,
      date: new Date('2022-05-10'),
      description: 'WordPress website development',
      reference: 'INV-2022-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2022)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -299.99,
      date: new Date('2022-06-15'),
      description: 'Development courses subscription',
      categoryId: expenseCategories.find(
        (c) => c.name === 'Professional Development',
      )!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find((ty) => ty.startYear === 2022)!.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }
}