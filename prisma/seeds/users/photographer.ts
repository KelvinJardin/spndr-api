import { Prisma, PrismaClient } from "@prisma/client";
import { generateTransactionsForDateRange } from "../helpers";

export async function seedPhotographer(prisma: PrismaClient) {
	console.log("🌱 Seeding photographer scenario...");

	const user = await prisma.user.upsert({
		where: {
			email: "photographer@example.com",
		},
		update: {},
		create: {
			email: "photographer@example.com",
			name: "Sarah Photo",
			type: "user",
			provider: "email",
			providerAccountId: "photographer@example.com",
			hobbies: {
				createMany: {
					data: [
						{
							name: "Wedding Photography",
							description: "Wedding and engagement photoshoots",
							isActive: true,
						},
						{
							name: "Stock Photography",
							description: "Stock photo sales",
							isActive: true,
						},
					]
				},
			}
		},
		include: {
			hobbies: true,
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