'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
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



  const handleFilterToggle = () => {
    if (filters.showChecked && filters.showUnchecked) {
      // 全表示 → チェック済みのみ
      setFilters({ showChecked: true, showUnchecked: false });
    } else {
      // チェック済みのみ → 全表示
      setFilters({ showChecked: true, showUnchecked: true });
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">あなたの才能</h1>
            <Link 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              チェックに戻る
            </Link>
          </div>
          




          {/* フィルターボタン */}
          <div className="flex">
            <button
              onClick={handleFilterToggle}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 active:scale-95 ${
                filters.showChecked && filters.showUnchecked
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
              }`}
            >
              {filters.showChecked && filters.showUnchecked ? (
                <><span>📋</span> すべて表示中</>
              ) : (
                <><span>✅</span> チェック済みのみ</>
              )}
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
            {filteredTalents.map((talent, index) => (
              <div
                key={`${talent.id}-${filters.showChecked}-${filters.showUnchecked}`}
                className={`talent-card ${talent.checked ? 'checked' : ''} animate-slide-in`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* ステータス表示 */}
                  <div className="flex-shrink-0 pt-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      talent.checked 
                        ? 'bg-green-100 border-green-500 text-green-600' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {talent.checked && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">

                    {/* 短所 */}
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          短所
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{talent.shortcoming}</p>
                    </div>

                    {/* 才能 */}
                    <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                          才能
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium leading-relaxed">{talent.talent}</p>
                    </div>

                    {/* 強み */}
                    <div className="mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          強み
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{talent.strength}</p>
                    </div>
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
