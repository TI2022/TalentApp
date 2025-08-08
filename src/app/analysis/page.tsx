'use client';

import { useTalents } from '@/contexts/TalentContext';
import { analyzeTalents, analyzeWithAI } from '@/utils/talentAnalysis';
import Link from 'next/link';
import { useMemo, useState, useCallback } from 'react';
import { TalentAnalysisResult } from '@/types/talent';

export default function AnalysisPage() {
  const { talents, loading } = useTalents();
  
  // キーワードセクションの展開状態管理
  const [expandedSections, setExpandedSections] = useState({
    talents: false,
    strengths: false,
    weaknesses: false
  });

  // AI分析の状態管理
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TalentAnalysisResult | null>(null);

  // 基本分析結果
  const baseAnalysisResult: TalentAnalysisResult | null = useMemo(() => {
    const checkedTalents = talents.filter(t => t.checked);
    if (checkedTalents.length === 0) return null;
    return analyzeTalents(checkedTalents);
  }, [talents]);

  // 初期分析結果の設定
  useMemo(() => {
    if (baseAnalysisResult && !analysisResult) {
      setAnalysisResult(baseAnalysisResult);
    }
  }, [baseAnalysisResult, analysisResult]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // AI分析を実行する関数
  const performAIAnalysis = useCallback(async () => {
    const checkedTalents = talents.filter(t => t.checked);
    if (checkedTalents.length === 0) return;

    setIsAIAnalyzing(true);
    try {
      const result = await analyzeWithAI(checkedTalents);
      setAnalysisResult(result);
    } catch (error) {
      console.error('AI分析エラー:', error);
      // エラー時は基本分析結果を保持
    } finally {
      setIsAIAnalyzing(false);
    }
  }, [talents]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">🧠 AI分析</h1>
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
        
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="mb-4 text-6xl">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">分析するデータがありません</h2>
            <p className="text-gray-500 mb-6">才能をチェックしてから分析を行ってください</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              チェック画面へ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">🧠 AI分析</h1>
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
          <div className="text-xs text-gray-500">
            分析対象: {analysisResult.totalAnalyzed}件の才能 | 分析日時: {analysisResult.analysisDate.toLocaleString('ja-JP')}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* AI分析ボタン */}
        <div className="text-center">
          <button
            onClick={performAIAnalysis}
            disabled={isAIAnalyzing}
            className={`px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto ${
              isAIAnalyzing 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isAIAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>AI分析中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>🤖 AI分析を実行</span>
              </>
            )}
          </button>
          {!analysisResult?.aiAnalysis && (
            <p className="text-sm text-gray-500 mt-2">
              OpenAI GPT-3.5を使用した高度な分析を実行できます（無料クレジット利用可能）
            </p>
          )}
        </div>

        {/* AI分析結果 */}
        {analysisResult?.aiAnalysis && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 shadow-sm border-2 border-purple-200">
            <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI分析結果
            </h2>
            
            {/* AI分析サマリー */}
            <div className="mb-6 bg-white rounded-lg p-4">
              <h3 className="text-md font-semibold text-purple-700 mb-2">🧠 AI総合分析</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysisResult.aiAnalysis.summary}
              </p>
            </div>

            {/* AI感情分析 */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-purple-700 mb-2">💭 感情傾向</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">ポジティブ度</span>
                      <span className="text-sm font-semibold">
                        {((analysisResult.aiAnalysis.sentiment.overall + 1) * 50).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full"
                        style={{ 
                          width: `${Math.max(0, (analysisResult.aiAnalysis.sentiment.overall + 1) * 50)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {analysisResult.aiAnalysis.sentiment.overall > 0.1 ? '😊' : 
                     analysisResult.aiAnalysis.sentiment.overall < -0.1 ? '😔' : '😐'}
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  {analysisResult.aiAnalysis.sentiment.description}
                </p>
              </div>
            </div>

            {/* AIキーワード */}
            {analysisResult.aiAnalysis.keywords.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-purple-700 mb-2">🔑 重要キーワード（AI抽出）</h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.aiAnalysis.keywords.slice(0, 8).map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"
                      >
                        {keyword.word} 
                        <span className="text-purple-600">({(keyword.importance * 100).toFixed(0)}%)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* AI洞察 */}
            {analysisResult.aiAnalysis.insights.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-purple-700 mb-2">✨ AI洞察</h3>
                <div className="space-y-3">
                  {analysisResult.aiAnalysis.insights.map((insight, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-purple-300">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {insight.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          信頼度: {(insight.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{insight.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI推奨アクション */}
            {analysisResult.aiAnalysis.aiRecommendations.length > 0 && (
              <div>
                <h3 className="text-md font-semibold text-purple-700 mb-3">AI推奨アクション</h3>
                <div className="space-y-3">
                  {analysisResult.aiAnalysis.aiRecommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-purple-900">{rec.title}</h4>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 行動提案 */}
        {analysisResult.recommendations.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              おすすめアクション
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-2 ${
                  rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                  rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority === 'high' ? '優先度高' : rec.priority === 'medium' ? '優先度中' : '優先度低'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {rec.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* パーソナリティプロファイル */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            パーソナリティプロファイル
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(analysisResult.personalityProfile).map(([trait, score]) => {
              const labels = {
                openness: '開放性',
                conscientiousness: '勤勉性',
                extraversion: '外向性',
                agreeableness: '協調性',
                neuroticism: '神経症傾向'
              };
              
              return (
                <div key={trait} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{labels[trait as keyof typeof labels]}</span>
                    <span className="text-sm text-gray-600">{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* カテゴリスコア */}
        {analysisResult.categoryScores.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              才能カテゴリ分析
            </h2>
            <div className="space-y-4">
              {analysisResult.categoryScores.slice(0, 6).map((category, index) => (
                <div key={category.category} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700 truncate">
                    {category.category}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-full bg-gray-200 rounded-full h-3 mr-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                            index === 2 ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                          style={{ width: `${Math.min(category.score, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 min-w-[3rem] text-right">
                        {category.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* キーワード分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 才能キーワード */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold text-blue-700 flex items-center gap-2">
                <span className="text-xl">💎</span>
                才能キーワード
              </h3>
              {analysisResult.keywordAnalysis.talents.length > 5 && (
                <button
                  onClick={() => toggleSection('talents')}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  title={expandedSections.talents ? '縮小' : '全て表示'}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedSections.talents ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {analysisResult.keywordAnalysis.talents
                .slice(0, expandedSections.talents ? analysisResult.keywordAnalysis.talents.length : 5)
                .map((keyword) => (
                <div key={keyword.word} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{keyword.word}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {keyword.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 強みキーワード */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold text-green-700 flex items-center gap-2">
                <span className="text-xl">💪</span>
                強みキーワード
              </h3>
              {analysisResult.keywordAnalysis.strengths.length > 5 && (
                <button
                  onClick={() => toggleSection('strengths')}
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  title={expandedSections.strengths ? '縮小' : '全て表示'}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedSections.strengths ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {analysisResult.keywordAnalysis.strengths
                .slice(0, expandedSections.strengths ? analysisResult.keywordAnalysis.strengths.length : 5)
                .map((keyword) => (
                <div key={keyword.word} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{keyword.word}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {keyword.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 課題キーワード */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold text-orange-700 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                課題キーワード
              </h3>
              {analysisResult.keywordAnalysis.weaknesses.length > 5 && (
                <button
                  onClick={() => toggleSection('weaknesses')}
                  className="p-1 text-orange-600 hover:text-orange-800 transition-colors"
                  title={expandedSections.weaknesses ? '縮小' : '全て表示'}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${expandedSections.weaknesses ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            <div className="space-y-2">
              {analysisResult.keywordAnalysis.weaknesses
                .slice(0, expandedSections.weaknesses ? analysisResult.keywordAnalysis.weaknesses.length : 5)
                .map((keyword) => (
                <div key={keyword.word} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{keyword.word}</span>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                    {keyword.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}