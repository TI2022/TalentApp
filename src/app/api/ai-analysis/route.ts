import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TalentItem, AIAnalysisResult, PersonalityProfile, ActionRecommendation, OpenAIKeyword, OpenAISentiment, OpenAIInsight } from '@/types/talent';

// OpenAI クライアントの初期化
let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY が設定されていません');
      return null;
    }
    
    try {
      openaiClient = new OpenAI({
        apiKey: apiKey,
      });
    } catch (error) {
      console.error('OpenAI クライアント初期化エラー:', error);
      return null;
    }
  }
  return openaiClient;
}

// 分析プロンプトを生成
function createAnalysisPrompt(talents: TalentItem[]): string {
  const talentTexts = talents.map((t, index) => 
    `${index + 1}. 短所: "${t.shortcoming}" → 才能: "${t.talent}" → 強み: "${t.strength}"`
  ).join('\n');

  return `
以下は、ある人の短所から発見された才能と強みのリストです。
この情報を分析して、JSON形式で回答してください。

才能データ:
${talentTexts}

以下の形式でJSONのみを返してください（他のテキストは含めないでください）:

{
  "keywords": [
    {"word": "キーワード", "importance": 0.8, "category": "カテゴリ"}
  ],
  "sentiment": {
    "overall": 0.7,
    "confidence": 0.9,
    "description": "全体的な感情傾向の説明"
  },
  "insights": [
    {"category": "性格特性", "insight": "具体的な洞察", "confidence": 0.8}
  ],
  "personalityProfile": {
    "openness": 65,
    "conscientiousness": 72,
    "extraversion": 45,
    "agreeableness": 68,
    "neuroticism": 35
  },
  "recommendations": [
    {
      "title": "具体的な提案タイトル",
      "description": "詳細な説明文",
      "category": "AI推奨",
      "priority": "high"
    }
  ],
  "summary": "この人の才能全体に関する総合的な分析サマリー（2-3行）"
}

分析のポイント:
- personalityProfileは30-70の範囲で数値化
- keywordsは重要度の高い順に最大10件
- recommendationsは実行可能で具体的な提案を最大5件
- insightsは深い洞察を3-5件
- 日本語で自然な表現を使用
`;
}

// OpenAI APIのレスポンスをパース
function parseOpenAIResponse(content: string): Partial<AIAnalysisResult> {
  try {
    // JSONのみを抽出（前後のテキストを除去）
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSONが見つかりませんでした');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // データ構造を正規化
    return {
      keywords: parsed.keywords || [],
      sentiment: parsed.sentiment || {
        overall: 0,
        confidence: 0,
        description: '分析できませんでした'
      },
      insights: parsed.insights || [],
      enhancedPersonalityProfile: parsed.personalityProfile || {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      },
      aiRecommendations: parsed.recommendations || [],
      summary: parsed.summary || 'AI分析を完了しました。'
    };
  } catch (error) {
    console.error('OpenAI レスポンス解析エラー:', error);
    return {
      keywords: [],
      sentiment: {
        overall: 0,
        confidence: 0,
        description: 'AI分析中にエラーが発生しました'
      },
      insights: [],
      enhancedPersonalityProfile: {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      },
      aiRecommendations: [],
      summary: 'AI分析中にエラーが発生しました。'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API が初期化できませんでした。OPENAI_API_KEY を設定してください。' },
        { status: 500 }
      );
    }

    const { talents }: { talents: TalentItem[] } = await request.json();
    
    if (!talents || talents.length === 0) {
      return NextResponse.json(
        { error: '分析する才能データがありません' },
        { status: 400 }
      );
    }

    // OpenAI APIに送信
    const prompt = createAnalysisPrompt(talents);
    console.log('OpenAI API 呼び出し中...');

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "あなたは才能分析の専門家です。与えられた情報から深い洞察を提供し、必ずJSON形式で回答してください。"
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('OpenAI APIから有効なレスポンスが得られませんでした');
    }

    console.log('OpenAI レスポンス受信:', aiResponse.substring(0, 200) + '...');

    // レスポンスを解析
    const analysisResult = parseOpenAIResponse(aiResponse);

    const aiAnalysisResult: AIAnalysisResult = {
      keywords: analysisResult.keywords || [],
      sentiment: analysisResult.sentiment || {
        overall: 0,
        confidence: 0,
        description: 'データ不足のため分析できませんでした'
      },
      insights: analysisResult.insights || [],
      enhancedPersonalityProfile: analysisResult.enhancedPersonalityProfile || {
        openness: 50,
        conscientiousness: 50,
        extraversion: 50,
        agreeableness: 50,
        neuroticism: 50
      },
      aiRecommendations: analysisResult.aiRecommendations || [],
      summary: analysisResult.summary || 'AI分析が完了しました。'
    };

    return NextResponse.json(aiAnalysisResult);

  } catch (error) {
    console.error('AI分析エラー:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API キーが無効です。設定を確認してください。' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'AI分析中にエラーが発生しました', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}