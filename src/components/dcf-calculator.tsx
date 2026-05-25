"use client";

import React, { useState, useEffect } from 'react';
import { Sliders, HelpCircle, ArrowUpRight, ArrowDownRight, Edit2, Check } from 'lucide-react';
import { Stock, DCFAssumptions, DCFResult } from '../types';
import { calculateDCF } from '../lib/dcf';
import { ValuationChart } from './valuation-chart';

interface DCFCalculatorProps {
  stock: Stock;
}

export function DCFCalculator({ stock }: DCFCalculatorProps) {
  // 1. Core financial state initialized from selected stock's latest stats
  const [wacc, setWacc] = useState<number>(0.085); // Default 8.5%
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number>(0.02); // Default 2%
  const [projectionYears] = useState<number>(5);
  
  // Custom arrays initialized to stock's average historical trends
  const [customGrowthRates, setCustomGrowthRates] = useState<number[]>([]);
  const [customFCFMargins, setCustomFCFMargins] = useState<number[]>([]);

  // State to track if user is editing specific years directly
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editingGrowth, setEditingGrowth] = useState<string>('');
  const [editingMargin, setEditingMargin] = useState<string>('');

  // 2. Populate states whenever the stock changes
  useEffect(() => {
    // Sensible defaults based on beta and historical margins
    const calculatedWACC = Math.max(0.06, Math.min(0.12, 0.05 + stock.beta * 0.03));
    setWacc(calculatedWACC);
    setTerminalGrowthRate(0.02);

    const sortedHistoricals = [...stock.historicalFinancials].sort((a, b) => a.year - b.year);
    const lastHist = sortedHistoricals[sortedHistoricals.length - 1];

    // Initialize custom projections based on historical averages
    const avgGrowth = sortedHistoricals.reduce((acc, curr) => acc + curr.revenueGrowth, 0) / sortedHistoricals.length;
    const safeAvgGrowth = isNaN(avgGrowth) || avgGrowth < 0 ? 0.05 : Math.min(0.20, avgGrowth);

    const avgMargin = sortedHistoricals.reduce((acc, curr) => acc + curr.fcfMargin, 0) / sortedHistoricals.length;
    const safeAvgMargin = isNaN(avgMargin) || avgMargin <= 0 ? 0.12 : avgMargin;

    // Linear fade down in growth rate towards terminal growth over the projection years
    const growthRates = Array.from({ length: 5 }, (_, i) => {
      const step = i / 4; // 0 to 1
      return Math.round((safeAvgGrowth * (1 - step) + 0.04 * step) * 1000) / 1000;
    });

    const margins = Array.from({ length: 5 }, () => Math.round(safeAvgMargin * 1000) / 1000);

    setCustomGrowthRates(growthRates);
    setCustomFCFMargins(margins);
    setEditingYear(null);
  }, [stock]);

  // Handle updates to specific year inputs inside the table
  const saveYearEdits = (index: number) => {
    const newGrowth = parseFloat(editingGrowth) / 100;
    const newMargin = parseFloat(editingMargin) / 100;

    if (!isNaN(newGrowth) && !isNaN(newMargin)) {
      const updatedGrowth = [...customGrowthRates];
      updatedGrowth[index] = newGrowth;
      setCustomGrowthRates(updatedGrowth);

      const updatedMargin = [...customFCFMargins];
      updatedMargin[index] = newMargin;
      setCustomFCFMargins(updatedMargin);

      setEditingYear(null);
    }
  };

  const startEditingYear = (index: number) => {
    setEditingYear(index);
    setEditingGrowth((customGrowthRates[index] * 100).toFixed(1));
    setEditingMargin((customFCFMargins[index] * 100).toFixed(1));
  };

  // 3. Compute DCF in real-time
  const assumptions: DCFAssumptions = {
    wacc,
    terminalGrowthRate,
    projectionYears,
    customGrowthRates,
    customFCFMargins,
  };

  let dcfResult: DCFResult | null = null;
  try {
    if (customGrowthRates.length > 0 && customFCFMargins.length > 0) {
      dcfResult = calculateDCF(stock, assumptions);
    }
  } catch (e) {
    console.error(e);
  }

  if (!dcfResult) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        Loading DCF model...
      </div>
    );
  }

  const { fairValue, marginOfSafety, isUndervalued, projections } = dcfResult;
  const mosPercent = (marginOfSafety * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. Header Valuation Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Intrinsic Value Card */}
        <div className={`glass-panel p-6 rounded-2xl border transition-all ${
          isUndervalued 
            ? 'glow-green border-emerald-500/20' 
            : 'border-zinc-800'
        }`}>
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">Intrinsic Fair Value</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-white">
              {fairValue.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
            </span>
            <span className="text-xs text-muted-foreground">per share</span>
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            Calculated intrinsic equity value per share based on the present value of projected free cash flows.
          </p>
        </div>

        {/* Market Price Card */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800">
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">Current Market Price</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-zinc-300">
              {stock.currentPrice.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
            </span>
            <span className="text-xs text-muted-foreground">on {stock.exchange}</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-zinc-500">Beta: {stock.beta}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Currency: {stock.currency}</span>
          </div>
        </div>

        {/* Margin of Safety Card */}
        <div className={`glass-panel p-6 rounded-2xl border transition-all ${
          isUndervalued 
            ? 'bg-emerald-950/20 border-emerald-500/30' 
            : 'bg-red-950/10 border-red-500/20'
        }`}>
          <span className="text-xs text-muted-foreground tracking-wider uppercase font-semibold">Margin of Safety</span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-4xl font-black ${isUndervalued ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUndervalued ? `+${mosPercent}%` : `${mosPercent}%`}
            </span>
            {isUndervalued ? (
              <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-1 bg-red-500/20 text-red-400 rounded-full">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            {isUndervalued 
              ? `Undervalued! Stock is trading ${mosPercent}% below its intrinsic fair value. Strong buy buffer.` 
              : `Overvalued! Market price exceeds calculated fair value by ${Math.abs(parseFloat(mosPercent))}%`
            }
          </p>
        </div>
      </div>

      {/* 2. Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Sliders Panel */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">DCF Assumptions</h3>
          </div>

          <div className="space-y-6">
            {/* WACC Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-1">
                  WACC (Discount Rate)
                  <span className="cursor-help" title="Weighted Average Cost of Capital: The hurdle rate used to discount future cash flows.">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400" />
                  </span>
                </span>
                <span className="text-sm font-bold text-indigo-400 font-mono">{(wacc * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.18"
                step="0.0025"
                value={wacc}
                onChange={e => setWacc(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>5.0% (Low risk)</span>
                <span>18.0% (High risk)</span>
              </div>
            </div>

            {/* Terminal Growth Rate Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-zinc-300 flex items-center gap-1">
                  Terminal Growth Rate
                  <span className="cursor-help" title="The perpetual growth rate of cash flows beyond the projection period (usually matches inflation / GDP growth).">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-400" />
                  </span>
                </span>
                <span className="text-sm font-bold text-indigo-400 font-mono">{(terminalGrowthRate * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.04"
                step="0.001"
                value={terminalGrowthRate}
                onChange={e => setTerminalGrowthRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>0.5%</span>
                <span>4.0% (GDP cap)</span>
              </div>
            </div>

            <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 space-y-2 mt-4">
              <h4 className="font-bold text-zinc-300">Quick Valuation Insights:</h4>
              <p>• A <b>higher WACC</b> decreases the intrinsic fair value because future cash flows are penalized more.</p>
              <p>• A <b>higher Terminal Growth</b> increases perpetual value, representing optimistic long-term tailwinds.</p>
            </div>
          </div>
        </div>

        {/* Valuation Worksheet Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-lg font-bold text-white tracking-wide mb-4">Financial Projection Worksheet</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="py-2 px-1">Year</th>
                  <th className="py-2 text-right">Projected Revenue</th>
                  <th className="py-2 text-center">Revenue Growth</th>
                  <th className="py-2 text-center">FCF Margin</th>
                  <th className="py-2 text-right">Free Cash Flow</th>
                  <th className="py-2 text-right">PV of FCF</th>
                  <th className="py-2 text-center">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {projections.map((p, idx) => (
                  <tr key={p.year} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-3 px-1 font-bold text-white">{p.year} (P)</td>
                    
                    <td className="py-3 text-right font-mono font-medium">
                      ${p.revenue.toLocaleString()}M
                    </td>
                    
                    <td className="py-3 text-center font-mono">
                      {editingYear === idx ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={editingGrowth}
                            onChange={e => setEditingGrowth(e.target.value)}
                            className="w-12 bg-zinc-950 text-center border border-zinc-800 rounded px-1 text-[11px] font-mono text-white focus:outline-none"
                          />
                          <span className="text-[10px] text-zinc-400">%</span>
                        </div>
                      ) : (
                        <span className="text-indigo-400 font-semibold">
                          +{(p.revenueGrowth * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-center font-mono">
                      {editingYear === idx ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="text"
                            value={editingMargin}
                            onChange={e => setEditingMargin(e.target.value)}
                            className="w-12 bg-zinc-950 text-center border border-zinc-800 rounded px-1 text-[11px] font-mono text-white focus:outline-none"
                          />
                          <span className="text-[10px] text-zinc-400">%</span>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          {(p.fcfMargin * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right font-mono font-medium text-zinc-100">
                      ${p.fcf.toLocaleString()}M
                    </td>

                    <td className="py-3 text-right font-mono font-semibold text-white">
                      ${p.discountedFCF.toLocaleString()}M
                    </td>

                    <td className="py-3 text-center">
                      {editingYear === idx ? (
                        <button
                          onClick={() => saveYearEdits(idx)}
                          className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors"
                          title="Save Changes"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditingYear(idx)}
                          className="p-1 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 rounded transition-colors"
                          title="Edit growth rates & margins"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 pt-4 border-t border-border/40 text-[11px] text-zinc-500">
            <div>
              <span>Discounted Free Cash Flows (Years 1-5): </span>
              <span className="font-bold text-white font-mono">${dcfResult.pvOfFreeCashFlows.toLocaleString()}M</span>
            </div>
            <div>
              <span>Discounted Terminal Value (Perpetual): </span>
              <span className="font-bold text-white font-mono">${dcfResult.discountedTerminalValue.toLocaleString()}M</span>
            </div>
            <div>
              <span>Enterprise Value: </span>
              <span className="font-bold text-white font-mono">${dcfResult.enterpriseValue.toLocaleString()}M</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Stunning Composed Valuation Chart */}
      <ValuationChart historicalData={stock.historicalFinancials} projectedData={projections} />
    </div>
  );
}
