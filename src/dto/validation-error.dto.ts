import { ApiProperty } from "@nestjs/swagger";

export class ValidationErrorDto {
	@ApiProperty({example: ['Field must be a number']})
	message: string[];

	@ApiProperty({ example: 'Bad Request'})
	error: string;

	@ApiProperty({ example: 400})
	statusCode: number;
}