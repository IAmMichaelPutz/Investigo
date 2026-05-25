"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Newspaper, 
  Calendar, 
  Briefcase, 
  LineChart,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { Stock } from '../types';
import { STOCKS } from '../lib/mock-data';
import { StockSelector } from '../components/stock-selector';
import { DCFCalculator } from '../components/dcf-calculator';
import { EarningsFeed } from '../components/earnings-feed';
import { UpcomingEvents } from '../components/upcoming-events';
import { PortfolioManager } from '../components/portfolio-manager';

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<Stock>(STOCKS[0]);
  const [activeTab, setActiveTab] = useState<'dcf' | 'news' | 'events' | 'portfolio'>('dcf');

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col antialiased">
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-border/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider text-white">
                INVESTIGO <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-indigo-400 ml-1 font-mono">MVP</span>
              </h1>
              <p className="text-[10px] text-muted-foreground">Advanced DCF Analysis & Portfolio Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Markets Live
            </span>
            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block"></div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-muted-foreground hover:text-white transition-colors flex items-center gap-1"
            >
              <Cpu className="w-3.5 h-3.5" /> Docs
            </a>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col gap-6">
        
        {/* Top Asset Summary Banner */}
        <div className="glass-panel p-6 rounded-2xl glow-indigo border border-border/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-black text-white">{selectedStock.symbol}</span>
              <span className="text-zinc-500">•</span>
              <h2 className="text-xl font-bold text-zinc-300">{selectedStock.name}</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Sector: <span className="text-zinc-300">{selectedStock.sector}</span> | Industry: <span className="text-zinc-300">{selectedStock.industry}</span> | Exchange: <span className="text-zinc-300">{selectedStock.exchange}</span>
            </p>
          </div>

          <div className="flex items-baseline gap-3 md:text-right">
            <div>
              <span className="text-xs text-muted-foreground block">Market Price</span>
              <span className="text-3xl font-black text-white">
                {selectedStock.currentPrice.toLocaleString(undefined, { style: 'currency', currency: selectedStock.currency })}
              </span>
            </div>
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Stock Selector Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <StockSelector 
              selectedStock={selectedStock} 
              onSelectStock={(stock) => setSelectedStock(stock)} 
            />
          </div>

          {/* Right Column: Tab Panels */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Tab Controllers */}
            <div className="flex gap-1.5 p-1 bg-zinc-950/60 border border-zinc-900 rounded-xl overflow-x-auto">
              <button
                onClick={() => setActiveTab('dcf')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'dcf' 
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-lg shadow-black/40' 
                    : 'text-muted-foreground hover:text-white hover:bg-zinc-900/10'
                }`}
              >
                <LineChart className="w-3.5 h-3.5 text-indigo-400" />
                Intrinsic Valuation (DCF)
              </button>
              
              <button
                onClick={() => setActiveTab('news')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'news' 
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-lg shadow-black/40' 
                    : 'text-muted-foreground hover:text-white hover:bg-zinc-900/10'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
                Earnings Announcements
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'events' 
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-lg shadow-black/40' 
                    : 'text-muted-foreground hover:text-white hover:bg-zinc-900/10'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Corporate Calendar
              </button>

              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === 'portfolio' 
                    ? 'bg-zinc-900 text-white border border-zinc-800 shadow-lg shadow-black/40' 
                    : 'text-muted-foreground hover:text-white hover:bg-zinc-900/10'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-rose-400" />
                Portfolio Simulator
              </button>
            </div>

            {/* Tab Visual Contents */}
            <div className="transition-opacity duration-300">
              {activeTab === 'dcf' && <DCFCalculator stock={selectedStock} />}
              {activeTab === 'news' && <EarningsFeed stock={selectedStock} />}
              {activeTab === 'events' && <UpcomingEvents stock={selectedStock} />}
              {activeTab === 'portfolio' && <PortfolioManager stock={selectedStock} />}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-border/40 py-8 bg-zinc-950 mt-12 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-600" />
            <span>© 2026 Investigo Inc. All sandbox rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Security</span>
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Risk Disclosure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
