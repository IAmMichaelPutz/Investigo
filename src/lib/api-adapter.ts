import { Stock, HistoricalFinancials, StockEvent, NewsArticle } from '../types';

/**
 * Translates Financial Modeling Prep (FMP) raw JSON payloads into our standard, type-safe Stock model.
 * 
 * @param profile Raw profile data (e.g. from /api/v3/profile/SYMBOL)
 * @param incomeStatements Raw income statement entries (e.g. from /api/v3/income-statement/SYMBOL)
 * @param cashFlowStatements Raw cash flow statement entries (e.g. from /api/v3/cashflow-statement/SYMBOL)
 * @param enterpriseValues Raw enterprise values (e.g. from /api/v3/enterprise-values/SYMBOL)
 */
export function translateFMPToStock(
  profile: any,
  incomeStatements: any[],
  cashFlowStatements: any[],
  enterpriseValues: any[]
): Stock {
  if (!profile) {
    throw new Error('Profile data is missing.');
  }

  const symbol = profile.symbol || 'UNKNOWN';
  const name = profile.companyName || profile.name || 'Unknown Company';
  const sector = profile.sector || 'Other';
  const industry = profile.industry || 'Other';
  const exchange = profile.exchangeShortName || profile.exchange || 'NASDAQ';
  const currentPrice = profile.price || 0;
  const currency = profile.currency || 'USD';
  const beta = profile.beta || 1.0;
  
  // Calculate shares outstanding in millions: Market Cap / Price
  // FMP returns marketCap in absolute terms
  const marketCap = profile.mktCap || 0;
  const sharesOutstanding = currentPrice > 0 ? (marketCap / currentPrice) / 1000000 : 100;

  // Grab net debt in millions from the latest enterprise value endpoint or balance sheet
  // Net Debt = Total Debt - Cash & Cash Equivalents
  const latestEV = enterpriseValues && enterpriseValues[0] ? enterpriseValues[0] : {};
  const netDebt = (latestEV.netDebt || 0) / 1000000;

  // Process historical statements (limit to 5 years, sorted ascending)
  const historicalFinancials: HistoricalFinancials[] = [];
  
  // Align income and cash flow statements by fiscal year
  const limit = Math.min(5, incomeStatements.length);
  const alignedYears: { [year: number]: { income?: any; cashFlow?: any } } = {};

  incomeStatements.slice(0, limit).forEach(inc => {
    const year = parseInt(inc.calendarYear || inc.date.substring(0, 4));
    if (!isNaN(year)) {
      alignedYears[year] = { ...alignedYears[year], income: inc };
    }
  });

  cashFlowStatements.forEach(cf => {
    const year = parseInt(cf.calendarYear || cf.date.substring(0, 4));
    if (!isNaN(year) && alignedYears[year]) {
      alignedYears[year].cashFlow = cf;
    }
  });

  // Convert aligned data and calculate year-over-year growth
  const years = Object.keys(alignedYears).map(Number).sort((a, b) => a - b);

  years.forEach((year, index) => {
    const data = alignedYears[year];
    const inc = data.income;
    const cf = data.cashFlow || {};

    const revenue = (inc?.revenue || 0) / 1000000; // in Millions
    const netIncome = (inc?.netIncome || 0) / 1000000; // in Millions
    const operatingCashFlow = (cf?.operatingCashFlow || 0) / 1000000; // in Millions
    const capex = (cf?.capitalExpenditure || 0) / 1000000; // in Millions
    const freeCashFlow = operatingCashFlow - capex;

    const netMargin = revenue > 0 ? netIncome / revenue : 0;
    const fcfMargin = revenue > 0 ? freeCashFlow / revenue : 0;

    // Calculate revenue growth YoY
    let revenueGrowth = 0;
    if (index > 0) {
      const prevYear = years[index - 1];
      const prevRevenue = (alignedYears[prevYear].income?.revenue || 0) / 1000000;
      revenueGrowth = prevRevenue > 0 ? (revenue - prevRevenue) / prevRevenue : 0;
    } else {
      // Fallback for first year (growth relative to incomeStatement index + 1 if available)
      const olderInc = incomeStatements[index + 1];
      if (olderInc) {
        const olderRevenue = (olderInc.revenue || 0) / 1000000;
        revenueGrowth = olderRevenue > 0 ? (revenue - olderRevenue) / olderRevenue : 0.05;
      } else {
        revenueGrowth = 0.05; // 5% fallback
      }
    }

    historicalFinancials.push({
      year,
      revenue: Math.round(revenue * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 1000) / 1000,
      netIncome: Math.round(netIncome * 100) / 100,
      netMargin: Math.round(netMargin * 1000) / 1000,
      operatingCashFlow: Math.round(operatingCashFlow * 100) / 100,
      capex: Math.round(capex * 100) / 100,
      freeCashFlow: Math.round(freeCashFlow * 100) / 100,
      fcfMargin: Math.round(fcfMargin * 1000) / 1000,
    });
  });

  return {
    symbol: symbol.toUpperCase(),
    name,
    sector,
    industry,
    exchange,
    currentPrice,
    currency,
    sharesOutstanding: Math.round(sharesOutstanding * 100) / 100,
    netDebt: Math.round(netDebt * 100) / 100,
    beta: Math.round(beta * 100) / 100,
    historicalFinancials,
  };
}

