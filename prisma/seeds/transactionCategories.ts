import { PrismaClient, TransactionType } from "@prisma/client";

export async function seedTransactionCategories(prisma: PrismaClient) {
  const categories = [
    // Income categories
    {
      name: 'Sales',
      description: 'Income from sales of goods or services',
      type: TransactionType.INCOME,
    },
    {
      name: 'Other business income',
      description: 'Other sources of business income',
      type: TransactionType.INCOME,
    },

    // Expense categories
    {
      name: 'Cost of goods for resale',
      description: 'Cost of goods bought for resale',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Construction subcontractors',
      description: 'Payments to construction industry subcontractors',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Wages, salaries and other staff costs',
      description: 'Employee and staff related costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Car / Van / Travel expenses',
      description: 'Vehicle and travel related expenses',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Rent / Utilities / Insurance',
      description: 'Property and premises costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Property / Equipment Repairs',
      description: 'Repairs and maintenance costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Office supplies',
      description: 'Office stationery and supplies',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Advertising / Business entertainment',
      description: 'Marketing and entertainment expenses',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bank interest / Loans',
      description: 'Interest payments on business loans',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Financial charges',
      description: 'Bank and other financial charges',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bad debts',
      description: 'Write-offs for uncollectible debts',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Accountancy / Legal / Other professional fees',
      description: 'Professional services costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Asset Depreciation',
      description: 'Depreciation of business assets',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Other business expenses',
      description: 'Other allowable business expenses',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Disallowable expenses',
      description: 'Non-allowable business expenses',
      type: TransactionType.EXPENSE,
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