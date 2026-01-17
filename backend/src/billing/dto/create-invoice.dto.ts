import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  balance_due: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsDateString()
  due_date: Date;

  @IsString()
  @IsNotEmpty()
  case_id: string;
}
