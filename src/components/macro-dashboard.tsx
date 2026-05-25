"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Hammer, 
  DollarSign, 
  Home, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { CentralBank, QuarterlyProbability } from '../types';
import { CENTRAL_BANKS, COMMODITIES, REAL_ESTATE_METRICS } from '../lib/macro-data';

export function MacroDashboard() {
  const [selectedBank, setSelectedBank] = useState<CentralBank>(CENTRAL_BANKS[0]);
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterlyProbability>(CENTRAL_BANKS[0].quarters[1]); // Default to Q3 2026

  // Whenever the active bank is changed, align the active quarter state automatically
  const handleSelectBank = (bank: CentralBank) => {
    setSelectedBank(bank);
    setSelectedQuarter(bank.quarters[1]); // Focus on Q3 2026 by default
  };

  const isProfit = (change: number) => change >= 0;

  // Format YTD percentages
  const formatPct = (num: number) => {
    const formatted = (num * 100).toFixed(1);
    return num >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Macro Headline Banner */}
      <div className="glass-panel p-6 rounded-2xl glow-indigo border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Macroeconomic & Housing Cost Dashboard</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Analyzing central bank monetary policies, rate-cut distributions, real estate Bauzinsen, and framing commodity costs.
          </p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] px-3 py-1.5 rounded-lg font-mono">
          Last Updated: May 2026 (Q2 Peak cycle)
        </div>
      </div>

      {/* 2. Top Split: Central Banks Grid & CME Rate cut Probability Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Central Banks Selector Grid */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5 mb-2">
            <Percent className="w-4 h-4 text-indigo-400" /> Central Bank Rates
          </h4>

          <div className="space-y-3">
            {CENTRAL_BANKS.map(bank => {
              const isActive = bank.acronym === selectedBank.acronym;
              
              return (
                <button
                  key={bank.acronym}
                  onClick={() => handleSelectBank(bank)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                    isActive 
                      ? 'bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/5' 
                      : 'bg-zinc-900/20 border-zinc-900/80 hover:bg-zinc-900/40 hover:border-zinc-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-white">{bank.acronym}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[10px] text-zinc-400 font-semibold">{bank.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block truncate max-w-[180px]">
                      {bank.tendency}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-white block font-mono">
                      {bank.currentRate.toFixed(3)}%
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider ${
                      bank.sentiment === 'HAWKISH' 
                        ? 'bg-red-500/10 text-red-400' 
                        : bank.sentiment === 'DOVISH' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {bank.sentiment}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live FedWatch Rate Probability Distribution */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {selectedBank.acronym} Policy Rate Probability Matrix
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Market probabilities of rate adjustments based on CME and interest yield futures
                </p>
              </div>

              {/* Quarterly selector tabs */}
              <div className="flex gap-1 p-0.5 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                {selectedBank.quarters.map(q => (
                  <button
                    key={q.quarter}
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      selectedQuarter.quarter === q.quarter 
                        ? 'bg-zinc-900 text-white border border-zinc-800' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {q.quarter}
                  </button>
                ))}
              </div>
            </div>

            {/* Quarterly stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-[10px] text-muted-foreground block">Target Quarter</span>
                <span className="font-bold text-white block mt-0.5">{selectedQuarter.quarter}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Key Meeting Date</span>
                <span className="font-bold text-indigo-400 block mt-0.5">{selectedQuarter.meetingDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Current Policy Base</span>
                <span className="font-bold text-zinc-300 block mt-0.5 font-mono">{selectedBank.currentRate.toFixed(3)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">Bias Stance</span>
                <span className="font-bold text-zinc-300 block mt-0.5">{selectedBank.sentiment}</span>
              </div>
            </div>

            {/* Recharts Bar graph representing quarterly rate projections */}
            <div className="h-[180px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedQuarter.probabilities} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(18, 18, 23, 0.95)',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      fontSize: '11px',
                      color: '#fafafa',
                    }}
                    formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                  />
                  <Bar dataKey="probability" fill="#6366f1" radius={[4, 4, 0, 0]} fillOpacity={0.7} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lower Split: Commodities & Real Estate Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Commodities Tracker */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Hammer className="w-5 h-5 text-emerald-400" />
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Real Estate Construction Commodities</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Tracking materials, energy, and inflation hedges driving structural costs</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="py-2.5 px-1">Commodity</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-center">YTD Change</th>
                  <th className="py-2.5 text-center">Cost Valuation</th>
                  <th className="py-2.5 px-3">Real Estate Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {COMMODITIES.map(c => {
                  const ytdUp = c.changeYtd >= 0;
                  
                  return (
                    <tr key={c.symbol} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="py-3 px-1">
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{c.symbol} • {c.unit}</span>
                      </td>
                      
                      <td className="py-3 text-right font-mono font-bold text-white">
                        {c.category === 'PRECIOUS_METALS' || c.price > 10
                          ? `$${c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : `$${c.price.toFixed(2)}`
                        }
                      </td>

                      <td className="py-3 text-center font-mono">
                        <div className={`inline-flex items-center gap-0.5 font-bold ${ytdUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {ytdUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{formatPct(c.changeYtd)}</span>
                        </div>
                      </td>

                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                          c.valuationState === 'OVERVALUED' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/10' 
                            : c.valuationState === 'UNDERVALUED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {c.valuationState}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-zinc-400 text-[11px] max-w-[200px] leading-snug">
                        {c.realEstateImpact}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real Estate Yields and Indices */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-rose-400" />
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">Real Estate Market Metrics</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">Yield averages, mortgage Bauzinsen, and REIT multiples</p>
              </div>
            </div>

            <div className="space-y-4">
              {REAL_ESTATE_METRICS.map(index => {
                const yoyUp = index.changeYoY >= 0;
                
                return (
                  <div key={index.name} className="p-3.5 bg-zinc-900/20 border border-zinc-900/60 rounded-xl space-y-1 hover:border-zinc-800 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{index.name}</span>
                      <span className={`text-[10px] font-mono font-bold ${yoyUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                        YoY {formatPct(index.changeYoY)}
                      </span>
                    </div>
                    
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white font-mono">{index.value}</span>
                      <span className="text-xs text-muted-foreground font-mono">{index.unit}</span>
                    </div>

                    <p className="text-[10px] text-zinc-500 leading-snug">
                      {index.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-zinc-500 text-[10px] border-t border-border/30 pt-4 mt-6 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
            <span>* Real Estate metrics are monthly averages. Mortgage rates represent peak 2026 interest yields.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
