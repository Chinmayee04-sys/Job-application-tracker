export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "rejected"
  | "offer";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  jobUrl: string;
  status: ApplicationStatus;
  notes: string;
  interviewDate: string | null;
  isFavorite: boolean;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
}

export type SortField = "date" | "company" | "status" | "salary";
export type SortOrder = "asc" | "desc";

export interface ApplicationFilter {
  status: ApplicationStatus | "all";
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Omit<User, "password"> | null;
}

export interface Statistics {
  total: number;
  applied: number;
  interview: number;
  rejected: number;
  offer: number;
}

export interface JobOpportunity {
  jobId: number;
  employerName: string;
  locationName: string;
  minimumSalary: number;
  maximumSalary: number;
  currency: string;
  jobTitle: string;
  jobUrl: string;
  jobDescription: string;
  datePosted: string;
  expirationDate: string | null;
  jobType: string;
  applicationCount: number;
}
