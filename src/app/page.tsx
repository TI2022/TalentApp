'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function Home() {
  const { 
    talents, 
    loading, 
    stats, 
    toggleTalent 
  } = useTalents();

  // ページネーション状態
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  };

  const totalPages = Math.ceil(talents.length / itemsPerPage);

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
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">才能チェック</h1>
            <div className="flex space-x-2">
              <Link 
                href="/details" 
                className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-md transition-colors"
              >
                詳細画面
              </Link>
              <Link 
                href="/stats" 
                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium rounded-md transition-colors"
              >
                集計画面
              </Link>
            </div>
          </div>
          
        </div>
      </header>

      {/* チェックリスト */}
      <main className="max-w-4xl mx-auto px-4 py-4 pb-24">
        {/* 表示件数選択 */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">表示件数:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10件</option>
              <option value={20}>20件</option>
              <option value={50}>50件</option>
              <option value={100}>100件</option>
              <option value={200}>200件</option>
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
