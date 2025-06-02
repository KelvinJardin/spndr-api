import { PrismaClient, TransactionType } from '@prisma/client';
import { seedTaxYears } from '../taxYears';

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

  // Create tax years
  await seedTaxYears(prisma, user.id);

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
    where: { name: 'Consulting' },
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
      amount: 3500.00,
      date: new Date('2024-01-20'),
      description: 'Strategic Planning Workshop',
      reference: 'CONS-2024-001',
      categoryId: incomeCategory.id,
      userId: user.id,
      taxYearId: currentTaxYear.id,
    },
    {
      type: TransactionType.EXPENSE,
      amount: 299.99,
      date: new Date('2024-01-15'),
      description: 'Professional Association Membership',
      categoryId: expenseCategories.find(c => c.name === 'Professional Development')!.id,
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