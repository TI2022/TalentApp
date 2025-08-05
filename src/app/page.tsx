'use client';

import { useTalents } from '@/contexts/TalentContext';
import { useState } from 'react';

export default function Home() {
  const { 
    filteredTalents, 
    loading, 
    stats, 
    filters, 
    toggleTalent, 
    setFilters 
  } = useTalents();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ searchQuery: query });
  };

  const handleFilterToggle = (filterType: 'checked' | 'unchecked') => {
    if (filterType === 'checked') {
      setFilters({ 
        showChecked: !filters.showChecked,
        showUnchecked: filters.showUnchecked || !filters.showChecked 
      });
    } else {
      setFilters({ 
        showUnchecked: !filters.showUnchecked,
        showChecked: filters.showChecked || !filters.showUnchecked
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">才能発見アプリ</h1>
          
          {/* 統計情報 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">進捗状況</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">選択済み</p>
                <p className="text-xl font-semibold">{stats.checked} / {stats.total}</p>
              </div>
            </div>
            <div className="mt-3 bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* 検索バー */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="才能を検索..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* フィルターボタン */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFilterToggle('checked')}
              className={`filter-chip ${filters.showChecked ? 'active' : 'inactive'}`}
            >
              ✅ チェック済み
            </button>
            <button
              onClick={() => handleFilterToggle('unchecked')}
              className={`filter-chip ${filters.showUnchecked ? 'active' : 'inactive'}`}
            >
              ⭕ 未チェック
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">該当する才能が見つかりませんでした</p>
            <p className="text-gray-400 text-sm mt-2">検索条件やフィルターを変更してみてください</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTalents.map((talent) => (
              <div
                key={talent.id}
                className={`talent-card ${talent.checked ? 'checked' : ''} touch-manipulation`}
                onClick={() => toggleTalent(talent.id)}
              >
                <div className="flex items-start gap-4">
                  {/* チェックボックス */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={talent.checked}
                      onChange={() => toggleTalent(talent.id)}
                      className="checkbox-custom"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">
                    {/* カテゴリと優先度 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {talent.category}
                      </span>
                      {talent.priority && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          talent.priority === 1 ? 'bg-red-100 text-red-800' :
                          talent.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          優先度 {talent.priority}
                        </span>
                      )}
                    </div>

                    {/* 短所 */}
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">短所・課題</p>
                      <p className="text-gray-800">{talent.shortcoming}</p>
                    </div>

                    {/* 才能 */}
                    <div className="mb-2">
                      <p className="text-sm text-primary-600 mb-1 font-medium">才能</p>
                      <p className="text-gray-900 font-medium">{talent.talent}</p>
                    </div>

                    {/* 強み */}
                    <div className="mb-3">
                      <p className="text-sm text-green-600 mb-1 font-medium">強み</p>
                      <p className="text-gray-800">{talent.strength}</p>
                    </div>

                    {/* タグ */}
                    {talent.tags && talent.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {talent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* チェック日時 */}
                    {talent.checked && talent.checkedAt && (
                      <div className="mt-2 text-xs text-green-600">
                        ✅ {new Date(talent.checkedAt).toLocaleDateString('ja-JP')} にチェック済み
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>才能発見アプリ - あなたの可能性を見つけよう</p>
        </div>
      </footer>
    </div>
  );
}
