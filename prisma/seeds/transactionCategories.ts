import { PrismaClient, TransactionType, Sa103fBox } from '@prisma/client';

export async function seedTransactionCategories(prisma: PrismaClient) {
  const categories = [
    // Income categories
    {
      name: 'Turnover',
      description: 'Your business turnover including balancing charges',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_8,
      allowable: true,
      notes: 'Total turnover from self-employment',
    },
    {
      name: 'Other Income',
      description: 'Other business income not included in turnover',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_9,
      allowable: true,
      notes: 'Any other business income not included in box 8',
    },
    
    // Expense categories
    {
      name: 'Cost of Goods',
      description: 'Cost of goods bought for resale or goods used',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_17,
      allowable: true,
      notes: 'Direct costs of goods used or resold in the business',
    },
    {
      name: 'Construction Costs',
      description: 'Construction industry subcontractor costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_18,
      allowable: true,
      notes: 'Payments to subcontractors in construction industry',
    },
    {
      name: 'Other Direct Costs',
      description: 'Other direct expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_19,
      allowable: true,
      notes: 'Direct costs not included elsewhere',
    },
    {
      name: 'Travel and Transport',
      description: 'Car, van and travel expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_20,
      allowable: true,
      notes: 'Business travel, fuel, and vehicle expenses',
    },
    {
      name: 'Premises Costs',
      description: 'Rent, rates, power and insurance costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_21,
      allowable: true,
      notes: 'Costs related to business premises',
    },
    {
      name: 'Repairs and Maintenance',
      description: 'Repairs and maintenance of property and equipment',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_22,
      allowable: true,
      notes: 'Repairs and maintenance costs',
    },
    {
      name: 'Professional Fees',
      description: 'Accountancy, legal and other professional fees',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_23,
      allowable: true,
      notes: 'Professional services costs',
    },
    {
      name: 'Financial Charges',
      description: 'Interest and bank charges',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: true,
      notes: 'Bank and financial charges',
    },
    {
      name: 'Office Costs',
      description: 'Phone, fax, stationery and other office costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_25,
      allowable: true,
      notes: 'General office expenses',
    },
    {
      name: 'Other Business Expenses',
      description: 'Other business expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Business expenses not covered elsewhere',
    },
    {
      name: 'Capital Allowances',
      description: 'Annual investment allowance',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_30,
      allowable: true,
      notes: 'Annual investment allowance claims',
    },
    {
      name: 'Other Capital Allowances',
      description: 'Other capital allowances',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_31,
      allowable: true,
      notes: 'Other capital allowance claims',
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