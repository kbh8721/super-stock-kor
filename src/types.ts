export interface StockAnalysis {
  name: string;
  code: string;
  currentPrice: string;
  score: number;
  suitability: '매우 높음' | '높음' | '보통' | '낮음';
  low52Week: {
    price: string;
    date: string;
  };
  reasons: string[];
  strategy: {
    buyRange: string;
    stopLoss: {
      percent: number;
      price: string;
    };
    target1: {
      percent: number;
      price: string;
      period: string;
    };
    target2: {
      percent: number;
      price: string;
      period: string;
    };
    maxPeriod: string;
    riskReward: string;
  };
  chartPoints: string;
  risks: string[];
}

export interface AdditionalRecommendation {
  name: string;
  code: string;
  summary: string;
}

export interface AnalysisResponse {
  topStocks: StockAnalysis[];
  additionalRecommendations: AdditionalRecommendation[];
}
