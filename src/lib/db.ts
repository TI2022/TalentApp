import Dexie, { Table } from 'dexie';
import { TalentItem, AppSettings, UserProfile } from '@/types/talent';
import { initialTalents } from '@/data/initialTalents';

export class TalentDatabase extends Dexie {
  talents!: Table<TalentItem>;
  settings!: Table<AppSettings & { key: string }>;
  profile!: Table<UserProfile & { id: string }>;

  constructor() {
    super('TalentAppDB');
    this.version(1).stores({
      talents: '++id, category, checked, priority, checkedAt',
      settings: 'key',
      profile: 'id'
    });
  }
}

export const db = new TalentDatabase();

// 初期データの投入
export const initializeDatabase = async () => {
  const count = await db.talents.count();
  if (count === 0) {
    await db.talents.bulkAdd(initialTalents);
    
    // デフォルト設定
    await db.settings.put({
      key: 'app',
      theme: 'auto',
      language: 'ja',
      showPriority: true,
      autoBackup: false
    });

    // ユーザープロファイル
    await db.profile.put({
      id: 'user',
      createdAt: new Date(),
      lastActiveAt: new Date(),
      totalChecked: 0,
      completionRate: 0
    });
  }
};

// データ操作関数
export const talentService = {
  async getAllTalents(): Promise<TalentItem[]> {
    return await db.talents.orderBy('id').toArray();
  },

  async updateTalent(id: number, updates: Partial<TalentItem>): Promise<void> {
    await db.talents.update(id, updates);
  },

  async toggleTalent(id: number): Promise<void> {
    const talent = await db.talents.get(id);
    if (talent) {
      await db.talents.update(id, {
        checked: !talent.checked,
        checkedAt: !talent.checked ? new Date() : undefined
      });
    }
  },

  async getFilteredTalents(filters: {
    showChecked?: boolean;
    showUnchecked?: boolean;
    category?: string;
    priority?: number;
    searchQuery?: string;
  }): Promise<TalentItem[]> {
    let query = db.talents.orderBy('id');

    const results = await query.toArray();
    
    return results.filter(talent => {
      if (filters.showChecked === false && talent.checked) return false;
      if (filters.showUnchecked === false && !talent.checked) return false;
      if (filters.category && talent.category !== filters.category) return false;
      if (filters.priority && talent.priority !== filters.priority) return false;
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
  },

  async getStats(): Promise<{
    total: number;
    checked: number;
    completionRate: number;
    byCategory: Record<string, { total: number; checked: number }>;
  }> {
    const talents = await db.talents.toArray();
    const total = talents.length;
    const checked = talents.filter(t => t.checked).length;
    
    const byCategory: Record<string, { total: number; checked: number }> = {};
    talents.forEach(talent => {
      if (!byCategory[talent.category]) {
        byCategory[talent.category] = { total: 0, checked: 0 };
      }
      byCategory[talent.category].total++;
      if (talent.checked) {
        byCategory[talent.category].checked++;
      }
    });

    return {
      total,
      checked,
      completionRate: total > 0 ? Math.round((checked / total) * 100) : 0,
      byCategory
    };
  }
};
