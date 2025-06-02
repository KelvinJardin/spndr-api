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

  for (const hobby of hobbies) {
    await prisma.hobby.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: hobby.name,
        },
      },
      update: hobby,
      create: hobby,
    });
  }

  // Get categories
  const incomeCategory = await prisma.transactionCategory.findFirstOrThrow({
    where: { name: 'Self Employment' },
  });
  
  const expenseCategories = await prisma.transactionCategory.findMany({
    where: { type: TransactionType.EXPENSE },
  });

  // Get current tax year
  const currentTaxYear = await prisma.taxYear.findFirstOrThrow({
    where: { isCurrent: true },
  });

  // Create transactions
  const transactions = [
    {
      type: TransactionType.INCOME,
      amount: 1800.00,
      date: new Date('2024-01-10'),
      description: 'Wedding Photography Session',
      reference: 'WEDDING-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 799.99,
      date: new Date('2024-01-05'),
      description: 'New Camera Lens',
      categoryId: expenseCategories.find(c => c.name === 'Equipment')!.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }
}