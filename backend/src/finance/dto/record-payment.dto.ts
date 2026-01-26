import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RecordPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsOptional()
  transactionReference?: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
