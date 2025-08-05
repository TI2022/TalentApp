'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { TalentItem, FilterOptions } from '@/types/talent';
import { talentService, initializeDatabase } from '@/lib/db';

interface TalentContextType {
  talents: TalentItem[];
  filteredTalents: TalentItem[];
  loading: boolean;
  stats: {
    total: number;
    checked: number;
    completionRate: number;
  };
  filters: FilterOptions;
  toggleTalent: (id: number) => Promise<void>;
  setFilters: (filters: Partial<FilterOptions>) => void;
  refreshTalents: () => Promise<void>;
}

const TalentContext = createContext<TalentContextType | null>(null);

export function TalentProvider({ children }: { children: ReactNode }) {
  const [talents, setTalents] = useState<TalentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState<FilterOptions>({
    showChecked: true,
    showUnchecked: true,
  });

  // 統計情報の計算
  const stats = React.useMemo(() => {
    const total = talents.length;
    const checked = talents.filter(t => t.checked).length;

    return {
      total,
      checked,
      completionRate: total > 0 ? Math.round((checked / total) * 100) : 0
    };
  }, [talents]);

  // フィルタリングされた才能リスト
  const filteredTalents = React.useMemo(() => {
    return talents.filter(talent => {
      if (!filters.showChecked && talent.checked) return false;
      if (!filters.showUnchecked && !talent.checked) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          talent.talent.toLowerCase().includes(query) ||
          talent.strength.toLowerCase().includes(query) ||
          talent.shortcoming.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [talents, filters]);

  // 才能データの読み込み
  const refreshTalents = useCallback(async () => {
    try {
      setLoading(true);
      const talentData = await talentService.getAllTalents();
      setTalents(talentData);
    } catch (error) {
      console.error('Failed to load talents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 才能のチェック状態を切り替え
  const toggleTalent = useCallback(async (id: number) => {
    try {
      await talentService.toggleTalent(id);
      setTalents(prev => prev.map(talent => 
        talent.id === id 
          ? { ...talent, checked: !talent.checked, checkedAt: !talent.checked ? new Date() : undefined }
          : talent
      ));
    } catch (error) {
      console.error('Failed to toggle talent:', error);
    }
  }, []);

  // フィルターの設定
  const setFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        await refreshTalents();
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setLoading(false);
      }
    };

    initialize();
  }, [refreshTalents]);

  const value: TalentContextType = {
    talents,
    filteredTalents,
    loading,
    stats,
    filters,
    toggleTalent,
    setFilters,
    refreshTalents,
  };

  return (
    <TalentContext.Provider value={value}>
      {children}
    </TalentContext.Provider>
  );
}

export function useTalents() {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error('useTalents must be used within TalentProvider');
  }
  return context;
}
