import { ApiProperty } from '@nestjs/swagger';

export class FilterRangeDto {
  @ApiProperty({ example: '2024-01-01', description: 'Start value for range filter' })
  from: string;

  @ApiProperty({ example: '2024-12-31', description: 'End value for range filter' })
  to: string;
}

class OptionsDto {
  @ApiProperty({ example: 'Income', description: 'Option label' })
  name: string;
  @ApiProperty({ example: 'INCOME', description: 'Option value' })
  value: string;
}

export class FilterOptionDto {
  @ApiProperty({ 
    example: 'type', 
    description: 'The filter field name',
    enum: ['type', 'hobbyId', 'categoryId', 'date', 'amount']
  })
  type: string;

  @ApiProperty({ 
    example: 'INCOME', 
    description: 'Single value for the filter (for enum/select type filters)',
    required: false 
  })
  value?: string;

  @ApiProperty({ 
    type: FilterRangeDto,
    description: 'Range values for date/amount filters',
    required: false 
  })
  range?: FilterRangeDto;

  @ApiProperty({ 
    example: 'Transaction Type', 
    description: 'Human-readable label for the filter' 
  })
  label: string;

  @ApiProperty({ 
    example: 'select', 
    description: 'UI component type hint',
    enum: ['select', 'date-range', 'number-range', 'text']
  })
  inputType: string;

  @ApiProperty({ 
    example: {name: 'Income', value: 'INCOME'},
    description: 'Available options for select type filters',
    required: false,
    type: [OptionsDto]
  })
  options?: OptionsDto[];
}

export class TransactionFilterOptionsDto {
  @ApiProperty({ 
    type: [FilterOptionDto], 
    description: 'Array of available filter options for transactions' 
  })
  filters: FilterOptionDto[];
}