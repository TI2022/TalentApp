import { TalentItem, KeywordFrequency, CategoryScore, PersonalityProfile, ActionRecommendation, TalentAnalysisResult, AIAnalysisResult } from '@/types/talent';

// 日本語ストップワード（除外する一般的な単語）
const STOP_WORDS = new Set([
  'こと', 'もの', 'これ', 'それ', 'あれ', 'どれ', 'です', 'である', 'だった', 'する', 'した', 'される', 'できる', 'なる', 'いる', 'ある', 'ない', 'よい', 'いい', 'すぐ', 'とても', 'ちょっと', 'かなり', 'もう', 'まだ', 'ずっと', 'きっと', 'たぶん', 'けど', 'でも', 'だけど', 'しかし', 'そして', 'また', 'さらに', 'ただし', 'ところで', 'ところが', 'つまり', 'また', 'そこで', 'それで', 'それから', 'それに', 'その', 'この', 'あの', 'どの', 'という', 'として', 'について', 'に関して', 'において', 'にとって', 'によって', 'による', 'からの', 'への', 'での', 'との', 'での', 'まで', 'から', 'より', 'くらい', 'ほど', 'だけ', 'ばかり', 'すら', 'でも', 'でさえ', 'など', 'なども', 'とか', 'やら'
]);

// カテゴリ分類用のキーワード辞書
const CATEGORY_KEYWORDS = {
  '創造性・アイデア': ['創造', 'アイデア', '発想', 'ひらめき', '独創', '想像', 'オリジナル', '新しい', '革新', 'クリエイティブ', '企画', 'デザイン', '芸術', 'イノベーション'],
  'コミュニケーション': ['話す', '聞く', '伝える', '説明', '相談', '交渉', 'プレゼン', '対話', '会話', '議論', 'チーム', '協調', '調整', '人間関係'],
  'リーダーシップ': ['リーダー', '指導', '統率', 'マネジメント', '管理', '責任', '決断', '判断', '采配', 'まとめる', '引っ張る', '牽引'],
  '分析・論理': ['分析', '論理', '思考', '推理', '検証', '調査', '研究', 'データ', '統計', '数字', '計算', '理論', '仮説', '証明'],
  '技術・専門': ['技術', 'プログラム', 'システム', '開発', '設計', 'IT', 'コンピュータ', '専門', '知識', 'スキル', 'ノウハウ', '技能'],
  '学習・成長': ['学習', '勉強', '成長', '向上', '習得', '吸収', '理解', '記憶', '知る', '覚える', '身につける', '伸ばす'],
  '集中・継続': ['集中', '継続', '持続', '忍耐', '粘り強い', '最後まで', '諦めない', '根気', '努力', '頑張る', '続ける'],
  '柔軟・適応': ['柔軟', '適応', '対応', '調整', '変化', '順応', '臨機応変', 'バランス', '切り替え', '多様', '幅広い']
};

// パーソナリティ推定用のキーワード
const PERSONALITY_KEYWORDS = {
  openness: {
    positive: ['創造', 'アイデア', '新しい', '革新', '想像', 'オリジナル', '芸術', '発想', 'ひらめき', '好奇心', '探求'],
    negative: ['保守', '慣例', '従来', 'ルーチン', '決まった', '固定']
  },
  conscientiousness: {
    positive: ['責任', '計画', '管理', '整理', '準備', '段取り', '継続', '努力', '真面目', '丁寧', '確実'],
    negative: ['適当', 'いい加減', 'ずさん', '無計画', '怠ける']
  },
  extraversion: {
    positive: ['積極', '社交', '活動的', '外向', 'リーダー', '話す', 'エネルギッシュ', '明るい', '人前'],
    negative: ['内向', '消極', 'おとなしい', '控えめ', '一人', '静か']
  },
  agreeableness: {
    positive: ['協調', '協力', '思いやり', '親切', '優しい', 'サポート', '助ける', '配慮', '気遣い'],
    negative: ['競争', '対立', '自己中心', '批判的', '厳しい']
  },
  neuroticism: {
    positive: ['心配', '不安', 'ストレス', '緊張', '神経質', '敏感'],
    negative: ['冷静', '安定', 'リラックス', '落ち着き', '平常心']
  }
};

// テキストから単語を抽出する（簡易形態素解析の代替）
function extractWords(text: string): string[] {
  // カタカナ、ひらがな、漢字の単語を抽出
  const words = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g) || [];
  return words
    .filter(word => word.length >= 2 && !STOP_WORDS.has(word))
    .map(word => word.toLowerCase());
}

// キーワードの頻度分析
function analyzeKeywordFrequency(texts: string[]): KeywordFrequency[] {
  const frequency: { [key: string]: number } = {};
  
  texts.forEach(text => {
    const words = extractWords(text);
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
  });

  return Object.entries(frequency)
    .map(([word, freq]) => ({ word, frequency: freq }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 20); // 上位20件
}

// カテゴリスコア計算
function calculateCategoryScores(allTexts: string[]): CategoryScore[] {
  const scores: CategoryScore[] = [];
  
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    let score = 0;
    const matchedKeywords: string[] = [];
    
    allTexts.forEach(text => {
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 1;
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
          }
        }
      });
    });
    
    if (score > 0) {
      scores.push({
        category,
        score: Math.round((score / allTexts.length) * 100),
        keywords: matchedKeywords
      });
    }
  });
  
  return scores.sort((a, b) => b.score - a.score);
}

