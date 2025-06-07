import { PrismaClient, Sa103fBox, TransactionType, TaxCategoryMapping } from '@prisma/client';

type CategoryMapping = Omit<
    TaxCategoryMapping,
    'id' | 'createdAt' | 'updatedAt' | 'categoryId' | 'taxYearId'
  >
  & {
  type: TransactionType;
};

export async function seedTaxCategoryMappings(prisma: PrismaClient) {
  console.log('🌱 Seeding tax category mappings...');

  const mappings: Record<string, CategoryMapping > = {
    "Sales": {
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_15,
      allowable: true,
      notes: 'Sales/turnover',
      visible: true,
    },
    "Other business income": {
      type: TransactionType.INCOME,
      sa103fBox: Sa103fBox.BOX_16,
      allowable: true,
      notes: 'Any other business income not included in box 15',
      visible: true,
    },
    "Cost of goods for resale": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_17,
      allowable: true,
      notes: 'Cost of goods bought for resale or goods used',
      visible: true,
    },
    "Construction subcontractors": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_18,
      allowable: true,
      notes: 'Construction industry – payments to subcontractors',
      visible: true,
    },
    "Wages, salaries and other staff costs": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_19,
      allowable: true,
      notes: 'Wages, salaries and other staff costs',
      visible: true,
    },
    "Car / Van / Travel expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_20,
      allowable: true,
      notes: 'Car, van and travel expenses',
      visible: true,
    },
    "Rent / Utilities / Insurance": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_21,
      allowable: true,
      notes: 'Rent, rates, power and insurance costs',
      visible: true,
    },
    "Property / Equipment Repairs": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_22,
      allowable: true,
      notes: 'Repairs and maintenance of property and equipment',
      visible: true,
    },
    "Office supplies": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_23,
      allowable: true,
      notes: 'Phone, fax, stationery and other office costs',
      visible: true,
    },
    "Advertising / Business entertainment": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_24,
      allowable: false,
      notes: 'Advertising and business entertainment costs',
      visible: true,
    },
    "Bank interest / Loans": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_25,
      allowable: true,
      notes: 'Interest on bank and other loans',
      visible: true,
    },
    "Financial charges": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_26,
      allowable: true,
      notes: 'Bank, credit card and other financial charges',
      visible: true,
    },
    "Bad debts": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_27,
      allowable: true,
      notes: 'Irrecoverable debts written off',
      visible: true,
    },
    "Accountancy / Legal / Other professional fees": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_28,
      allowable: true,
      notes: 'Accountancy, legal and other professional fees',
      visible: true,
    },
    "Asset Depreciation": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_29,
      allowable: true,
      notes: 'Depreciation and loss or profit on sale of assets',
      visible: true,
    },
    "Other business expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_30,
      allowable: true,
      notes: 'Other business expenses',
      visible: true,
    },
    "Total expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_31,
      allowable: true,
      notes: 'Total number of expenses',
      visible: false,
    },
    "Disallowable cost of goods for resale": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_32,
      allowable: false,
      notes: 'Cost of goods bought for resale or goods used',
      visible: true,
    },
    "Disallowable construction subcontractors": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_33,
      allowable: false,
      notes: 'Construction industry – payments to subcontractors',
      visible: true,
    },
    "Disallowable wages, salaries and other staff costs": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_34,
      allowable: false,
      notes: 'Wages, salaries and other staff costs',
      visible: true,
    },
    "Disallowable car / van / travel expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_35,
      allowable: false,
      notes: 'Car, van and travel expenses',
      visible: true,
    },
    "Disallowable rent / utilities / insurance": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_36,
      allowable: false,
      notes: 'Rent, rates, power and insurance costs',
      visible: true,
    },
    "Disallowable property / equipment Repairs": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_37,
      allowable: false,
      notes: 'Repairs and maintenance of property and equipment',
      visible: true,
    },
    "Disallowable office supplies": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_38,
      allowable: false,
      notes: 'Phone, fax, stationery and other office costs',
      visible: true,
    },
    "Disallowable advertising / business entertainment": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_39,
      allowable: false,
      notes: 'Advertising and business entertainment costs',
      visible: true,
    },
    "Disallowable bank interest / loans": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_40,
      allowable: false,
      notes: 'Interest on bank and other loans',
      visible: true,
    },
    "Disallowable financial charges": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_41,
      allowable: false,
      notes: 'Bank, credit card and other financial charges',
      visible: true,
    },
    "Disallowable bad debts": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_42,
      allowable: false,
      notes: 'Irrecoverable debts written off',
      visible: true,
    },
    "Disallowable accountancy / legal / other professional fees": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_43,
      allowable: false,
      notes: 'Accountancy, legal and other professional fees',
      visible: true,
    },
    "Disallowable asset Depreciation": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_44,
      allowable: false,
      notes: 'Depreciation and loss or profit on sale of assets',
      visible: true,
    },
    "Disallowable other business expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_45,
      allowable: false,
      notes: 'Other business expenses',
      visible: true,
    },
    "Disallowable total expenses": {
      type: TransactionType.EXPENSE,
      sa103fBox: Sa103fBox.BOX_46,
      allowable: false,
      notes: 'Total number of expenses',
      visible: false,
    },
  };

  const taxYearMappings: Record<string, Record<string, CategoryMapping > > = {
    2025: mappings,
    2024: mappings,
    2023: mappings,
    2022: mappings,
  }

  // Get all tax years
  const taxYears = await prisma.taxYear.findMany();

  // Get all categories
  const categories = await prisma.transactionCategory.findMany();

  // Create mappings for each tax year
  for (const taxYear of taxYears) {
    const yearsCatMap = taxYearMappings[taxYear.startYear] ?? {};

    for (const [name, mapping] of Object.entries(yearsCatMap)) {
      const category = categories.find(
        c => c.name === name && c.type === mapping.type,
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