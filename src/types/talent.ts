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

export interface KeywordFrequency {
  word: string;
  frequency: number;
  category?: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  keywords: string[];
}

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface ActionRecommendation {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OpenAIKeyword {
  word: string;
  importance: number;
  category: string;
}

export interface OpenAISentiment {
  overall: number; // -1 to 1
  confidence: number; // 0 to 1
  description: string;
}

export interface OpenAIInsight {
  category: string;
  insight: string;
  confidence: number;
}

export interface AIAnalysisResult {
  keywords: OpenAIKeyword[];
  sentiment: OpenAISentiment;
  insights: OpenAIInsight[];
  enhancedPersonalityProfile: PersonalityProfile;
  aiRecommendations: ActionRecommendation[];
  summary: string;
}

export interface TalentAnalysisResult {
  keywordAnalysis: {
    talents: KeywordFrequency[];
    strengths: KeywordFrequency[];
    weaknesses: KeywordFrequency[];
  };
  categoryScores: CategoryScore[];
  personalityProfile: PersonalityProfile;
  recommendations: ActionRecommendation[];
  totalAnalyzed: number;
  analysisDate: Date;
  aiAnalysis?: AIAnalysisResult;
}
