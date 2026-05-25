"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import { Stock, PortfolioTransaction, PortfolioHolding } from '../types';

interface PortfolioManagerProps {
  stock: Stock;
}

export function PortfolioManager({ stock }: PortfolioManagerProps) {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>([]);
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');

  // Load transactions from localStorage on mount & when stock symbol changes
  useEffect(() => {
    const stored = localStorage.getItem('investigo_transactions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PortfolioTransaction[];
        // Filter transactions for this specific stock
        setTransactions(parsed.filter(t => t.symbol.toUpperCase() === stock.symbol.toUpperCase()));
      } catch (e) {
        console.error('Error parsing transactions', e);
      }
    }
    
    // Default form inputs
    setPrice(stock.currentPrice.toFixed(2));
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, [stock]);

  // Save transaction to localStorage and update local state
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(qtyNum) || qtyNum <= 0 || isNaN(priceNum) || priceNum <= 0 || !date) {
      alert('Please enter valid inputs');
      return;
    }

    const newTx: PortfolioTransaction = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: stock.symbol.toUpperCase(),
      type,
      date,
      price: priceNum,
      quantity: qtyNum,
    };

    // Fetch all transactions, append new one, and save back
    const stored = localStorage.getItem('investigo_transactions');
    let allTx: PortfolioTransaction[] = [];
    if (stored) {
      try {
        allTx = JSON.parse(stored) as PortfolioTransaction[];
      } catch (e) {
        allTx = [];
      }
    }

    const updatedAllTx = [...allTx, newTx];
    localStorage.setItem('investigo_transactions', JSON.stringify(updatedAllTx));
    
    // Update local state (filtered by symbol)
    setTransactions(updatedAllTx.filter(t => t.symbol.toUpperCase() === stock.symbol.toUpperCase()));
    
    // Clear inputs
    setQuantity('');
    setPrice(stock.currentPrice.toFixed(2));
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    const stored = localStorage.getItem('investigo_transactions');
    if (stored) {
      try {
        const allTx = JSON.parse(stored) as PortfolioTransaction[];
        const updatedAll = allTx.filter(t => t.id !== id);
        localStorage.setItem('investigo_transactions', JSON.stringify(updatedAll));
        setTransactions(updatedAll.filter(t => t.symbol.toUpperCase() === stock.symbol.toUpperCase()));
      } catch (e) {
        console.error('Error deleting transaction', e);
      }
    }
  };

  // Calculate holdings metrics
  const holding: PortfolioHolding = {
    symbol: stock.symbol,
    name: stock.name,
    quantity: 0,
    averagePrice: 0,
    currentPrice: stock.currentPrice,
    currentValue: 0,
    costBasis: 0,
    totalGain: 0,
    totalGainPercentage: 0,
  };

  let totalSpent = 0;
  let totalQty = 0;

  // Sort by date ascending to process buys/sells chronologically
  const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  sortedTx.forEach(tx => {
    if (tx.type === 'BUY') {
      totalSpent += tx.price * tx.quantity;
      totalQty += tx.quantity;
    } else if (tx.type === 'SELL') {
      // In a real system, we'd handle realized gains. Here, we adjust current holding quantity.
      // Sells reduce current holding size and average cost remains unchanged.
      if (totalQty > 0) {
        const avgPrice = totalSpent / totalQty;
        totalQty = Math.max(0, totalQty - tx.quantity);
        totalSpent = totalQty * avgPrice;
      }
    }
  });

  holding.quantity = totalQty;
  holding.costBasis = totalSpent;
  holding.averagePrice = totalQty > 0 ? totalSpent / totalQty : 0;
  holding.currentValue = totalQty * stock.currentPrice;
  holding.totalGain = holding.currentValue - holding.costBasis;
  holding.totalGainPercentage = holding.costBasis > 0 ? (holding.totalGain / holding.costBasis) * 100 : 0;

  const isProfit = holding.totalGain >= 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Portfolio overview and transaction form */}
      <div className="lg:col-span-1 glass-panel p-6 rounded-2xl glow-green border border-border flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">My Holding Summary</h3>
          </div>

          {holding.quantity > 0 ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground">Holding Size</span>
                <p className="text-2xl font-black text-white mt-1">
                  {holding.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })} shares
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Market Value</span>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {holding.currentValue.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Cost Basis</span>
                  <p className="text-lg font-semibold text-zinc-300 mt-0.5">
                    {holding.costBasis.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Avg Purchase Price</span>
                  <p className="text-lg font-semibold text-zinc-300 mt-0.5">
                    {holding.averagePrice.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Total P&L</span>
                  <div className={`flex items-center gap-1 text-lg font-bold mt-0.5 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{holding.totalGainPercentage.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-muted rounded-xl">
              <p className="text-sm text-muted-foreground">No current holdings in {stock.symbol}.</p>
              <p className="text-xs text-zinc-500 mt-1">Record transactions below to build your portfolio!</p>
            </div>
          )}
        </div>

        {/* Transaction Form */}
        <form onSubmit={handleAddTransaction} className="mt-8 pt-6 border-t border-border/40 space-y-4">
          <h4 className="text-sm font-semibold text-white">Record Transaction</h4>
          
          <div className="flex gap-2 p-0.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setType('BUY')}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'BUY' 
                  ? 'bg-emerald-500 text-background shadow-md shadow-emerald-500/10' 
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setType('SELL')}
              className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'SELL' 
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/10' 
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              Sell
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
              <input
                type="number"
                step="any"
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="10"
                className="w-full text-sm bg-zinc-900/80 border border-border/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price ({stock.currency})</label>
              <input
                type="number"
                step="any"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="180.00"
                className="w-full text-sm bg-zinc-900/80 border border-border/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Transaction Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full text-sm bg-zinc-900/80 border border-border/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-zinc-950 font-bold py-2 rounded-xl text-xs hover:bg-zinc-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Transaction
          </button>
        </form>
      </div>

      {/* Transaction Log */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-border flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide mb-4">Transaction History</h3>
          
          {transactions.length > 0 ? (
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="text-muted-foreground border-b border-border/60 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3 px-3 font-mono">{tx.date}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.type === 'BUY' 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium">{tx.quantity.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-mono font-medium">
                        {tx.price.toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-white">
                        {(tx.price * tx.quantity).toLocaleString(undefined, { style: 'currency', currency: stock.currency })}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-md text-zinc-500 transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-900 rounded-xl bg-zinc-900/10">
              <Briefcase className="w-8 h-8 text-zinc-700 mb-3" />
              <p className="text-sm font-semibold text-zinc-400">No transactions recorded yet.</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Log your buying and selling details in the form to track performance over time.
              </p>
            </div>
          )}
        </div>

        <div className="text-zinc-500 text-[10px] border-t border-border/30 pt-4 mt-4">
          * Local transaction log is saved directly in your browser. Clearing browser data will reset this simulator.
        </div>
      </div>
    </div>
  );
}
