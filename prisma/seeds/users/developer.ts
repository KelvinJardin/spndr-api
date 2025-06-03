import { Prisma, PrismaClient, TransactionType } from '@prisma/client';
import { subYears } from 'date-fns';
import { generateTransactionsForDateRange } from '../helpers';

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

  // Get categories
  const incomeCategory = await prisma.transactionCategory.findFirstOrThrow({
    where: { name: 'Freelance Work' },
  });
  const expenseCategories = await prisma.transactionCategory.findMany({
    where: { type: TransactionType.EXPENSE },
  });

  // Get tax years
  const taxYears = await prisma.taxYear.findMany({
    orderBy: { startDate: 'desc' },
  });

  // Generate transactions for the past 3 years for each hobby
  const endDate = new Date();
  const startDate = subYears(endDate, 3);

  const allTransactions: Prisma.TransactionCreateManyInput[] = [];

  for (const hobby of createdHobbies) {
    const transactions = await generateTransactionsForDateRange(
      user.id,
      hobby.id,
      incomeCategory,
      expenseCategories,
      taxYears,
      startDate,
      endDate
    );
    allTransactions.push(...transactions);
  }

  // Batch create all transactions
  await prisma.transaction.createMany({
    data: allTransactions,
  });
}