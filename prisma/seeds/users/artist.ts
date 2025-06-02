import { PrismaClient, TransactionType } from '@prisma/client';
import { seedTaxYears } from '../taxYears';

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

  // Create tax years
  await seedTaxYears(prisma, user.id);

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
    where: { userId: user.id, isCurrent: true },
  });

  // Create transactions
  const transactions = [
    {
      type: TransactionType.INCOME,
      amount: 850.00,
      date: new Date('2024-01-25'),
      description: 'Commission Work - Book Illustrations',
      reference: 'ART-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 249.99,
      date: new Date('2024-01-10'),
      description: 'Digital Art Software Subscription',
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