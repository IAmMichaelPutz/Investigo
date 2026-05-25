"use client";

import React from 'react';
import { Calendar, BellRing } from 'lucide-react';
import { Stock } from '../types';
import { getEventsForStock } from '../lib/mock-data';

interface UpcomingEventsProps {
  stock: Stock;
}

export function UpcomingEvents({ stock }: UpcomingEventsProps) {
  const events = getEventsForStock(stock.symbol);

  // Helper to format events display dates
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-border h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Upcoming Corporate Events</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Crucial dates: Dividends, earnings calendar, and AGM reviews</p>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex gap-4 p-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl hover:border-zinc-800 transition-colors">
              
              {/* Date Block */}
              <div className="flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800/80 w-16 h-16 rounded-xl shrink-0">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-xl font-black text-white leading-none mt-1">
                  {new Date(event.date).getDate()}
                </span>
              </div>

              {/* Detail Block */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-white leading-snug">{event.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                      event.impact === 'HIGH' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/10' 
                        : event.impact === 'MEDIUM'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/10'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {event.impact} IMPACT
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{event.description}</p>
                </div>
                
                <div className="flex justify-between items-center text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-900/30">
                  <span className="font-mono">{formatDate(event.date)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono text-[9px]">{event.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-900 rounded-xl">
          <BellRing className="w-6 h-6 text-zinc-800 mb-2" />
          <p className="text-xs text-muted-foreground">No upcoming corporate events scheduled for {stock.symbol}.</p>
        </div>
      )}
    </div>
  );
}
