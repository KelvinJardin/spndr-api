import { ApiProperty } from "@nestjs/swagger";

export class MonthlyStatsDto {
	@ApiProperty()
	month: Date;

	@ApiProperty({ example: '1250.00' })
	income: string;

	@ApiProperty({ example: '450.00' })
	expenses: string;

	@ApiProperty({ example: '800.00' })
	net: string;
}

export class AveragesDto {
	@ApiProperty({ example: '1500.00' })
	monthlyIncome: string;

	@ApiProperty({ example: '500.00' })
	monthlyExpenses: string;

	@ApiProperty({ example: '1000.00' })
	monthlyNet: string;
}

export class PeakTransactionDto {
	@ApiProperty({ example: '2500.00' })
	amount: string;

	@ApiProperty()
	date: Date;

	@ApiProperty({ example: 'Website Development Project' })
	description: string;
}

export class PeaksDto {
	@ApiProperty()
	highestIncome: PeakTransactionDto;

	@ApiProperty()
	highestExpense: PeakTransactionDto;
}