import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown, TrendingUp, AlertTriangle, Crosshair, Target, Shield, Info } from 'lucide-react';
import { StockAnalysis } from '../types';

export function StockCard({ stock, index }: { stock: StockAnalysis; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: 'easeOut' }}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-500">SCORE</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{stock.score}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight flex items-baseline space-x-3">
          <span>{stock.name}</span>
          <span className="text-lg text-slate-500 font-mono font-medium">{stock.code}</span>
        </h2>
        <div className="mt-2 text-2xl font-semibold text-white tracking-tight">
          {stock.currentPrice}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className={`px-2.5 py-1 rounded-md font-medium text-xs border ${
            stock.suitability === '매우 높음' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            stock.suitability === '높음' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
            'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            매수 적합성: {stock.suitability}
          </span>
          <span className="text-slate-400 flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-1 text-slate-500" />
            52주 저점: {stock.low52Week.price} ({stock.low52Week.date})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2 text-slate-400" /> 핵심 매수 이유
          </h3>
          <ul className="space-y-2">
            {stock.reasons.map((reason, i) => (
              <li key={i} className="text-slate-400 text-sm flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 mr-2 flex-shrink-0" />
                <span className="leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
              <Crosshair className="w-4 h-4 mr-2 text-slate-400" /> 차트 핵심 포인트
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              {stock.chartPoints}
            </p>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
            <Target className="w-4 h-4 mr-2 text-slate-400" /> 매수 전략
          </h3>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">추천 매수 가격대</span>
              <span className="text-emerald-400 font-semibold">{stock.strategy.buyRange}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center">
                <Shield className="w-3 h-3 mr-1.5 text-rose-400" /> 손절 라인
              </span>
              <span className="text-rose-400 font-semibold">
                {stock.strategy.stopLoss.price} <span className="text-xs text-rose-400/70">({stock.strategy.stopLoss.percent}%)</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">1차 익절 목표</span>
              <div className="text-right">
                <span className="text-emerald-400 font-semibold">{stock.strategy.target1.price}</span>
                <span className="text-xs text-slate-500 ml-2">+{stock.strategy.target1.percent}% · {stock.strategy.target1.period}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
              <span className="text-slate-400">2차 익절 목표</span>
              <div className="text-right">
                <span className="text-emerald-400 font-semibold">{stock.strategy.target2.price}</span>
                <span className="text-xs text-slate-500 ml-2">+{stock.strategy.target2.percent}% · {stock.strategy.target2.period}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 pt-4">
              <span className="text-slate-400">예상 R:R 비율</span>
              <span className="text-blue-400 font-semibold">{stock.strategy.riskReward}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-rose-400 tracking-wider mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" /> 리스크 요인
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stock.risks.map((risk, i) => (
            <li key={i} className="text-rose-200/70 text-xs flex items-start">
              <span className="w-1 h-1 rounded-full bg-rose-500/50 mt-1.5 mr-2 flex-shrink-0" />
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
