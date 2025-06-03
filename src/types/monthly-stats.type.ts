import { Decimal } from "@prisma/client/runtime/library";

export type MonthlyStats = {
	month: Date;
	income: Decimal;
	expenses: Decimal;
	net: Decimal;
};