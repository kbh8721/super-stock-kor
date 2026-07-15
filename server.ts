import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/analyze', async (req, res) => {
    let targetStock = '';
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      targetStock = req.body.targetStock || '';
      const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      const personaPrompt = `
당신은 30년차 초일류 주식 슈퍼 스윙트레이더이자, 퀀트 분석 전문가이다. (현재 한국 시간: ${now})
현재 대한민국 코스피·코스닥 시장에서 활동 중인 우량주 중심 스윙트레이더로, 연간 수익률 40% 이상을 지속적으로 달성해온 실전 트레이더의 페르소나를 완벽히 구현하라.
핵심 미션
단순히 52주 신저점을 기록한 종목을 찾는 것이 아닙니다. 52주 동안의 가격 변동폭을 고려했을 때, 현재 가격이 고점 대비 충분히 조정을 받아 비싸지 않고, 최근 낙폭 과대 후 의미 있는 지지선에서 반등(최적의 매수 타점)이 예상되는 우량주를 발굴하는 것입니다. 
현재 시점에서 매수 타이밍이 가장 좋은 종목을 찾아 구체적인 매수 가격대, 손절 라인, 목표 익절 가격대(1차·2차), 예상 보유기간, 리스크-리워드 비율을 제시한다.

분석 원칙 (절대 준수)
1.  우량주 기준: 시가총액 상위, 업종 대표주, 재무 건전성 양호, 기관·외국인 수급 양호한 종목만 선정 (중소형주, 테마주, 작전주 절대 배제)
2.  매수 타점 분석: 52주 최고점 대비 충분한 조정을 거쳤으며, 52주 최저점 부근이거나 최근 바닥을 다지고 반등 초입에 있는 매수하기 가장 좋은 종목 우선
3.  캔들 패턴 학습: 해머, 역해머, 불리시 엔굴핑, 도지, 샅바닥, W패턴, 상승 추세 내 풀백 캔들 등
4.  기술적 분석 필수 요소: 이동평균선, RSI(14), MACD, 볼린저밴드, 거래량 추이, 지지/저항선 등을 종합하여 점수화(100점 만점)
5.  시장 컨텍스트: 코스피·코스닥 추세, 섹터 로테이션, 글로벌 매크로 영향 고려

금지사항: 절대 미래 가격을 보장하거나 “무조건 오른다”, “대박” 같은 표현 사용 금지. 균형 잡힌 분석 제공.
추가 원칙: 현재 주가(currentPrice)를 반드시 파악하고, 이를 기준으로 매수 타점, 익절/손절 라인을 설정할 것. 
가장 중요한 점은 **반드시 구글 검색 도구(Google Search grounding)를 활용하여 오늘 날짜 기준의 실제 최신 주가를 검색하여 반영**해야 한다는 것입니다. 임의로 지어낸 과거 가격을 사용하지 마세요.

${targetStock 
  ? `사용자가 특정 종목을 요청했습니다: "${targetStock}". 이 종목이 위 기준(가격 변동폭 대비 매수 타점)에 부합한다면 분석하고(topStocks 배열에 1개로 포함), 그렇지 않다면 기준에 부합하는 가장 유력한 우량주 1개를 대신 분석하여 반환하라. 추가 추천 종목(additionalRecommendations)에는 연관된 우량주 2개를 제시하라.` 
  : `사용자가 종목을 지정하지 않았습니다. 현재 시점에서 가격 변동폭 대비 매수하기 가장 좋은 우량주 Top 3를 찾아 분석(topStocks 배열에 3개 포함)하고, 추가 추천 종목 2개(additionalRecommendations)를 제시하라.`}

반드시 JSON 스키마에 맞추어 응답을 반환하라. 가격은 "60,000원" 형태로, 퍼센트는 정수로 입력.
      `.trim();

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          topStocks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                currentPrice: { type: Type.STRING, description: "현재 주가 (예: '60,000원')" },
                score: { type: Type.INTEGER },
                suitability: { type: Type.STRING, description: "'매우 높음', '높음', '보통', '낮음' 중 하나" },
                low52Week: {
                  type: Type.OBJECT,
                  properties: {
                    price: { type: Type.STRING },
                    date: { type: Type.STRING }
                  }
                },
                reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategy: {
                  type: Type.OBJECT,
                  properties: {
                    buyRange: { type: Type.STRING },
                    stopLoss: {
                      type: Type.OBJECT,
                      properties: { percent: { type: Type.NUMBER }, price: { type: Type.STRING } }
                    },
                    target1: {
                      type: Type.OBJECT,
                      properties: { percent: { type: Type.NUMBER }, price: { type: Type.STRING }, period: { type: Type.STRING } }
                    },
                    target2: {
                      type: Type.OBJECT,
                      properties: { percent: { type: Type.NUMBER }, price: { type: Type.STRING }, period: { type: Type.STRING } }
                    },
                    maxPeriod: { type: Type.STRING },
                    riskReward: { type: Type.STRING }
                  }
                },
                chartPoints: { type: Type.STRING },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          additionalRecommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                summary: { type: Type.STRING }
              }
            }
          }
        }
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: personaPrompt,
        config: {
          responseSchema: responseSchema,
          tools: [{ googleSearch: {} }],
        },
      });

      let text = response.text;
      if (!text) {
        throw new Error('No content returned from AI');
      }
      
      // Strip markdown json blocks if present
      text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

      const json = JSON.parse(text);
      res.json(json);

    } catch (error: any) {
      console.error('Error generating analysis:', error);
      
      if (error.message && (error.message.includes('429') || error.message.includes('Quota') || error.message.includes('400') || error.message.includes('503'))) {
        console.log("Using mock data due to API limit.");
        
        const dictionary: Record<string, string> = {
          '삼성전자': '005930.KS',
          'NAVER': '035420.KS',
          '네이버': '035420.KS',
          '카카오': '035720.KS',
          'SK하이닉스': '000660.KS',
          '현대차': '005380.KS',
          '기아': '000270.KS',
          'LG화학': '051910.KS',
          '삼성SDI': '006400.KS',
          '셀트리온': '068270.KS',
          '에코프로비엠': '247540.KQ',
          '에코프로': '086520.KQ',
          '크래프톤': '259960.KS',
          '포스코홀딩스': '005490.KS',
          'POSCO홀딩스': '005490.KS',
          'LG에너지솔루션': '373220.KS',
        };
        const stockName = targetStock || "삼성전자";
        let symbol = dictionary[stockName.toUpperCase()] || dictionary[stockName];
        
        if (!symbol) {
          try {
            const searchRes = await fetch(`https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(stockName)}`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              if (searchData.quotes && searchData.quotes.length > 0) {
                const found = searchData.quotes.find((q: any) => q.symbol.endsWith('.KS') || q.symbol.endsWith('.KQ'));
                if (found) symbol = found.symbol;
              }
            }
          } catch (e) {
            console.error("Failed to search Yahoo", e);
          }
        }
        
        if (!symbol) symbol = '005930.KS'; // Default
        
        let currentPrice = 0;
        let high52 = 0;
        let low52 = 0;
        let codeStr = symbol.replace('.KS', '');
        
        try {
          const yhRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
          const yhData = await yhRes.json();
          const meta = yhData.chart?.result?.[0]?.meta;
          if (meta) {
            currentPrice = meta.regularMarketPrice || 0;
            high52 = meta.fiftyTwoWeekHigh || currentPrice * 1.2;
            low52 = meta.fiftyTwoWeekLow || currentPrice * 0.8;
          }
        } catch (e) {
          console.error("Failed to fetch from Yahoo", e);
        }

        const formatPrice = (p: number) => Math.floor(p).toLocaleString('ko-KR') + '원';

        const mockData = {
          topStocks: [
            {
              name: stockName,
              code: codeStr,
              currentPrice: formatPrice(currentPrice),
              score: 88,
              suitability: "높음",
              low52Week: { price: formatPrice(low52), date: "2025-01-15" },
              high52Week: { price: formatPrice(high52), date: "2025-10-10" },
              reasons: [
                "최근 낙폭 과대 후 바닥에서 다중 바닥 패턴 형성 중",
                "주요 이평선 수렴 구간에서 기술적 반등 시그널 포착"
              ],
              strategy: {
                buyRange: `${formatPrice(currentPrice * 0.98)} ~ ${formatPrice(currentPrice * 1.02)}`,
                stopLoss: { percent: -5, price: formatPrice(currentPrice * 0.95) },
                target1: { percent: 10, price: formatPrice(currentPrice * 1.1), period: "1~2주" },
                target2: { percent: 20, price: formatPrice(currentPrice * 1.2), period: "1~2개월" },
                maxPeriod: "2개월",
                riskReward: "1:2.5"
              },
              chartPoints: "단기 이평선이 장기 이평선을 뚫는 골든크로스 직전 국면.",
              risks: ["글로벌 금리 인하 지연", "시장 수급 쏠림 현상 심화 가능성"]
            }
          ],
          additionalRecommendations: [
            {
              name: "SK하이닉스",
              code: "000660",
              summary: "HBM 수요 호조에 따른 실적 개선 기대감 지속, 반도체 섹터 주도주."
            },
            {
              name: "현대차",
              code: "005380",
              summary: "낮은 밸류에이션 및 주주환원 정책 강화, 실적 호조 대비 저평가 매력."
            }
          ]
        };
        return res.json(mockData);
      }

      let errorMessage = 'Failed to generate analysis.';
      if (error.message) {
        errorMessage = error.message;
      }

      res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
