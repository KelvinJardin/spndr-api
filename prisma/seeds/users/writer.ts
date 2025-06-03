import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedWriter(prisma: PrismaClient) {
  console.log('🌱 Seeding writer scenario...');

  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'writer@example.com',
    },
    update: {},
    create: {
      email: 'writer@example.com',
      name: 'Tom Writer',
      type: 'user',
      provider: 'email',
      providerAccountId: 'writer@example.com',
    },
  });

  // Create hobbies
  const hobbies = [
    {
      name: 'Freelance Writing',
      description: 'Content writing and copywriting',
      isActive: true,
      userId: user.id,
    },
    {
      name: 'Novel Writing',
      description: 'Fiction writing and self-publishing',
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
      amount: 1200.00,
      date: new Date('2024-05-30'),
      description: 'Website Content Writing Project',
      reference: 'WRITE-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -149.99,
      date: new Date('2024-05-05'),
      description: 'Writing Software Subscription',
      categoryId: expenseCategories.find(c => c.name === 'Software Subscriptions')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },

    // 2023/24 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 2500.00,
      date: new Date('2023-07-15'),
      description: 'Technical Documentation Project',
      reference: 'WRITE-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.INCOME,
      amount: 800.00,
      date: new Date('2023-09-01'),
      description: 'E-book Sales Q2',
      reference: 'BOOK-2023-Q2',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[1].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },

    // 2022/23 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 1800.00,
      date: new Date('2022-06-15'),
      description: 'Blog Writing Series',
      reference: 'WRITE-2022-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2022)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -399.99,
      date: new Date('2022-05-20'),
      description: 'Writing Course',
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