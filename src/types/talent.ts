export interface TalentItem {
  id: number;
  category: string;
  shortcoming: string;
  talent: string;
  strength: string;
  checked: boolean;
  checkedAt?: Date;
  priority?: 1 | 2 | 3;
  tags?: string[];
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
  category?: string;
  priority?: 1 | 2 | 3;
  searchQuery?: string;
}
