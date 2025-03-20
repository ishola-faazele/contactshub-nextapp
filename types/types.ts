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

export interface UserActivity {
  action: string;
  contact_name: string;
  timestamp: string;
  action_type?: string
}

export interface CategoryDistribution {
  category: string;
  count: number;
}