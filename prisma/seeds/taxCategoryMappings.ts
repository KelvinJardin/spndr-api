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
      sa103fBox: Sa103fBox.BOX_15,
      allowable: true,
      notes: 'Sales/turnover',
    },
    {
      name: 'Other business income',
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_16,
      allowable: true,
      notes: 'Any other business income not included in box 15',
    },
    {
      name: 'Cost of goods for resale',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_17,
      allowable: true,
      notes: 'Cost of goods bought for resale or goods used',
    },
    {
      name: 'Construction subcontractors',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_18,
      allowable: true,
      notes: 'Construction industry – payments to subcontractors',
    },
    {
      name: 'Wages, salaries and other staff costs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_19,
      allowable: true,
      notes: 'Wages, salaries and other staff costs',
    },
    {
      name: 'Car / Van / Travel expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_20,
      allowable: true,
      notes: 'Car, van and travel expenses',
    },
    {
      name: 'Rent / Utilities / Insurance',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_21,
      allowable: true,
      notes: 'Rent, rates, power and insurance costs',
    },
    {
      name: 'Property / Equipment Repairs',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_22,
      allowable: true,
      notes: 'Repairs and maintenance of property and equipment',
    },
    {
      name: 'Office supplies',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_23,
      allowable: true,
      notes: 'Phone, fax, stationery and other office costs',
    },
    {
      name: 'Advertising / Business entertainment',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: false,
      notes: 'Advertising and business entertainment costs',
    },
    {
      name: 'Bank interest / Loans',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_25,
      allowable: true,
      notes: 'Interest on bank and other loans',
    },
    {
      name: 'Financial charges',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Bank, credit card and other financial charges',
    },
    {
      name: 'Bad debts',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_27,
      allowable: true,
      notes: 'Irrecoverable debts written off',
    },
    {
      name: 'Accountancy / Legal / Other professional fees',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_28,
      allowable: true,
      notes: 'Accountancy, legal and other professional fees',
    },
    {
      name: 'Asset Depreciation',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_29,
      allowable: true,
      notes: 'Depreciation and loss or profit on sale of assets',
    },
    {
      name: 'Other business expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_30,
      allowable: true,
      notes: 'Other business expenses',
    },
    {
      name: 'Disallowable expenses',
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_32,
      allowable: false,
      notes: 'Disallowable expenses (mirrors boxes 17–30)',
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