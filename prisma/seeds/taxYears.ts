import { Prisma, PrismaClient } from "@prisma/client";

export async function seedTaxYears(prisma: PrismaClient) {
	const now = new Date();
	const year = now.getFullYear();
	const onNextTaxYear = now > new Date(year, 4, 5);

	const taxYears: Prisma.TaxYearCreateManyInput[] = [];

	for (let i = 0; i < 5; i++) {
		const isCurrent = i === 0;
		const startYear = year - i - (onNextTaxYear ? 0 : 1);
		const startDate = new Date(startYear, 4, 6);
		const endDate = new Date((startYear + 1), 4, 5);

		taxYears.push({
			startYear,
			startDate,
			endDate,
			isCurrent,
		});
	}

	console.log("🌱 Seeding tax years...");

	for (const taxYear of taxYears) {
		await prisma.taxYear.upsert({
			where: {
				startDate_endDate: {
					startDate: taxYear.startDate,
					endDate: taxYear.endDate,
				},
			},
			update: taxYear,
			create: taxYear,
		});
	}
}