// パーソナリティプロファイル計算
function calculatePersonalityProfile(allTexts: string[]): PersonalityProfile {
  const textContent = allTexts.join(' ');
  const profile: PersonalityProfile = {
    openness: 50,
    conscientiousness: 50,
    extraversion: 50,
    agreeableness: 50,
    neuroticism: 50
  };

  Object.entries(PERSONALITY_KEYWORDS).forEach(([trait, keywords]) => {
    let positiveScore = 0;
    let negativeScore = 0;
    
    keywords.positive.forEach(keyword => {
      if (textContent.includes(keyword)) positiveScore++;
    });
    
    keywords.negative.forEach(keyword => {
      if (textContent.includes(keyword)) negativeScore++;
    });
    
    // スコア調整（30-70の範囲で調整）
    const adjustment = (positiveScore - negativeScore) * 5;
    profile[trait as keyof PersonalityProfile] = Math.max(30, Math.min(70, 50 + adjustment));
  });

  return profile;
}

// 行動提案生成
function generateRecommendations(
  categoryScores: CategoryScore[],
  personalityProfile: PersonalityProfile,
  checkedTalents: TalentItem[]
): ActionRecommendation[] {
  const recommendations: ActionRecommendation[] = [];
  
  // 強みに基づく提案
  const topCategories = categoryScores.slice(0, 3);
  topCategories.forEach(category => {
    switch (category.category) {
      case '創造性・アイデア':
        recommendations.push({
          title: 'クリエイティブプロジェクトに参加',
          description: 'デザインや企画の仕事で創造性を活かしましょう。新しいアイデアを形にできる環境を探してください。',
          category: 'キャリア',
          priority: 'high'
        });
        break;
      case 'コミュニケーション':
        recommendations.push({
          title: 'チームリーダーやファシリテーター役を担う',
          description: 'コミュニケーション能力を活かして、チームの橋渡し役を務めてみてください。',
          category: 'スキル活用',
          priority: 'high'
        });
        break;
      case '分析・論理':
        recommendations.push({
          title: 'データ分析や戦略立案の役割を担う',
          description: '論理的思考力を活かして、問題解決や意思決定をサポートする役割が適しています。',
          category: 'キャリア',
          priority: 'high'
        });
        break;
    }
  });
  
  // パーソナリティに基づく提案
  if (personalityProfile.openness > 60) {
    recommendations.push({
      title: '新しい学習分野に挑戦',
      description: '好奇心を活かして、未経験の分野や技術を学んでみてください。',
      category: '成長',
      priority: 'medium'
    });
  }
  
  if (personalityProfile.conscientiousness > 60) {
    recommendations.push({
      title: 'プロジェクト管理や品質管理の役割',
      description: '責任感と継続力を活かして、プロジェクトの進行管理を担当してみてください。',
      category: 'キャリア',
      priority: 'medium'
    });
  }
  
  // 成長ポイントの提案
  const weakCategories = categoryScores.filter(c => c.score < 30);
  if (weakCategories.length > 0) {
    recommendations.push({
      title: `${weakCategories[0].category}スキルの向上`,
      description: `この分野での経験を積むことで、さらなる成長が期待できます。`,
      category: '成長',
      priority: 'low'
    });
  }
  
  return recommendations.slice(0, 6); // 最大6件
}

// メイン分析関数
export function analyzeTalents(checkedTalents: TalentItem[]): TalentAnalysisResult {
  if (checkedTalents.length === 0) {
    return {
      keywordAnalysis: {
        talents: [],
        strengths: [],
        weaknesses: []
      },
      categoryScores: [],
      personalityProfile: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      },
      recommendations: [],
      totalAnalyzed: 0,
      analysisDate: new Date()
    };
  }

  // テキスト抽出
  const talents = checkedTalents.map(t => t.talent);
  const strengths = checkedTalents.map(t => t.strength);
  const weaknesses = checkedTalents.map(t => t.shortcoming);
  const allTexts = [...talents, ...strengths, ...weaknesses];

  // キーワード頻度分析
  const talentKeywords = analyzeKeywordFrequency(talents);
  const strengthKeywords = analyzeKeywordFrequency(strengths);
  const weaknessKeywords = analyzeKeywordFrequency(weaknesses);

  // カテゴリスコア計算
  const categoryScores = calculateCategoryScores(allTexts);

  // パーソナリティプロファイル計算
  const personalityProfile = calculatePersonalityProfile(allTexts);

  // 行動提案生成
  const recommendations = generateRecommendations(categoryScores, personalityProfile, checkedTalents);

  return {
    keywordAnalysis: {
      talents: talentKeywords,
      strengths: strengthKeywords,
      weaknesses: weaknessKeywords
    },
    categoryScores,
    personalityProfile,
    recommendations,
    totalAnalyzed: checkedTalents.length,
    analysisDate: new Date()
  };
}

// AI分析を取得する関数
export async function getAIAnalysis(checkedTalents: TalentItem[]): Promise<AIAnalysisResult | null> {
  try {
    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ talents: checkedTalents }),
    });

    if (!response.ok) {
      console.error('AI分析API エラー:', response.status, response.statusText);
      return null;
    }

    const aiAnalysis: AIAnalysisResult = await response.json();
    return aiAnalysis;
  } catch (error) {
    console.error('AI分析取得エラー:', error);
    return null;
  }
}

// 統合分析関数（既存の分析 + AI分析）
export async function analyzeWithAI(checkedTalents: TalentItem[]): Promise<TalentAnalysisResult> {
  // 既存のクライアントサイド分析
  const baseAnalysis = analyzeTalents(checkedTalents);
  
  try {
    // AI分析を並行して取得
    const aiAnalysis = await getAIAnalysis(checkedTalents);
    
    return {
      ...baseAnalysis,
      aiAnalysis: aiAnalysis || undefined
    };
  } catch (error) {
    console.error('AI分析統合エラー:', error);
    // AI分析が失敗しても基本分析は返す
    return baseAnalysis;
  }
}