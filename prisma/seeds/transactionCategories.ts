import { PrismaClient, TransactionType } from "@prisma/client";

export async function seedTransactionCategories(prisma: PrismaClient) {
  const categories = [
    // Income categories
    {
      name: 'Sales',
      description: 'Sales/turnover',
      type: TransactionType.INCOME,
    },
    {
      name: 'Other business income',
      description: 'Any other business income not included in box 15',
      type: TransactionType.INCOME,
    },

    // Expense categories
    {
      name: 'Cost of goods for resale',
      description: 'Cost of goods bought for resale or goods used',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Construction subcontractors',
      description: 'Construction industry – payments to subcontractors',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Wages, salaries and other staff costs',
      description: 'Wages, salaries and other staff costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Car / Van / Travel expenses',
      description: 'Car, van and travel expenses',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Rent / Utilities / Insurance',
      description: 'Rent, rates, power and insurance costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Property / Equipment Repairs',
      description: 'Repairs and maintenance of property and equipment',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Office supplies',
      description: 'Phone, fax, stationery and other office costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Advertising / Business entertainment',
      description: 'Advertising and business entertainment costs',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bank interest / Loans',
      description: 'Interest on bank and other loans',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Financial charges',
      description: 'Bank, credit card and other financial charges',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Bad debts',
      description: 'Irrecoverable debts written off',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Accountancy / Legal / Other professional fees',
      description: 'Accountancy, legal and other professional fees',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Asset Depreciation',
      description: 'Depreciation and loss or profit on sale of assets',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Other business expenses',
      description: 'Other business expenses',
      type: TransactionType.EXPENSE,
    },
    {
      name: 'Disallowable expenses',
      description: 'Disallowable expenses (mirrors boxes 17–30)',
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