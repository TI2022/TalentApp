'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function StatsPage() {
  const { talents, loading, stats } = useTalents();

  // 最近発見した才能のページネーション状態
  const [recentCurrentPage, setRecentCurrentPage] = useState(1);
  const [recentItemsPerPage, setRecentItemsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('statsPage_itemsPerPage');
      return saved ? parseInt(saved, 10) : 5;
    }
    return 5;
  });

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('statsPage_itemsPerPage', newItemsPerPage.toString());
    }
  };

  // 才能をCSVエクスポートする関数
  const exportTalents = () => {
    if (!detailedStats) return;
    
    const checkedTalents = detailedStats.checkedTalents;
    const csvHeader = '番号,才能,強み,短所,生成日時\n';
    const csvContent = checkedTalents.map((talent, index) => 
      `${index + 1},"${talent.talent}","${talent.strength}","${talent.shortcoming}","${new Date().toLocaleString('ja-JP')}"`
    ).join('\n');
    
    const content = csvHeader + csvContent;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `発見した才能_${new Date().toLocaleDateString('ja-JP')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">⚡ 集計</h1>
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
                href="/details" 
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 text-xs sm:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg className="w-3 sm:w-4 h-3 sm:h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">詳細画面</span>
                <span className="sm:hidden">詳細</span>
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
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">総項目数</p>
            <p className="text-xl font-bold text-gray-900">{detailedStats.total}</p>
          </div>

          {/* チェック済み */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">チェック済</p>
            <p className="text-xl font-bold text-green-600">{detailedStats.checked}</p>
          </div>

          {/* 未チェック */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">未チェック</p>
            <p className="text-xl font-bold text-gray-600">{detailedStats.unchecked}</p>
          </div>
        </div>


        {/* エクスポートボタン */}
        {detailedStats.checkedTalents.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={exportTalents}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3 mx-auto border-2 border-orange-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-lg font-bold">才能をCSVエクスポート</span>
            </button>
          </div>
        )}

        {/* 最近チェックした項目 */}
        {detailedStats.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">発見した才能</h2>
              {/* 表示件数選択 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">表示件数:</span>
                <select
                  value={recentItemsPerPage}
                  onChange={(e) => handleRecentItemsPerPageChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1000}>1000件</option>
                  <option value={200}>200件</option>
                  <option value={10}>10件</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {paginatedRecentActivity.map((talent) => (
                <div key={talent.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-600 mt-1">才能: {talent.talent}</p>
                    <p className="text-sm text-red-600">強み: {talent.strength}</p>
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
