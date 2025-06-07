import { Prisma, PrismaClient } from "@prisma/client";
import { generateTransactionsForDateRange } from "../helpers";

export async function seedWriter(prisma: PrismaClient) {
	console.log("🌱 Seeding writer scenario...");

	const user = await prisma.user.upsert({
		where: {
			email: "writer@example.com",
		},
		update: {},
		create: {
			email: "writer@example.com",
			name: "Tom Writer",
			type: "user",
			provider: "email",
			providerAccountId: "writer@example.com",
			hobbies: {
				createMany: {
					data: [
						{
							name: "Freelance Writing",
							description: "Content writing and copywriting",
							isActive: true,
						},
						{
							name: "Novel Writing",
							description: "Fiction writing and self-publishing",
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