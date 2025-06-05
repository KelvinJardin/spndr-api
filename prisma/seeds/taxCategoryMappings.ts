import { PrismaClient, Sa103fBox, TransactionType } from '@prisma/client';

type CategoryMapping = {
  name: string;
  type: TransactionType;
  sa103fBox: Sa103fBox;
  allowable: boolean;
  notes: string | null;
};

export async function seedTaxCategoryMappings(prisma: PrismaClient) {
  console.log('🌱 Seeding tax category mappings...');

  const mappings: CategoryMapping[] = [
    {
      name: 'Turnover',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_8,
      allowable: true,
      notes: 'Total turnover from self-employment',
    },
    {
      name: 'Other Income',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_9,
      allowable: true,
      notes: 'Any other business income not included in box 8',
    },
    {
      name: 'Cost of Goods',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_17,
      allowable: true,
      notes: 'Direct costs of goods used or resold in the business',
    },
    {
      name: 'Construction Costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_18,
      allowable: true,
      notes: 'Payments to subcontractors in construction industry',
    },
    {
      name: 'Other Direct Costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_19,
      allowable: true,
      notes: 'Direct costs not included elsewhere',
    },
    {
      name: 'Travel and Transport',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_20,
      allowable: true,
      notes: 'Business travel, fuel, and vehicle expenses',
    },
    {
      name: 'Premises Costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_21,
      allowable: true,
      notes: 'Costs related to business premises',
    },
    {
      name: 'Repairs and Maintenance',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_22,
      allowable: true,
      notes: 'Repairs and maintenance costs',
    },
    {
      name: 'Professional Fees',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_23,
      allowable: true,
      notes: 'Professional services costs',
    },
    {
      name: 'Financial Charges',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: true,
      notes: 'Bank and financial charges',
    },
    {
      name: 'Office Costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_25,
      allowable: true,
      notes: 'General office expenses',
    },
    {
      name: 'Other Business Expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Business expenses not covered elsewhere',
    },
    {
      name: 'Capital Allowances',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_30,
      allowable: true,
      notes: 'Annual investment allowance claims',
    },
    {
      name: 'Other Capital Allowances',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_31,
      allowable: true,
      notes: 'Other capital allowance claims',
    },
  ];

  // Get all tax years
  const taxYears = await prisma.taxYear.findMany();

  // Get all categories
  const categories = await prisma.transactionCategory.findMany();

  // Create mappings for each tax year
  for (const taxYear of taxYears) {
    for (const mapping of mappings) {
      const category = categories.find(
        c => c.name === mapping.name && c.type === mapping.type
      );

      if (category) {
        await prisma.taxCategoryMapping.upsert({
          where: {
            categoryId_taxYearId: {
              categoryId: category.id,
              taxYearId: taxYear.id,
            },
          },
          update: {
            sa103fBox: mapping.sa103fBox,
            allowable: mapping.allowable,
            notes: mapping.notes,
          },
          create: {
            categoryId: category.id,
            taxYearId: taxYear.id,
            sa103fBox: mapping.sa103fBox,
            allowable: mapping.allowable,
            notes: mapping.notes,
          },
        });
      }
    }
  }
}