"use client";

import React from 'react';
import { Newspaper, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { Stock, NewsArticle } from '../types';
import { getNewsForStock } from '../lib/mock-data';

interface EarningsFeedProps {
  stock: Stock;
}

export function EarningsFeed({ stock }: EarningsFeedProps) {
  const news = getNewsForStock(stock.symbol);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-border h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Newspaper className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Earnings News & Announcements</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time reports on revenue, income, and analyst expectations</p>
        </div>
      </div>

      {news.length > 0 ? (
        <div className="space-y-6">
          {news.map(article => (
            <div key={article.id} className="group relative border-l-2 border-indigo-500/30 pl-4 hover:border-indigo-500 transition-colors">
              <div className="flex justify-between items-start gap-4 mb-2">
                <span className="text-[10px] font-mono text-zinc-500">{article.date} • {article.source}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                  article.sentiment === 'BULLISH' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : article.sentiment === 'BEARISH'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {article.sentiment}
                </span>
              </div>
              
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5 cursor-pointer">
                {article.title}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
              </h4>
              
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {article.summary}
              </p>

              {article.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 p-3 bg-zinc-900/40 rounded-xl border border-zinc-900/60">
                  {article.metrics.revenueChange !== undefined && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Revenue Growth</span>
                      <div className={`flex items-center gap-0.5 text-xs font-bold mt-0.5 ${
                        article.metrics.revenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {article.metrics.revenueChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{Math.abs(article.metrics.revenueChange)}% YoY</span>
                      </div>
                    </div>
                  )}

                  {article.metrics.netIncomeChange !== undefined && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Net Income</span>
                      <div className={`flex items-center gap-0.5 text-xs font-bold mt-0.5 ${
                        article.metrics.netIncomeChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {article.metrics.netIncomeChange >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        <span>{Math.abs(article.metrics.netIncomeChange)}% YoY</span>
                      </div>
                    </div>
                  )}

                  {article.metrics.eps !== undefined && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Reported EPS</span>
                      <span className="text-xs font-bold text-white mt-0.5 block">
                        ${article.metrics.eps.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {article.metrics.epsEstimate !== undefined && (
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Analyst Estimate</span>
                      <span className="text-xs font-semibold text-zinc-400 mt-0.5 block">
                        ${article.metrics.epsEstimate.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-zinc-900 rounded-xl">
          <p className="text-sm text-muted-foreground">No recent earnings announcements available for {stock.symbol}.</p>
        </div>
      )}
    </div>
  );
}