/**
 * Translates FMP raw news JSON items into our standard, type-safe NewsArticle models.
 */
export function translateFMPToNews(newsList: any[], targetSymbol: string): NewsArticle[] {
  if (!Array.isArray(newsList)) return [];

  return newsList.slice(0, 8).map((news: any, index: number) => {
    // Map text sentiment tag to our enum
    let sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH' = 'NEUTRAL';
    const text = ((news.title || '') + ' ' + (news.text || '')).toUpperCase();
    
    if (text.includes('BEAT') || text.includes('RECORD') || text.includes('SURGE') || text.includes('UP') || text.includes('BULLISH')) {
      sentiment = 'BULLISH';
    } else if (text.includes('MISS') || text.includes('DOWN') || text.includes('DECLINE') || text.includes('SLUMP') || text.includes('BEARISH')) {
      sentiment = 'BEARISH';
    }

    return {
      id: news.id || `news-${targetSymbol}-${index}`,
      symbol: targetSymbol.toUpperCase(),
      date: news.publishedDate ? news.publishedDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
      title: news.title || 'Corporate News Release',
      summary: news.text || news.title || '',
      source: news.site || 'Financial Media',
      sentiment,
      metrics: {
        revenueChange: sentiment === 'BULLISH' ? 8.5 : sentiment === 'BEARISH' ? -4.2 : 1.5,
        netIncomeChange: sentiment === 'BULLISH' ? 12.0 : sentiment === 'BEARISH' ? -8.0 : 2.0,
      }
    };
  });
}

/**
 * Translates FMP upcoming earnings calendar items into our standard, type-safe StockEvent models.
 */
export function translateFMPToEvents(calendarList: any[], targetSymbol: string): StockEvent[] {
  if (!Array.isArray(calendarList)) return [];

  // Filter for events matching the target stock symbol
  const stockEvents = calendarList.filter(item => 
    item.symbol && item.symbol.toUpperCase() === targetSymbol.toUpperCase()
  );

  return stockEvents.slice(0, 5).map((item: any, index: number) => {
    const isEarnings = item.revenue !== undefined || item.eps !== undefined || item.date;
    const type = isEarnings ? 'EARNINGS' : 'DIVIDEND';
    const impact = type === 'EARNINGS' ? 'HIGH' : 'LOW';

    return {
      id: `event-${targetSymbol}-${index}`,
      symbol: targetSymbol.toUpperCase(),
      type,
      date: item.date || new Date().toISOString().substring(0, 10),
      title: type === 'EARNINGS' ? 'Quarterly Earnings Release' : 'Dividend Distribution',
      description: type === 'EARNINGS' 
        ? `Corporate earnings report scheduled. Estimate EPS: $${item.epsEstimated?.toFixed(2) || 'N/A'}`
        : `Dividend announcement event scheduled for shareholders of record.`,
      impact,
    };
  });
}
