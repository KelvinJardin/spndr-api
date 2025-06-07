import { Prisma, PrismaClient, TransactionType } from '@prisma/client';
import { subYears } from 'date-fns';
import { generateTransactionsForDateRange } from '../helpers';

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
    where: { name: 'Sales' },
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