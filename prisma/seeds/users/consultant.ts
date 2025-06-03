import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedConsultant(prisma: PrismaClient) {
  console.log('🌱 Seeding consultant scenario...');

  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'consultant@example.com',
    },
    update: {},
    create: {
      email: 'consultant@example.com',
      name: 'Mike Consultant',
      type: 'user',
      provider: 'email',
      providerAccountId: 'consultant@example.com',
    },
  });

  // Create hobbies
  const hobbies = [
    {
      name: 'Business Consulting',
      description: 'Strategic business consulting services',
      isActive: true,
      userId: user.id,
    },
    {
      name: 'Workshop Facilitation',
      description: 'Corporate training and workshops',
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
    where: { name: 'Consulting' },
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
      amount: 3500.00,
      date: new Date('2024-05-20'),
      description: 'Strategic Planning Workshop',
      reference: 'CONS-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -299.99,
      date: new Date('2024-05-15'),
      description: 'Professional Association Membership',
      categoryId: expenseCategories.find(c => c.name === 'Professional Development')!.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2024)!.id,
    },

    // 2023/24 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 5000.00,
      date: new Date('2023-07-01'),
      description: 'Business Strategy Consulting',
      reference: 'CONS-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },
    {
      type: TransactionType.INCOME,
      amount: 2500.00,
      date: new Date('2023-09-15'),
      description: 'Leadership Workshop Series',
      reference: 'WORK-2023-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[1].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2023)!.id,
    },

    // 2022/23 Tax Year
    {
      type: TransactionType.INCOME,
      amount: 4000.00,
      date: new Date('2022-06-15'),
      description: 'Process Optimization Project',
      reference: 'CONS-2022-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      hobbyId: createdHobbies[0].id,
      taxYearId: taxYears.find(ty => ty.startYear === 2022)!.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: -1500.00,
      date: new Date('2022-05-20'),
      description: 'Industry Conference Registration',
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