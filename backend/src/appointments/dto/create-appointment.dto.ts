import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  date: string; // ISO Date string

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  clientPhone: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  clientEmail?: string;
}
