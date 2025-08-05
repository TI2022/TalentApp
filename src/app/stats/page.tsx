'use client';

import { useTalents } from '@/contexts/TalentContext';
import Link from 'next/link';
import { useMemo } from 'react';

export default function StatsPage() {
  const { talents, loading, stats } = useTalents();

  // 詳細統計の計算
  const detailedStats = useMemo(() => {
    if (!talents.length) return null;

    const checkedTalents = talents.filter(t => t.checked);
    const uncheckedTalents = talents.filter(t => !t.checked);
    
    // 進捗率の計算
    const completionRate = Math.round((checkedTalents.length / talents.length) * 100);
    
    // 最近の活動（仮想的な実装 - 実際にはタイムスタンプが必要）
    const recentActivity = checkedTalents.slice(-5);
    
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
            <h1 className="text-xl font-bold text-gray-900">集計・統計</h1>
            <div className="flex space-x-3">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                チェック
              </Link>
              <Link 
                href="/details" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                詳細表示
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 概要統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 総数 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{detailedStats.total}</p>
                <p className="text-sm text-gray-500">総項目数</p>
              </div>
            </div>
          </div>

          {/* チェック済み */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{detailedStats.checked}</p>
                <p className="text-sm text-gray-500">チェック済み</p>
              </div>
            </div>
          </div>

          {/* 未チェック */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 mr-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{detailedStats.unchecked}</p>
                <p className="text-sm text-gray-500">未チェック</p>
              </div>
            </div>
          </div>
        </div>

        {/* 進捗率 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">進捗状況</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">完了率</span>
            <span className="text-sm font-medium text-gray-900">{detailedStats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${detailedStats.completionRate}%` }}
            ></div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium text-green-600">{detailedStats.checked}項目</p>
              <p className="text-gray-500">発見済みの才能</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-600">{detailedStats.unchecked}項目</p>
              <p className="text-gray-500">未発見の可能性</p>
            </div>
          </div>
        </div>

        {/* 最近チェックした項目 */}
        {detailedStats.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近発見した才能</h2>
            <div className="space-y-3">
              {detailedStats.recentActivity.map((talent) => (
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
          </div>
        )}

        {/* アクションボタン */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">次のアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              チェックを続ける
            </Link>
            <Link 
              href="/details"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              才能を詳しく見る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
