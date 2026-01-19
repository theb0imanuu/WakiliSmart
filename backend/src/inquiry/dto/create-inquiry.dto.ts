import { IsString, IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  @IsIn(['Low', 'Medium', 'High'])
  urgency: string;
}