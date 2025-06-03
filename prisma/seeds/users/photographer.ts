import { PrismaClient, TransactionType } from '@prisma/client';
import { subYears } from 'date-fns';
import { generateTransactionsForDateRange } from '../helpers';

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