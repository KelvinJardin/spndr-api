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
    where: { name: 'Freelance Work' },
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
      amount: 1200.00,
      date: new Date('2024-01-30'),
      description: 'Website Content Writing Project',
      reference: 'WRITE-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 149.99,
      date: new Date('2024-01-05'),
      description: 'Writing Software Subscription',
      categoryId: expenseCategories.find(c => c.name === 'Software Subscriptions')!.id,
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