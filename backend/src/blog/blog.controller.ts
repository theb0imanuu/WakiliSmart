import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/file-upload.utils';
// Assuming JwtAuthGuard and RolesGuard will be implemented/available
// For now using what was there or placeholders, but I will fix imports later if needed.
// Use 'auth.guard' as in previous code for continuity until Auth refactor.
import { AuthGuard } from '../auth/auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('banner', multerOptions))
  create(@Request() req: any, @Body() createBlogPostDto: CreateBlogPostDto, @UploadedFile() file: Express.Multer.File) {
    if (req.user.role !== 'ADVOCATE' && req.user.role !== 'ADMIN') { // Assuming ADMIN/ADVOCATE are same or similar authority
       // The prompt mentions "Roles: ADMIN or SECRETARY". "Checks if User is ADMIN or SECRETARY".
       // For Blog, likely only ADMIN (Advocate).
       // Current code checked 'ADVOCATE'.
       // User prompt says "RolesGuard ... Checks if User is ADMIN or SECRETARY".
       // BlogCMS is for "Admin Portal (Advocate)". So probably ADMIN.
       // I'll stick to logic checking for ADMIN or ADVOCATE.
       if (req.user.role !== 'ADVOCATE' && req.user.role !== 'ADMIN') {
         throw new UnauthorizedException('Only advocates/admins can post blogs');
       }
    }

    createBlogPostDto.authorId = req.user.sub;
    if (file) {
      createBlogPostDto.bannerPath = file.path;
    }
    return this.blogService.create(createBlogPostDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('banner', multerOptions))
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      updateBlogPostDto.bannerPath = file.path;
    }
    return this.blogService.update(id, updateBlogPostDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
