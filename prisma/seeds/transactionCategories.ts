import { PrismaClient, TransactionType } from '@prisma/client';

export async function seedTransactionCategories(prisma: PrismaClient) {
  const categories = [
    // Income categories
    {
      name: 'Self Employment',
      description: 'Income from self-employed work',
      type: TransactionType.INCOME,
      allowable: false,
      hmrcCategory: 'SELF_EMPLOYMENT',
    },
    {
      name: 'Freelance Work',
      description: 'Income from freelance projects',
      type: TransactionType.INCOME,
      allowable: false,
      hmrcCategory: 'SELF_EMPLOYMENT',
    },
    {
      name: 'Consulting',
      description: 'Income from consulting services',
      type: TransactionType.INCOME,
      allowable: false,
      hmrcCategory: 'SELF_EMPLOYMENT',
    },
    
    // Expense categories
    {
      name: 'Office Supplies',
      description: 'Stationery, printer ink, etc.',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'OFFICE_COSTS',
    },
    {
      name: 'Software Subscriptions',
      description: 'Software licenses and subscriptions',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'OFFICE_COSTS',
    },
    {
      name: 'Equipment',
      description: 'Computer hardware, tools, etc.',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'EQUIPMENT',
    },
    {
      name: 'Professional Development',
      description: 'Courses, training, and certifications',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'TRAINING',
    },
    {
      name: 'Travel',
      description: 'Business travel expenses',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'TRAVEL',
    },
    {
      name: 'Marketing',
      description: 'Advertising and promotion',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'ADVERTISING',
    },
    {
      name: 'Insurance',
      description: 'Business insurance costs',
      type: TransactionType.EXPENSE,
      allowable: true,
      hmrcCategory: 'INSURANCE',
    },
  ];

  console.log('🌱 Seeding transaction categories...');
  
  for (const category of categories) {
    await prisma.transactionCategory.upsert({
      where: {
        name_type: {
          name: category.name,
          type: category.type,
        },
      },
      update: category,
      create: category,
    });
  }
}