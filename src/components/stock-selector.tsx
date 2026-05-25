"use client";

import React, { useState } from 'react';
import { Search, Globe, ChevronRight, Sparkles } from 'lucide-react';
import { Stock } from '../types';
import { STOCKS } from '../lib/mock-data';

interface StockSelectorProps {
  selectedStock: Stock;
  onSelectStock: (stock: Stock) => void;
}

export function StockSelector({ selectedStock, onSelectStock }: StockSelectorProps) {
  const [search, setSearch] = useState('');

  const uppercaseSearch = search.trim().toUpperCase();

  // Check if search query matches any stock tickers in our default list
  const filteredStocks = STOCKS.filter(
    s => 
      s.symbol.toLowerCase().includes(search.toLowerCase()) || 
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Check if we should offer custom live lookup for user's query
  const showLiveLookupButton = 
    uppercaseSearch.length > 0 && 
    !STOCKS.some(s => s.symbol === uppercaseSearch);

  // Triggers live lookup by making a mock shell stock object
  // page.tsx will catch it and fetch real live details
  const handleLiveLookup = () => {
    if (uppercaseSearch.length > 0) {
      const liveLookupPlaceholder: Stock = {
        symbol: uppercaseSearch,
        name: 'Fetching Live Data...',
        sector: 'Loading...',
        industry: 'Loading...',
        exchange: '...',
        currentPrice: 0,
        currency: uppercaseSearch.endsWith('.DE') ? 'EUR' : 'USD',
        sharesOutstanding: 0,
        netDebt: 0,
        beta: 1.0,
        historicalFinancials: [] // Empty signals page.tsx to fetch
      };
      
      onSelectStock(liveLookupPlaceholder);
      setSearch('');
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-wide">Market Universe</h3>
        <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
          {STOCKS.length} Presets loaded
        </span>
      </div>

      {/* Search Box */}
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-3.5 h-3.5" />
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search AAPL, SAP.DE, BMW.DE..."
          className="w-full text-xs bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && showLiveLookupButton) {
              handleLiveLookup();
            }
          }}
        />
      </div>

      {/* Stock Cards List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        
        {/* Dynamic Query Button */}
        {showLiveLookupButton && (
          <button
            onClick={handleLiveLookup}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-dashed border-indigo-500/50 bg-indigo-950/20 hover:bg-indigo-950/40 text-left transition-all text-indigo-300 font-bold"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-xs block">Fetch Ticker Live</span>
                <span className="text-[10px] text-indigo-400/80 font-mono">Query "{uppercaseSearch}"</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-indigo-400" />
          </button>
        )}

        {filteredStocks.map(stock => {
          const isSelected = stock.symbol.toUpperCase() === selectedStock.symbol.toUpperCase();
          
          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/5' 
                  : 'bg-zinc-900/20 border-zinc-900/80 hover:bg-zinc-900/40 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs transition-colors ${
                  isSelected ? 'bg-indigo-500 text-background' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {stock.symbol}
                </div>
                
                <div>
                  <span className="text-xs font-bold text-white block">{stock.name}</span>
                  <span className="text-[10px] text-zinc-500">{stock.sector} • {stock.exchange}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-white block">
                  {stock.currentPrice > 0 
                    ? stock.currentPrice.toLocaleString(undefined, { style: 'currency', currency: stock.currency })
                    : 'N/A'
                  }
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {stock.currency}
                </span>
              </div>
            </button>
          );
        })}

        {filteredStocks.length === 0 && !showLiveLookupButton && (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No stocks matched your search. Try typing a direct ticker like MSFT.
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3" /> Live API Connected
        </span>
        <span className="text-zinc-600 font-mono text-[9px]">
          XETRA: *.DE
        </span>
      </div>
    </div>
  );
}
