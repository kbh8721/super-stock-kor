import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
        />
        <div className="relative bg-slate-900 border border-slate-700 p-4 rounded-full shadow-2xl">
          <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <motion.h3 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-lg font-medium text-slate-300 font-mono tracking-widest uppercase"
        >
          Analyzing Market Data
        </motion.h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto">
          30년차 스윙트레이더 페르소나가 52주 신저점 우량주를 퀀트 분석 중입니다...
        </p>
      </div>
    </div>
  );
}
