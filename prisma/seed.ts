import { PrismaClient } from '@prisma/client';
import { seedTransactionCategories } from './seeds/transactionCategories';
import { seedDeveloper } from './seeds/users/developer';
import { seedPhotographer } from './seeds/users/photographer';
import { seedConsultant } from './seeds/users/consultant';
import { seedArtist } from './seeds/users/artist';
import { seedWriter } from './seeds/users/writer';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed transaction categories first as they're referenced by other seeds
  await seedTransactionCategories(prisma);

  // Seed user scenarios
  await seedDeveloper(prisma);
  await seedPhotographer(prisma);
  await seedConsultant(prisma);
  await seedArtist(prisma);
  await seedWriter(prisma);

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