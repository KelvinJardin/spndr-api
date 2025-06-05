import { PrismaClient, TransactionType, Sa103fBox } from '@prisma/client';

export async function seedTransactionCategories(prisma: PrismaClient) {
  const categories = [
    // Income categories
    {
      name: 'Turnover',
      description: 'Your business turnover',
      type: TransactionType.INCOME
    },
    {
      name: 'Other Income',
      description: 'Other business income',
      type: TransactionType.INCOME
    },
    
    // Expense categories
    {
      name: 'Cost of Goods',
      description: 'Cost of goods bought for resale or goods used',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Construction Costs',
      description: 'Construction industry subcontractor costs',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Other Direct Costs',
      description: 'Other direct expenses',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Travel and Transport',
      description: 'Car, van and travel expenses',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Premises Costs',
      description: 'Rent, rates, power and insurance costs',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Repairs and Maintenance',
      description: 'Repairs and maintenance of property and equipment',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Professional Fees',
      description: 'Accountancy, legal and other professional fees',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Financial Charges',
      description: 'Interest and bank charges',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Office Costs',
      description: 'Phone, fax, stationery and other office costs',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Other Business Expenses',
      description: 'Other business expenses',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Capital Allowances',
      description: 'Annual investment allowance',
      type: TransactionType.EXPENSE
    },
    {
      name: 'Other Capital Allowances',
      description: 'Other capital allowances',
      type: TransactionType.EXPENSE
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