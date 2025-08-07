'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function StatsPage() {
  const { talents, loading, stats } = useTalents();

  // 最近発見した才能のページネーション状態
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
  const [recentItemsPerPage, setRecentItemsPerPage] = useState(5);

  // 詳細統計の計算
  const detailedStats = useMemo(() => {
    if (!talents.length) return null;

    const checkedTalents = talents.filter(t => t.checked);
    const uncheckedTalents = talents.filter(t => !t.checked);
    
    // 進捗率の計算
    const completionRate = Math.round((checkedTalents.length / talents.length) * 100);
    
    // 最近の活動（仮想的な実装 - 実際にはタイムスタンプが必要）
    const recentActivity = checkedTalents.slice(-20); // より多くの項目を取得
    
    return {
      total: talents.length,
      checked: checkedTalents.length,
      unchecked: uncheckedTalents.length,
      completionRate,
      recentActivity,
      checkedTalents,
      uncheckedTalents
    };
  }, [talents]);

  // 最近発見した才能のページネーション計算
  const paginatedRecentActivity = useMemo(() => {
    if (!detailedStats?.recentActivity) return [];
    const startIndex = (recentCurrentPage - 1) * recentItemsPerPage;
    const endIndex = startIndex + recentItemsPerPage;
    return detailedStats.recentActivity.slice(startIndex, endIndex);
  }, [detailedStats?.recentActivity, recentCurrentPage, recentItemsPerPage]);

  const recentTotalPages = Math.ceil((detailedStats?.recentActivity?.length || 0) / recentItemsPerPage);

  // 最近発見した才能の表示件数変更ハンドラー
  const handleRecentItemsPerPageChange = (newItemsPerPage: number) => {
    setRecentItemsPerPage(newItemsPerPage);
    setRecentCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!detailedStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">集計</h1>
            <div className="flex space-x-2">
              <Link 
                href="/" 
                className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium rounded-md transition-colors"
              >
                チェック画面
              </Link>
              <Link 
                href="/details" 
                className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-blue-200 text-sm font-medium rounded-md transition-colors"
              >
                詳細画面
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 概要統計 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 総数 */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">総項目数</p>
            <div className="flex items-center">
              <div>
                <p className="text-xl font-bold text-gray-900">{detailedStats.total}</p>
              </div>
            </div>
          </div>

          {/* チェック済み */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">チェック済</p>
            <div className="flex items-center">
              <div>
                <p className="text-xl font-bold text-green-600">{detailedStats.checked}</p>
              </div>
            </div>
          </div>

          {/* 未チェック */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">未チェック</p>
            <div className="flex items-center">

              <p className="text-xl font-bold text-gray-600">{detailedStats.unchecked}</p>

            </div>
          </div>
        </div>


        {/* 最近チェックした項目 */}
        {detailedStats.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最近発見した才能</h2>
              {/* 表示件数選択 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">表示件数:</span>
                <select
                  value={recentItemsPerPage}
                  onChange={(e) => handleRecentItemsPerPageChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3件</option>
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={20}>20件</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {paginatedRecentActivity.map((talent) => (
                <div key={talent.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800">{talent.shortcoming}</p>
                    <p className="text-sm text-green-600 mt-1">才能: {talent.talent}</p>
                    <p className="text-sm text-green-600">強み: {talent.strength}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      #{talent.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            {recentTotalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => setRecentCurrentPage(Math.max(1, recentCurrentPage - 1))}
                  disabled={recentCurrentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: recentTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setRecentCurrentPage(page)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        recentCurrentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setRecentCurrentPage(Math.min(recentTotalPages, recentCurrentPage + 1))}
                  disabled={recentCurrentPage === recentTotalPages}
                  className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
