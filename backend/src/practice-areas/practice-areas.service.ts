import { Injectable } from '@nestjs/common';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';

@Injectable()
export class PracticeAreasService {
  private readonly practiceAreas = [
    { slug: "corporate-law", icon: "corporate_fare", title: "Corporate Law", desc: "Expert guidance on mergers, acquisitions, and corporate governance for businesses." },
    { slug: "civil-litigation", icon: "gavel", title: "Civil Litigation", desc: "Strategic representation in complex disputes to protect your rights and interests." },
    { slug: "family-estate", icon: "family_restroom", title: "Family & Estate", desc: "Compassionate support for sensitive family matters and future-proofing your assets." },
    { slug: "real-estate", icon: "real_estate_agent", title: "Real Estate", desc: "Handling transactions, zoning issues, and property disputes with speed and accuracy." },
    { slug: "intellectual-property", icon: "lightbulb", title: "Intellectual Property", desc: "Protecting your innovations and creative works through patents and trademarks." },
    { slug: "employment-law", icon: "work", title: "Employment Law", desc: "Advising on contracts, compliance, and workplace disputes for employers." },
  ];

  create(createPracticeAreaDto: CreatePracticeAreaDto) {
    return 'This action adds a new practiceArea';
  }

  findAll() {
    return this.practiceAreas;
  }

  findOne(slug: string) {
    return this.practiceAreas.find(pa => pa.slug === slug);
  }

  update(id: string, updatePracticeAreaDto: UpdatePracticeAreaDto) {
    return `This action updates a #${id} practiceArea`;
  }

  remove(id: string) {
    return `This action removes a #${id} practiceArea`;
  }
}
