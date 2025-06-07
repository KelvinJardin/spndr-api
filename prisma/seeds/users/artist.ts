import { Prisma, PrismaClient } from "@prisma/client";
import { generateTransactionsForDateRange } from "../helpers";

export async function seedArtist(prisma: PrismaClient) {
	console.log("🌱 Seeding artist scenario...");

	const user = await prisma.user.upsert({
		where: {
			email: "artist@example.com",
		},
		update: {},
		create: {
			email: "artist@example.com",
			name: "Emma Artist",
			type: "user",
			provider: "email",
			providerAccountId: "artist@example.com",
			hobbies: {
				createMany: {
					data: [
						{
							name: "Digital Art",
							description: "Digital illustrations and designs",
							isActive: true,
						},
						{
							name: "Art Teaching",
							description: "Online art classes and workshops",
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