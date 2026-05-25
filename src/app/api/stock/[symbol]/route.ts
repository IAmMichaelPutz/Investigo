import { NextResponse } from 'next/server';
import { STOCKS, NEWS, EVENTS } from '@/lib/mock-data';
import { translateFMPToStock, translateFMPToNews, translateFMPToEvents } from '@/lib/api-adapter';

// Cache revalidation time in seconds (43200 = 12 hours)
export const revalidate = 43200;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const uppercaseSymbol = symbol.toUpperCase();

  const apiKey = process.env.FINANCIAL_API_KEY || 'demo';
  const provider = process.env.FINANCIAL_API_PROVIDER || 'FMP';

  // 1. Sandbox fallback logic if using FMP "demo" key
  // FMP demo key only supports select tickers (AAPL, MSFT, etc.)
  const isDemo = apiKey.toLowerCase() === 'demo';

  if (isDemo) {
    // Check if the symbol is in our sandbox dataset
    const mockStock = STOCKS.find(s => s.symbol === uppercaseSymbol);
    
    if (mockStock) {
      const mockNews = NEWS.filter(n => n.symbol === uppercaseSymbol);
      const mockEvents = EVENTS.filter(e => e.symbol === uppercaseSymbol);

      return NextResponse.json({
        stock: mockStock,
        news: mockNews,
        events: mockEvents,
        source: 'SANDBOX_DEMO'
      });
    }

    // Dynamic Mock Fallback for any other symbol requested in demo mode (e.g. BMW.DE, ADS.DE)
    // Generates high-fidelity realistic data so the app remains fully functional and testable!
    const suffix = uppercaseSymbol.includes('.') ? uppercaseSymbol.split('.')[1] : 'US';
    const cleanSymbol = uppercaseSymbol.includes('.') ? uppercaseSymbol.split('.')[0] : uppercaseSymbol;
    
    const isGerman = suffix === 'DE';
    const currency = isGerman ? 'EUR' : 'USD';
    const exchange = isGerman ? 'XETRA' : 'NASDAQ';
    
    const basePrice = 120 + Math.random() * 80;
    
    const mockGeneratedStock = {
      symbol: uppercaseSymbol,
      name: `${cleanSymbol} Corp (Mocked Live)`,
      sector: isGerman ? 'Industrial / Automotive' : 'Technology Services',
      industry: isGerman ? 'Auto Manufacturers' : 'Software - Infrastructure',
      exchange,
      currentPrice: Math.round(basePrice * 100) / 100,
      currency,
      sharesOutstanding: 850,
      netDebt: 2500,
      beta: 1.15,
      historicalFinancials: [
        { year: 2020, revenue: 12500, revenueGrowth: 0.05, netIncome: 1100, netMargin: 0.088, operatingCashFlow: 1800, capex: 600, freeCashFlow: 1200, fcfMargin: 0.096 },
        { year: 2021, revenue: 14200, revenueGrowth: 0.136, netIncome: 1400, netMargin: 0.098, operatingCashFlow: 2100, capex: 650, freeCashFlow: 1450, fcfMargin: 0.102 },
        { year: 2022, revenue: 16500, revenueGrowth: 0.162, netIncome: 1750, netMargin: 0.106, operatingCashFlow: 2400, capex: 700, freeCashFlow: 1700, fcfMargin: 0.103 },
        { year: 2023, revenue: 17200, revenueGrowth: 0.042, netIncome: 1680, netMargin: 0.097, operatingCashFlow: 2200, capex: 800, freeCashFlow: 1400, fcfMargin: 0.081 },
        { year: 2024, revenue: 18900, revenueGrowth: 0.098, netIncome: 2050, netMargin: 0.108, operatingCashFlow: 2900, capex: 850, freeCashFlow: 2050, fcfMargin: 0.108 }
      ]
    };

    const mockGeneratedNews = [
      {
        id: `m-news-1-${uppercaseSymbol}`,
        symbol: uppercaseSymbol,
        date: '2026-05-18',
        title: `${mockGeneratedStock.name} Announces Groundbreaking Expansion Plans`,
        summary: `During the latest corporate address, executive leaders outlined strategic goals to capture high-margin market shares in Europe and the Americas. Revenue projected to climb 12% next year.`,
        source: 'Handelsblatt',
        sentiment: 'BULLISH' as const,
        metrics: { revenueChange: 12.0, netIncomeChange: 15.2 }
      },
      {
        id: `m-news-2-${uppercaseSymbol}`,
        symbol: uppercaseSymbol,
        date: '2026-05-10',
        title: `${mockGeneratedStock.name} Earnings Release Exceeds Wall Street Outlook`,
        summary: `Full year revenue reached ${mockGeneratedStock.historicalFinancials[4].revenue.toLocaleString()}M, rising 9.8% YoY. Operating efficiencies in digital logistics expanded EBITDA margins.`,
        source: 'Bloomberg',
        sentiment: 'BULLISH' as const,
        metrics: { revenueChange: 9.8, netIncomeChange: 22.0 }
      }
    ];

    const mockGeneratedEvents = [
      {
        id: `m-evt-1-${uppercaseSymbol}`,
        symbol: uppercaseSymbol,
        type: 'EARNINGS' as const,
        date: '2026-08-15',
        title: 'Q2 2026 Earnings Announcement',
        description: 'Publishing of second-quarter fiscal results. Webcast audio starts at 4:30 PM ET.',
        impact: 'HIGH' as const
      },
      {
        id: `m-evt-2-${uppercaseSymbol}`,
        symbol: uppercaseSymbol,
        type: 'DIVIDEND' as const,
        date: '2026-06-20',
        title: 'Dividend Ex-Date Distribution',
        description: 'Ex-dividend payment distribution of $0.45 per share for shareholders of record.',
        impact: 'LOW' as const
      }
    ];

    return NextResponse.json({
      stock: mockGeneratedStock,
      news: mockGeneratedNews,
      events: mockGeneratedEvents,
      source: 'SANDBOX_DEMO_GENERATED'
    });
  }

  // 2. Real-Time API integration if user configured their own API Key
  try {
    // Define date boundaries for the events calendar (next 6 months)
    const todayStr = new Date().toISOString().split('T')[0];
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    const endStr = sixMonthsFromNow.toISOString().split('T')[0];

    // Concurrently fetch profile details, income statement, cashflow statement, enterprise values, news, and calendar
    // revalidate configurations ensure Next.js caches these endpoints server-side
    const [profileRes, incRes, cfRes, evRes, newsRes, calendarRes] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/profile/${uppercaseSymbol}?apikey=${apiKey}`, { next: { revalidate } }),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${uppercaseSymbol}?limit=6&apikey=${apiKey}`, { next: { revalidate } }),
      fetch(`https://financialmodelingprep.com/api/v3/cashflow-statement/${uppercaseSymbol}?limit=6&apikey=${apiKey}`, { next: { revalidate } }),
      fetch(`https://financialmodelingprep.com/api/v3/enterprise-values/${uppercaseSymbol}?limit=6&apikey=${apiKey}`, { next: { revalidate } }),
      fetch(`https://financialmodelingprep.com/api/v3/stock_news?tickers=${uppercaseSymbol}&limit=10&apikey=${apiKey}`, { next: { revalidate } }),
      fetch(`https://financialmodelingprep.com/api/v3/earnings-calendar?from=${todayStr}&to=${endStr}&apikey=${apiKey}`, { next: { revalidate } }),
    ]);

    const profileData = await profileRes.json();
    const incData = await incRes.json();
    const cfData = await cfRes.json();
    const evData = await evRes.json();
    const newsData = await newsRes.json();
    const calendarData = await calendarRes.json();

    if (!profileData || profileData.length === 0) {
      return NextResponse.json(
        { error: `Stock symbol ${uppercaseSymbol} not found in the live registry.` },
        { status: 404 }
      );
    }

    // Translate FMP raw schemas into unified type-safe adapters
    const stock = translateFMPToStock(profileData[0], incData, cfData, evData);
    const news = translateFMPToNews(newsData, uppercaseSymbol);
    const events = translateFMPToEvents(calendarData, uppercaseSymbol);

    return NextResponse.json({
      stock,
      news,
      events,
      source: 'LIVE_FINANCIAL_API'
    });
  } catch (error) {
    console.error('External API integration error:', error);
    return NextResponse.json(
      { error: 'Failed fetching data from real-time endpoints. Server is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
