import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can upload documents');
    }
    const createDocumentDto: CreateDocumentDto = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size.toString(),
      path: file.path,
    };
    return this.documentsService.create(createDocumentDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can update documents');
    }
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== 'ADVOCATE') {
      throw new UnauthorizedException('Only advocates can delete documents');
    }
    return this.documentsService.remove(id);
  }
}
