import { PrismaClient, TransactionType } from '@prisma/client';
import { subYears } from 'date-fns';
import { generateTransactionsForDateRange } from '../helpers';

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
  
  // Get tax years
  const taxYears = await prisma.taxYear.findMany({
    orderBy: { startDate: 'desc' },
  });

  // Generate transactions for the past 3 years for each hobby
  const endDate = new Date();
  const startDate = subYears(endDate, 3);

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
    
    for (const transaction of transactions) {
      await prisma.transaction.create(transaction);
    }
  }
}