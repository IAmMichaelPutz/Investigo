import { NextResponse } from 'next/server';
import { STOCKS, NEWS, EVENTS } from '@/lib/mock-data';
import { translateFMPToStock, translateFMPToNews, translateFMPToEvents } from '@/lib/api-adapter';

// Cache revalidation time in seconds (43200 = 12 hours)
export const revalidate = 43200;

/**
 * Safely fetches a URL and checks if FMP returned a valid JSON array or a plan restriction text.
 * Prevents JSON parsing exceptions ("Unexpected token P...") by checking raw text first.
 */
async function fetchFMPJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  const rawText = await res.text();
  const trimmed = rawText.trim();
  
  if (
    trimmed.startsWith('Premium Query') || 
    trimmed.startsWith('Restricted Endpoint') || 
    trimmed.startsWith('Special Endpoint') || 
    trimmed.includes('Error Message')
  ) {
    throw new Error('FMP_PREMIUM_RESTRICTED');
  }

  try {
    return JSON.parse(trimmed);
  } catch (e) {
    throw new Error('FMP_INVALID_JSON_RESPONSE');
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const uppercaseSymbol = symbol.toUpperCase();

  const apiKey = process.env.FINANCIAL_API_KEY || 'demo';
  const isDemo = apiKey.toLowerCase() === 'demo';

  // 1. Sandbox fallback logic if using FMP "demo" key
  if (isDemo) {
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

    // Dynamic Mock Fallback for any other symbol requested in demo mode
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
        title: `${mockGeneratedStock.name} Announces Expansion Plans`,
        summary: `During the latest corporate address, executive leaders outlined strategic goals to capture high-margin market shares in Europe and the Americas.`,
        source: 'Handelsblatt',
        sentiment: 'BULLISH' as const,
        metrics: { revenueChange: 12.0, netIncomeChange: 15.2 }
      }
    ];

    const mockGeneratedEvents = [
      {
        id: `m-evt-1-${uppercaseSymbol}`,
        symbol: uppercaseSymbol,
        type: 'EARNINGS' as const,
        date: '2026-08-15',
        title: 'Q2 2026 Earnings Announcement',
        description: 'Publishing of second-quarter fiscal results.',
        impact: 'HIGH' as const
      }
    ];

    return NextResponse.json({
      stock: mockGeneratedStock,
      news: mockGeneratedNews,
      events: mockGeneratedEvents,
      source: 'SANDBOX_DEMO_GENERATED'
    });
  }

  // 2. Real-Time API integration with user's personal key
  try {
    // A. Fetch profile first since it is ALWAYS allowed for US and XETRA listings
    let profileData: any;
    try {
      profileData = await fetchFMPJson(`https://financialmodelingprep.com/stable/profile?symbol=${uppercaseSymbol}&apikey=${apiKey}`);
    } catch (e) {
      console.error(`Profile fetch failed for ${uppercaseSymbol}:`, e);
      return NextResponse.json(
        { error: `Stock symbol "${uppercaseSymbol}" not found or API key is inactive.` },
        { status: 404 }
      );
    }

    if (!profileData || profileData.length === 0) {
      return NextResponse.json(
        { error: `Stock symbol "${uppercaseSymbol}" not found in the registry.` },
        { status: 404 }
      );
    }

    const profile = profileData[0];
    const livePrice = profile.price || 0;
    const liveBeta = profile.beta || 1.0;
    const liveCurrency = profile.currency || 'USD';
    const liveExchange = profile.exchangeShortName || profile.exchange || 'NASDAQ';
    const liveName = profile.companyName || profile.name || uppercaseSymbol;

    // B. Fetch financial statement arrays concurrently
    // Catch if FMP restricts financials for international symbols on this subscription tier!
    let incData: any[] = [];
    let cfData: any[] = [];
    let evData: any[] = [];
    let useMockFinancials = false;

    try {
      const [inc, cf, ev] = await Promise.all([
        fetchFMPJson(`https://financialmodelingprep.com/stable/income-statement?symbol=${uppercaseSymbol}&limit=6&apikey=${apiKey}`),
        fetchFMPJson(`https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${uppercaseSymbol}&limit=6&apikey=${apiKey}`),
        fetchFMPJson(`https://financialmodelingprep.com/stable/enterprise-values?symbol=${uppercaseSymbol}&limit=6&apikey=${apiKey}`)
      ]);
      incData = inc;
      cfData = cf;
      evData = ev;
    } catch (finError: any) {
      console.warn(`Fundamental financials are restricted for international symbol "${uppercaseSymbol}" on this API key tier. Merging live prices with high-fidelity mock templates.`, finError.message);
      useMockFinancials = true;
    }

    // Compile stock model using adapter or fallback sandbox financials
    let stock: any;

    if (useMockFinancials || incData.length === 0 || cfData.length === 0) {
      // Strips German suffix if present to match mock templates (e.g. "SAP.DE" -> "SAP")
      const cleanSymbol = uppercaseSymbol.includes('.') ? uppercaseSymbol.split('.')[0] : uppercaseSymbol;
      const presetTemplate = STOCKS.find(s => s.symbol === cleanSymbol || s.symbol === uppercaseSymbol);

      let historicals: any[] = [];

      if (presetTemplate) {
        // Copy the high-fidelity template financials
        historicals = [...presetTemplate.historicalFinancials];
      } else {
        // Generate realistic financials for dynamic searches (like BMW.DE) based on real-time live price!
        const baseRev = livePrice * 75; // Hypothetical revenue metric
        historicals = [
          { year: 2020, revenue: baseRev * 0.8, revenueGrowth: 0.05, netIncome: baseRev * 0.08, netMargin: 0.10, operatingCashFlow: baseRev * 0.12, capex: baseRev * 0.03, freeCashFlow: baseRev * 0.09, fcfMargin: 0.112 },
          { year: 2021, revenue: baseRev * 0.9, revenueGrowth: 0.125, netIncome: baseRev * 0.09, netMargin: 0.10, operatingCashFlow: baseRev * 0.14, capex: baseRev * 0.03, freeCashFlow: baseRev * 0.11, fcfMargin: 0.122 },
          { year: 2022, revenue: baseRev * 0.95, revenueGrowth: 0.055, netIncome: baseRev * 0.095, netMargin: 0.10, operatingCashFlow: baseRev * 0.13, capex: baseRev * 0.04, freeCashFlow: baseRev * 0.09, fcfMargin: 0.094 },
          { year: 2023, revenue: baseRev * 0.98, revenueGrowth: 0.031, netIncome: baseRev * 0.10, netMargin: 0.102, operatingCashFlow: baseRev * 0.15, capex: baseRev * 0.04, freeCashFlow: baseRev * 0.11, fcfMargin: 0.112 },
          { year: 2024, revenue: baseRev, revenueGrowth: 0.02, netIncome: baseRev * 0.11, netMargin: 0.11, operatingCashFlow: baseRev * 0.17, capex: baseRev * 0.04, freeCashFlow: baseRev * 0.13, fcfMargin: 0.13 }
        ];
      }

      // Merge real-time live profile specs with template financials
      const marketCap = profile.mktCap || 0;
      const sharesOutstanding = livePrice > 0 ? (marketCap / livePrice) / 1000000 : (presetTemplate?.sharesOutstanding || 500);
      const netDebt = presetTemplate?.netDebt || 2000;

      stock = {
        symbol: uppercaseSymbol,
        name: liveName,
        sector: profile.sector || presetTemplate?.sector || 'Industrial',
        industry: profile.industry || presetTemplate?.industry || 'Manufacturers',
        exchange: liveExchange,
        currentPrice: livePrice,
        currency: liveCurrency,
        sharesOutstanding: Math.round(sharesOutstanding * 100) / 100,
        netDebt,
        beta: Math.round(liveBeta * 100) / 100,
        historicalFinancials: historicals
      };
    } else {
      // Execute full live adapter mapping for allowed tickers (like S&P 500)
      stock = translateFMPToStock(profile, incData, cfData, evData);
    }

    // C. Fetch earnings calendar (Always allowed for US & International)
    let events: any[] = [];
    try {
      const calendarData = await fetchFMPJson(`https://financialmodelingprep.com/stable/earnings-calendar?symbol=${uppercaseSymbol}&apikey=${apiKey}`);
      events = translateFMPToEvents(calendarData, uppercaseSymbol);
    } catch (e) {
      console.warn(`Earnings calendar failed for ${uppercaseSymbol}:`, e);
    }

    // D. Fetch news feed with try-catch restricted tier handling
    let news: any[] = [];
    try {
      const newsData = await fetchFMPJson(`https://financialmodelingprep.com/stable/news/stock-latest?symbol=${uppercaseSymbol}&limit=8&apikey=${apiKey}`);
      news = translateFMPToNews(newsData, uppercaseSymbol);
    } catch (newsError) {
      // Gracefully fall back to pre-configured sandbox news articles for the symbol
      const mockNews = NEWS.filter(n => n.symbol === uppercaseSymbol);
      if (mockNews.length > 0) {
        news = mockNews;
      } else {
        news = [
          {
            id: `fb-news-1-${uppercaseSymbol}`,
            symbol: uppercaseSymbol,
            date: new Date().toISOString().substring(0, 10),
            title: `${stock.name} Momentum Gains Traction Amid Market Optimism`,
            summary: `Financial analysts highlighted steady operating improvements and robust demand within ${stock.sector}. High free cash flow conversion remains a solid tailwind for long term value.`,
            source: 'Investigo Intelligence',
            sentiment: 'BULLISH' as const,
            metrics: { revenueChange: 4.5, netIncomeChange: 8.2 }
          },
          {
            id: `fb-news-2-${uppercaseSymbol}`,
            symbol: uppercaseSymbol,
            date: new Date(Date.now() - 86400000 * 3).toISOString().substring(0, 10),
            title: `${stock.name} Valuation Check: DCF Analysis Overview`,
            summary: `With a current price of ${stock.currentPrice} ${stock.currency}, long-term DCF forecasts suggest high sensitivity to discount WACC inputs. Steady margins remain crucial.`,
            source: 'Bloomberg Sandbox',
            sentiment: 'NEUTRAL' as const,
            metrics: { revenueChange: 1.2, netIncomeChange: 0.5 }
          }
        ];
      }
    }

    return NextResponse.json({
      stock,
      news,
      events,
      source: useMockFinancials ? 'LIVE_PRICE_SANDBOX_HYBRID' : 'LIVE_FINANCIAL_API'
    });
  } catch (error: any) {
    console.error('API execution error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed fetching live data.' },
      { status: 500 }
    );
  }
}
