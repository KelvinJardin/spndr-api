import { Prisma, PrismaClient } from "@prisma/client";
import { generateTransactionsForDateRange } from "../helpers";

export async function seedConsultant(prisma: PrismaClient) {
	console.log("🌱 Seeding consultant scenario...");

	const user = await prisma.user.upsert({
		where: {
			email: "consultant@example.com",
		},
		update: {},
		create: {
			email: "consultant@example.com",
			name: "Mike Consultant",
			type: "user",
			provider: "email",
			providerAccountId: "consultant@example.com",
			hobbies: {
				createMany: {
					data: [
						{
							name: "Business Consulting",
							description: "Strategic business consulting services",
							isActive: true,
						},
						{
							name: "Workshop Facilitation",
							description: "Corporate training and workshops",
							isActive: true,
						},
					]
				}
			}
		},
		include: {
			hobbies: true
		}
	});

	const allTransactions: Prisma.TransactionCreateManyInput[] = [];

	for (const hobby of user.hobbies) {
		const transactions = await generateTransactionsForDateRange(
			prisma,
			user.id,
			hobby.id,
		);
		allTransactions.push(...transactions);
	}

	await prisma.transaction.createMany({
		data: allTransactions,
	});
}