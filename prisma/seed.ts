import { PrismaClient } from '@prisma/client';
import { seedTaxYears } from './seeds/taxYears';
import { seedTransactionCategories } from './seeds/transactionCategories';
import { seedDeveloper } from './seeds/users/developer';
import { seedPhotographer } from './seeds/users/photographer';
import { seedConsultant } from './seeds/users/consultant';
import { seedArtist } from './seeds/users/artist';
import { seedWriter } from './seeds/users/writer';

const prisma = new PrismaClient();

const seeds: ((prisma: PrismaClient) => Promise<void>)[] = [
  seedTaxYears,
  seedTransactionCategories,
  seedDeveloper,
  seedPhotographer,
  seedConsultant,
  seedArtist,
  seedWriter,
];

const tables: string[] = [
  'transaction',
  'hobby',
  'authenticator',
  'session',
  'verificationToken',
  'user',
  'transactionCategory',
  'taxYear',
]

async function deleteAllData() {
  console.log('🧹 Cleaning up existing data...');

  for (const table of tables) {
    await prisma[table].deleteMany();
  }

  console.log('🧹 All existing data deleted!');
}

async function main() {
  console.log('🌱 Starting database seed...');

  await deleteAllData();

  for (const seed of seeds) {
    await seed(prisma);
  }

  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
