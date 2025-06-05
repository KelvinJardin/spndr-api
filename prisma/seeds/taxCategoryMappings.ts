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
      name: 'Sales',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_8,
      allowable: true,
      notes: 'Total turnover from self-employment',
    },
    {
      name: 'Other business income',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_9,
      allowable: true,
      notes: 'Any other business income not included in box 8',
    },
    {
      name: 'Cost of goods for resale',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_17,
      allowable: true,
      notes: 'Direct costs of goods used or resold in the business',
    },
    {
      name: 'Construction subcontractors',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_18,
      allowable: true,
      notes: 'Payments to subcontractors in construction industry',
    },
    {
      name: 'Wages, salaries and other staff costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_19,
      allowable: true,
      notes: 'Employee and staff related costs',
    },
    {
      name: 'Car / Van / Travel expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_20,
      allowable: true,
      notes: 'Business travel, fuel, and vehicle expenses',
    },
    {
      name: 'Rent / Utilities / Insurance',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_21,
      allowable: true,
      notes: 'Costs related to business premises',
    },
    {
      name: 'Property / Equipment Repairs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_22,
      allowable: true,
      notes: 'Repairs and maintenance costs',
    },
    {
      name: 'Accountancy / Legal / Other professional fees',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_23,
      allowable: true,
      notes: 'Professional services costs',
    },
    {
      name: 'Bank interest / Loans',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: true,
      notes: 'Interest payments on business loans',
    },
    {
      name: 'Office supplies',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_25,
      allowable: true,
      notes: 'Office stationery and supplies',
    },
    {
      name: 'Other business expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Business expenses not covered elsewhere',
    },
    {
      name: 'Asset Depreciation',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_30,
      allowable: true,
      notes: 'Annual investment allowance claims',
    },
    {
      name: 'Financial charges',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: true,
      notes: 'Bank and financial charges',
    },
    {
      name: 'Bad debts',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Write-offs for uncollectible debts',
    },
    {
      name: 'Advertising / Business entertainment',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: false,
      notes: 'Marketing and entertainment expenses (entertainment portion disallowed)',
    },
    {
      name: 'Disallowable expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: false,
      notes: 'Non-allowable business expenses',
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