import { PrismaClient, TransactionType } from '@prisma/client';
import { seedTaxYears } from '../taxYears';

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

  // Create tax years
  await seedTaxYears(prisma, user.id);

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

  // Get categories for transactions
  const incomeCategory = await prisma.transactionCategory.findFirstOrThrow({
    where: { name: 'Freelance Work' },
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
      amount: 2500.00,
      date: new Date('2024-01-15'),
      description: 'E-commerce website development',
      reference: 'INV-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 49.99,
      date: new Date('2024-01-20'),
      description: 'IDE Subscription',
      categoryId: expenseCategories.find(c => c.name === 'Software Subscriptions')!.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 1200.00,
      date: new Date('2024-02-01'),
      description: 'New Development Laptop',
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