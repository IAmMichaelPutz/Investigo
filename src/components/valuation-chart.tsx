"use client";

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HistoricalFinancials, ProjectedYear } from '../types';

interface ValuationChartProps {
  historicalData: HistoricalFinancials[];
  projectedData: ProjectedYear[];
}

export function ValuationChart({ historicalData, projectedData }: ValuationChartProps) {
  // Merge historical and projected data for continuous charting
  const chartData = [
    ...historicalData.map(h => ({
      name: `${h.year}`,
      Revenue: h.revenue,
      FCF: h.freeCashFlow,
      type: 'Historical',
    })),
    ...projectedData.map(p => ({
      name: `${p.year} (P)`,
      Revenue: p.revenue,
      FCF: p.fcf,
      type: 'Projected',
    })),
  ];

  return (
    <div className="w-full h-[400px] glass-panel p-6 rounded-2xl glow-indigo border border-border mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Revenue & Free Cash Flow Trend</h3>
          <p className="text-xs text-muted-foreground mt-1">Comparing 5-year historicals with future custom DCF projections</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 opacity-60"></span> Historical
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 border border-dashed border-indigo-300"></span> Projected (P)
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
            </linearGradient>
            <linearGradient id="colorFCF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#71717a" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            stroke="#71717a" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}B`}
          />
          
          <Tooltip
            contentStyle={{
              background: 'rgba(18, 18, 23, 0.95)',
              borderColor: 'rgba(255,255,255,0.08)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)',
              fontSize: '12px',
              color: '#fafafa',
            }}
            formatter={(value: any, name: any) => {
              const formattedVal = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(value);
              return [`${formattedVal}M`, name];
            }}
          />
          
          <Bar 
            dataKey="Revenue" 
            fill="#6366f1" 
            radius={[4, 4, 0, 0]}
            fillOpacity={0.65}
            maxBarSize={45} 
          />
          
          <Area 
            type="monotone" 
            dataKey="FCF" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorFCF)" 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
