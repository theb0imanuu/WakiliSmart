import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  @IsNotEmpty()
  case_number: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  case_type: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  filing_date: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  client_id: string;
}
