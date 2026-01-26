import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  bannerPath?: string;

  @IsString()
  @IsOptional()
  authorId: string;
}
