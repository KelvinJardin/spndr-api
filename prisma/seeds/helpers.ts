import { Prisma, PrismaClient, TransactionCategory, TransactionType } from "@prisma/client";
import { eachMonthOfInterval } from "date-fns";

export function generateRandomAmount(min: number, max: number): number {
	return Number((Math.random() * (max - min) + min).toFixed(2));
}

export function generateRandomDate(start: Date, end: Date): Date {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateMonthlyTransactions(
	userId: string,
	hobbyId: string | null,
	categories: TransactionCategory[],
	taxYearId: string,
	type: TransactionType,
	month: Date,
	count: number = 20,
	minAmount: number = 10,
	maxAmount: number = (type === TransactionType.INCOME) ? 2000 : 500,
): Prisma.TransactionCreateManyInput[] {
	const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
	const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

	const getRef = () => `${type}-${month.getFullYear()}${(month.getMonth() + 1).toString().padStart(2, "0")}-${Math.floor(Math.random() * 1000)}`;

	return Array.from({length: count}, (): Prisma.TransactionCreateManyInput => ({
		type,
		amount: new Prisma.Decimal(
			type === TransactionType.EXPENSE
				? -generateRandomAmount(minAmount, maxAmount)
				: generateRandomAmount(minAmount, maxAmount),
		),
		date: generateRandomDate(startOfMonth, endOfMonth),
		description: type === TransactionType.INCOME
			? "Project Payment"
			: "Equipment Purchase",
		reference: getRef(),
		categoryId: categories[Math.floor(Math.random() * categories.length)].id,
		userId,
		hobbyId,
		taxYearId,
	}));
}

export async function generateTransactionsForDateRange(
	prisma: PrismaClient,
	userId: string,
	hobbyId: string,
): Promise<Prisma.TransactionCreateManyInput[]> {
	const transactions: Prisma.TransactionCreateManyInput[] = [];

	const taxYears = await prisma.taxYear.findMany({
		orderBy: {startDate: "desc"},
	});

	const endDate = new Date();
	const startDate = taxYears[taxYears.length - 1].endDate;

	const months = eachMonthOfInterval({start: startDate, end: endDate});

	const incomeCategories = await prisma.transactionCategory.findMany({
		where: {type: TransactionType.INCOME},
	});

	const expenseCategories = await prisma.transactionCategory.findMany({
		where: {type: TransactionType.EXPENSE},
	});

	for (const currentDate of months) {
		const taxYear = taxYears.find(
			(ty) => currentDate >= ty.startDate && currentDate <= ty.endDate
		);

		if (!taxYear) {
			continue;
		}

		// Generate income transactions
		transactions.push(
			...generateMonthlyTransactions(
				userId,
				hobbyId,
				incomeCategories,
				taxYear.id,
				TransactionType.INCOME,
				currentDate,
				Math.floor(Math.random() * 10) + 15 // 15-25 transactions
			)
		);

		// Generate expense transactions
		transactions.push(
			...generateMonthlyTransactions(
				userId,
				hobbyId,
				expenseCategories,
				taxYear.id,
				TransactionType.EXPENSE,
				currentDate,
				Math.floor(Math.random() * 10) + 15 // 15-25 transactions
			)
		);
	}

	return transactions;
}