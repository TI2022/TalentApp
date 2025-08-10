'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';

export default function Home() {
  const { 
    talents, 
    loading, 
    stats, 
    toggleTalent 
  } = useTalents();

  // ページネーション状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('checkPage_itemsPerPage');
      return saved ? parseInt(saved, 10) : 10;
    }
    return 10;
  });

  // チュートリアル表示状態
  const [showTutorial, setShowTutorial] = useState(false);

  // ページネーション用のデータ計算
  const paginatedTalents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return talents.slice(startIndex, endIndex);
  }, [talents, currentPage, itemsPerPage]);

  // 表示件数変更ハンドラー
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('checkPage_itemsPerPage', newItemsPerPage.toString());
    }
  };

  const totalPages = Math.ceil(talents.length / itemsPerPage);

  // チュートリアル初期化
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial && !loading) {
      setShowTutorial(true);
    }
  }, [loading]);

  // チュートリアルを閉じる
  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
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
      {/* チュートリアルモーダル */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-gray-200 ring-4 ring-blue-100">
            <div className="text-center">
              <div className="mb-4">
                <span className="text-4xl">🎯</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">使い方ガイド</h2>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                当てはまる項目にチェックを入れてください。<br />
                あなたの才能については<span className="font-semibold text-green-600">詳細画面</span>、<span className="font-semibold text-orange-600">集計画面</span>で確認できます。
              </p>
              <button
                onClick={closeTutorial}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                始める ✨
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">✨ 才能チェック</h1>
            <div className="flex space-x-2 sm:space-x-3">
              <Link 
                href="/details" 
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-3 sm:w-4 h-3 sm:h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">詳細画面</span>
                <span className="sm:hidden">詳細</span>
              </Link>
              <Link 
                href="/stats" 
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-3 sm:w-4 h-3 sm:h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">集計画面</span>
                <span className="sm:hidden">集計</span>
              </Link>
            </div>
          </div>
          
        </div>
      </header>

      {/* チェックリスト */}
      <main className="max-w-4xl mx-auto px-4 py-4 pb-24">
        {/* 表示件数選択 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-sm border border-blue-300 bg-blue-50 rounded-md px-3 py-1.5 text-blue-700 font-semibold">
              👇️ 当てはまる項目をチェック
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">表示件数</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1000}>1000件</option>
              <option value={200}>200件</option>
              <option value={10}>10件</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          {paginatedTalents.map((talent) => (
            <div
              key={talent.id}
              className={`bg-white rounded-lg border transition-all duration-200 ${
                talent.checked 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <label 
                className="flex items-center p-3 cursor-pointer"
                htmlFor={`talent-${talent.id}`}
              >
                {/* チェックボックス */}
                <div className="flex-shrink-0 mr-3">
                  <input
                    id={`talent-${talent.id}`}
                    type="checkbox"
                    checked={talent.checked}
                    onChange={() => toggleTalent(talent.id)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>

                {/* 短所テキスト */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    talent.checked 
                      ? 'text-green-800 font-medium' 
                      : 'text-gray-700'
                  }`}>
                    {talent.shortcoming}
                  </p>
                </div>

                {/* 番号表示 */}
                <div className="flex-shrink-0 ml-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    talent.checked 
                      ? 'bg-green-200 text-green-700' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    #{talent.id}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </main>

      {/* 固定ページネーション */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="w-full px-4 py-3">
            <div className="flex items-center space-x-3">
              {/* 前のページ */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                前へ
              </button>
              
              {/* ページ番号 (スクロール可能) */}
              <div className="flex-1 min-w-0">
                <div 
                  className="flex space-x-2 overflow-x-auto scrollbar-hide pb-1" 
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex-shrink-0 min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 次のページ */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
