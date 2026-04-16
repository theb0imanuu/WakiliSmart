export type UserRole = 'ADVOCATE' | 'SECRETARY' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export type CaseType = 'CIVIL' | 'CRIMINAL' | 'CONVEYANCING' | 'COMMERCIAL' | 'FAMILY' | 'OTHER';
export type CaseStatus = 'OPEN' | 'ACTIVE' | 'PENDING' | 'ON_HOLD' | 'CLOSED';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Client {
  id: string;
  clientNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  idNumber?: string;
  dateOfBirth?: string;
  occupation?: string;
  notes?: string;
  createdAt: Date;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  caseType: CaseType;
  subtype?: string;
  status: CaseStatus;
  priority: Priority;
  clientId: string;
  opposingParty?: string;
  opposingCounsel?: string;
  court?: string;
  caseReference?: string;
  dateOpened: Date;
  filingDate?: Date;
  hearingDate?: Date;
  dateClosed?: Date;
  retainerAmount?: number;
  description?: string;
  legalIssues?: string;
  desiredOutcome?: string;
  createdById: string;
  createdAt: Date;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
export type AppointmentType = 'CONSULTATION' | 'COURT_DATE' | 'CLIENT_MEETING' | 'DEPOSITION' | 'MEDIATION' | 'OTHER';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  clientId?: string;
  prospectName?: string;
  prospectPhone?: string;
  prospectEmail?: string;
  title: string;
  description?: string;
  appointmentType: AppointmentType;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  caseId?: string;
  createdById: string;
  createdAt: Date;
}
