export interface ContactType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  categories: string[] | [];
  createdAt: string;
  avatar?: string;
  favorite: boolean;
  status: string;
}

export enum ContactStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  BIN = "bin"
}

export interface PageConfig {
  title: string;
  description: string;
  statusFilter: string;
}