import { Prisma, PrismaClient } from "@prisma/client";
import { generateTransactionsForDateRange } from "../helpers";

export async function seedDeveloper(prisma: PrismaClient) {
	console.log("🌱 Seeding developer scenario...");

	const user = await prisma.user.upsert({
		where: {
			email: "developer@example.com",
		},
		update: {},
		create: {
			email: "developer@example.com",
			name: "John Developer",
			type: "user",
			provider: "email",
			providerAccountId: "developer@example.com",
			hobbies: {
				createMany: {
					data: [
						{
							name: "Freelance Development",
							description: "Web and mobile app development projects",
							isActive: true,
						},
						{
							name: "Technical Writing",
							description: "Writing technical articles and documentation",
							isActive: true,
						},
					]
				},
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