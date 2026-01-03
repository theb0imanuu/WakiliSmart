// Example TypeScript types - will be expanded based on Prisma schema

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  // ... other fields
}
