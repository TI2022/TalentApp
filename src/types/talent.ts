export interface TalentItem {
  id: number;
  shortcoming: string;
  talent: string;
  strength: string;
  checked: boolean;
  checkedAt?: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  showPriority: boolean;
  autoBackup: boolean;
}

export interface UserProfile {
  name?: string;
  createdAt: Date;
  lastActiveAt: Date;
  totalChecked: number;
  completionRate: number;
}

export interface FilterOptions {
  showChecked: boolean;
  showUnchecked: boolean;
  searchQuery?: string;
}
