import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tables: string[] = [
	"transaction",
	"hobby",
	"authenticator",
	"session",
	"verificationToken",
	"user",
	"transactionCategory",
	"taxYear",
];

async function main() {
	console.log("🧹 Cleaning up existing data...");

	for (const table of tables) {
		await prisma[table].deleteMany();
	}

	console.log("🧹 All existing data deleted!");
}

main()
	.catch((e) => {
		console.error("Error wiping database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
