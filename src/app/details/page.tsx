'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';

export default function Home() {
  const { 
    talents, 
    loading, 
    stats, 
    filteredTalents, 
    filters, 
    setFilters 
  } = useTalents();

  // ページネーション状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('detailsPage_itemsPerPage');
      return saved ? parseInt(saved, 10) : 10;
    }
    return 10;
  });

  // ページネーション計算
  const paginatedTalents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTalents.slice(startIndex, endIndex);
  }, [filteredTalents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);

  // 初期状態をチェック済みのみに設定
  useEffect(() => {
    setFilters({ showChecked: true, showUnchecked: false });
  }, [setFilters]);

  const handleFilterToggle = () => {
    setCurrentPage(1); // フィルター変更時にページをリセット
    if (filters.showChecked && filters.showUnchecked) {
      // 全表示 → チェック済みのみ
      setFilters({ showChecked: true, showUnchecked: false });
    } else {
      // チェック済みのみ → 全表示
      setFilters({ showChecked: true, showUnchecked: true });
    }
  };

  // 表示件数変更ハンドラー
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('detailsPage_itemsPerPage', newItemsPerPage.toString());
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
            <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🔍 才能詳細</h1>
            <div className="flex space-x-2 sm:space-x-3">
              <Link 
                href="/" 
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-3 sm:w-4 h-3 sm:h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">チェック画面</span>
                <span className="sm:hidden">チェック</span>
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

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {filteredTalents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">該当する才能が見つかりませんでした</p>
            <p className="text-gray-400 text-sm mt-2">検索条件やフィルターを変更してみてください</p>
          </div>
        ) : (
          <>
            {/* フィルターと表示件数選択 */}
            <div className="flex justify-between items-center mb-4">
              {/* セグメントスイッチ */}
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={handleFilterToggle}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filters.showChecked && filters.showUnchecked
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  すべて表示
                </button>
                <button
                  onClick={handleFilterToggle}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    filters.showChecked && !filters.showUnchecked
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  チェック済
                </button>
              </div>
              
              {/* 表示件数選択 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">表示件数:</span>
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
            
            <div className="space-y-4">
              {paginatedTalents.map((talent, index) => (
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
          

          </>
        )}
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
