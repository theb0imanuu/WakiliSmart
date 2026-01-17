import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  private readonly documents = [
    { id: '1', name: "Initial Drafts", type: "folder", date: "Oct 24, 2023", size: "-", status: "" },
    { id: '2', name: "Final_Merger_Agreement_v3.pdf", type: "pdf", date: "Today, 10:45 AM", size: "2.4 MB", status: "Signed" },
    { id: '3', name: "Draft_Addendum_B.docx", type: "doc", date: "Yesterday, 4:20 PM", size: "450 KB", status: "Draft" },
    { id: '4', name: "Scanned_Evidence_001.jpg", type: "image", date: "Oct 20, 2023", size: "5.1 MB", status: "Shared" },
  ];

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  findAll() {
    return this.documents;
  }

  findOne(id: string) {
    return `This action returns a #${id} document`;
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: string) {
    return `This action removes a #${id} document`;
  }
}
