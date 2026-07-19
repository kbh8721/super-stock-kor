/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, BarChart2, Clock } from 'lucide-react';
import { StockAnalysis, AnalysisResponse } from './types';
import { StockCard } from './components/StockCard';
import { Loader } from './components/Loader';
import { motion } from 'motion/react';

export default function App() {
  const [targetStock, setTargetStock] = useState('');
  const [budget, setBudget] = useState('');
  const [market, setMarket] = useState<'KR' | 'US'>('KR');
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('ko-KR', { 
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAnalysis = async (stock = '', currentMarket = market) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStock: stock, market: currentMarket, budget: budget }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '분석 데이터를 가져오는데 실패했습니다.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch for Top 3
    fetchAnalysis();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(targetStock, market);
  };

  const handleMarketChange = (newMarket: 'KR' | 'US') => {
    setMarket(newMarket);
    setTargetStock('');
    fetchAnalysis('', newMarket);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans pb-24">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
              <BarChart2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">Quant Swing Pro</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">30-Year Expert Strategy</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end justify-center space-y-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{market === 'KR' ? 'KOSPI / KOSDAQ 52W LOW' : 'NASDAQ / NYSE 52W LOW'}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-blue-400/80 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              <Clock className="w-3 h-3" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search / Control Panel */}
        <div className="mb-10 bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-medium text-slate-200 mb-1">종목 스크리닝 및 정밀 분석</h2>
              <p className="text-sm text-slate-400">
                현재 52주 신저점 부근에 위치한 우량주 중, 기술적·수급적 반등 타점이 가장 명확한 종목을 발굴합니다.
              </p>
            </div>
            <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 shrink-0">
              <button
                onClick={() => handleMarketChange('KR')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  market === 'KR' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                대한민국장
              </button>
              <button
                onClick={() => handleMarketChange('US')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  market === 'US' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                미국장
              </button>
            </div>
          </div>
          
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={targetStock}
                onChange={(e) => setTargetStock(e.target.value)}
                placeholder={`종목명 또는 종목코드 입력 (비워두면 추천)`}
                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="보유 현금 (예: 1000만원)"
                className="block w-full px-3 py-3 border border-slate-700 rounded-xl bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50"
            >
              {loading ? '분석 중...' : '분석 실행'}
            </button>
          </form>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-rose-950/30 border border-rose-900/50 p-6 rounded-xl text-center">
            <p className="text-rose-400">{error}</p>
          </div>
        ) : loading ? (
          <Loader />
        ) : data ? (
          <div className="space-y-12">
            {/* Top Stocks */}
            <div className="space-y-6">
              {data.topStocks.map((stock, idx) => (
                <StockCard key={stock.code} stock={stock} index={idx} />
              ))}
            </div>

            {/* Additional Recommendations */}
            {data.additionalRecommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="border-t border-slate-800/60 pt-10"
              >
                <h3 className="text-lg font-medium text-slate-300 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                  관심 종목 (Watchlist)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.additionalRecommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-semibold text-slate-200">{rec.name}</h4>
                        <span className="text-xs font-mono text-slate-500">{rec.code}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{rec.summary}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
