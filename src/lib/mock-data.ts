import { Stock, StockEvent, NewsArticle } from '../types';

export const STOCKS: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    exchange: 'NASDAQ',
    currentPrice: 178.50,
    currency: 'USD',
    sharesOutstanding: 15460, // 15.46 Billion shares
    netDebt: 65000, // $65 Billion (Cash ~$160B, Total Debt ~$225B)
    beta: 1.28,
    historicalFinancials: [
      { year: 2020, revenue: 274515, revenueGrowth: 0.055, netIncome: 57411, netMargin: 0.209, operatingCashFlow: 80674, capex: 7309, freeCashFlow: 73365, fcfMargin: 0.267 },
      { year: 2021, revenue: 365817, revenueGrowth: 0.333, netIncome: 94680, netMargin: 0.259, operatingCashFlow: 104038, capex: 9743, freeCashFlow: 94295, fcfMargin: 0.258 },
      { year: 2022, revenue: 394328, revenueGrowth: 0.078, netIncome: 99803, netMargin: 0.253, operatingCashFlow: 122151, capex: 10708, freeCashFlow: 111443, fcfMargin: 0.283 },
      { year: 2023, revenue: 383285, revenueGrowth: -0.028, netIncome: 96995, netMargin: 0.253, operatingCashFlow: 110543, capex: 10959, freeCashFlow: 99584, fcfMargin: 0.260 },
      { year: 2024, revenue: 391035, revenueGrowth: 0.020, netIncome: 100445, netMargin: 0.257, operatingCashFlow: 116433, capex: 10400, freeCashFlow: 106033, fcfMargin: 0.271 }
    ]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    exchange: 'NASDAQ',
    currentPrice: 415.60,
    currency: 'USD',
    sharesOutstanding: 7430, // 7.43 Billion
    netDebt: -45000, // -$45 Billion (Net Cash position!)
    beta: 1.15,
    historicalFinancials: [
      { year: 2020, revenue: 143015, revenueGrowth: 0.136, netIncome: 44281, netMargin: 0.310, operatingCashFlow: 60675, capex: 15441, freeCashFlow: 45234, fcfMargin: 0.316 },
      { year: 2021, revenue: 168088, revenueGrowth: 0.175, netIncome: 61271, netMargin: 0.365, operatingCashFlow: 76740, capex: 20622, freeCashFlow: 56118, fcfMargin: 0.334 },
      { year: 2022, revenue: 198270, revenueGrowth: 0.180, netIncome: 72738, netMargin: 0.367, operatingCashFlow: 89035, capex: 23886, freeCashFlow: 65149, fcfMargin: 0.329 },
      { year: 2023, revenue: 211915, revenueGrowth: 0.069, netIncome: 72361, netMargin: 0.341, operatingCashFlow: 87582, capex: 28107, freeCashFlow: 59475, fcfMargin: 0.281 },
      { year: 2024, revenue: 245120, revenueGrowth: 0.157, netIncome: 88140, netMargin: 0.360, operatingCashFlow: 110000, capex: 35000, freeCashFlow: 75000, fcfMargin: 0.306 }
    ]
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    exchange: 'NASDAQ',
    currentPrice: 945.00,
    currency: 'USD',
    sharesOutstanding: 2500, // 2.5 Billion
    netDebt: -18000, // -$18 Billion (Net Cash)
    beta: 1.69,
    historicalFinancials: [
      { year: 2020, revenue: 10918, revenueGrowth: -0.068, netIncome: 2796, netMargin: 0.256, operatingCashFlow: 4761, capex: 489, freeCashFlow: 4272, fcfMargin: 0.391 },
      { year: 2021, revenue: 16675, revenueGrowth: 0.527, netIncome: 4332, netMargin: 0.260, operatingCashFlow: 5822, capex: 893, freeCashFlow: 4929, fcfMargin: 0.296 },
      { year: 2022, revenue: 26914, revenueGrowth: 0.614, netIncome: 9752, netMargin: 0.362, operatingCashFlow: 9108, capex: 1025, freeCashFlow: 8083, fcfMargin: 0.300 },
      { year: 2023, revenue: 26974, revenueGrowth: 0.002, netIncome: 4368, netMargin: 0.162, operatingCashFlow: 5641, capex: 1833, freeCashFlow: 3808, fcfMargin: 0.141 },
      { year: 2024, revenue: 60922, revenueGrowth: 1.258, netIncome: 29760, netMargin: 0.488, operatingCashFlow: 28090, capex: 1046, freeCashFlow: 27044, fcfMargin: 0.444 }
    ]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    exchange: 'NASDAQ',
    currentPrice: 175.20,
    currency: 'USD',
    sharesOutstanding: 3180, // 3.18 Billion
    netDebt: -14000, // -$14 Billion (Net Cash)
    beta: 2.10,
    historicalFinancials: [
      { year: 2020, revenue: 31536, revenueGrowth: 0.283, netIncome: 721, netMargin: 0.023, operatingCashFlow: 5943, capex: 3157, freeCashFlow: 2786, fcfMargin: 0.088 },
      { year: 2021, revenue: 53823, revenueGrowth: 0.707, netIncome: 5519, netMargin: 0.103, operatingCashFlow: 11497, capex: 6482, freeCashFlow: 5015, fcfMargin: 0.093 },
      { year: 2022, revenue: 81462, revenueGrowth: 0.514, netIncome: 12587, netMargin: 0.155, operatingCashFlow: 14724, capex: 7158, freeCashFlow: 7566, fcfMargin: 0.093 },
      { year: 2023, revenue: 96773, revenueGrowth: 0.188, netIncome: 14997, netMargin: 0.155, operatingCashFlow: 13256, capex: 8899, freeCashFlow: 4357, fcfMargin: 0.045 },
      { year: 2024, revenue: 98500, revenueGrowth: 0.018, netIncome: 13500, netMargin: 0.137, operatingCashFlow: 12500, capex: 9000, freeCashFlow: 3500, fcfMargin: 0.036 }
    ]
  },
  {
    symbol: 'SAP',
    name: 'SAP SE',
    sector: 'Technology',
    industry: 'Software - Application',
    exchange: 'XETRA',
    currentPrice: 168.40,
    currency: 'EUR',
    sharesOutstanding: 1160, // 1.16 Billion
    netDebt: 8000, // €8 Billion (Cash ~$8B, Debt ~$16B)
    beta: 1.05,
    historicalFinancials: [
      { year: 2020, revenue: 27338, revenueGrowth: 0.007, netIncome: 5283, netMargin: 0.193, operatingCashFlow: 7196, capex: 1210, freeCashFlow: 5986, fcfMargin: 0.219 },
      { year: 2021, revenue: 27842, revenueGrowth: 0.018, netIncome: 5383, netMargin: 0.193, operatingCashFlow: 6221, capex: 1159, freeCashFlow: 5062, fcfMargin: 0.182 },
      { year: 2022, revenue: 30871, revenueGrowth: 0.109, netIncome: 2290, netMargin: 0.074, operatingCashFlow: 4376, capex: 1111, freeCashFlow: 3265, fcfMargin: 0.106 },
      { year: 2023, revenue: 31207, revenueGrowth: 0.011, netIncome: 5932, netMargin: 0.190, operatingCashFlow: 6257, capex: 1140, freeCashFlow: 5117, fcfMargin: 0.164 },
      { year: 2024, revenue: 33120, revenueGrowth: 0.061, netIncome: 6150, netMargin: 0.186, operatingCashFlow: 6800, capex: 1200, freeCashFlow: 5600, fcfMargin: 0.169 }
    ]
  }
];

export const EVENTS: StockEvent[] = [
  {
    id: 'e1',
    symbol: 'AAPL',
    type: 'EARNINGS',
    date: '2026-07-28',
    title: 'Q3 2026 Earnings Release',
    description: 'Release of financial results for the fiscal third quarter of 2026. Conference call starts at 5:00 PM ET.',
    impact: 'HIGH'
  },
  {
    id: 'e2',
    symbol: 'AAPL',
    type: 'DIVIDEND',
    date: '2026-06-12',
    title: 'Q2 Dividend Payout',
    description: 'Quarterly dividend payment of $0.25 per share. Record date is May 10, 2026.',
    impact: 'LOW'
  },
  {
    id: 'e3',
    symbol: 'MSFT',
    type: 'EARNINGS',
    date: '2026-07-25',
    title: 'Q4 2026 Earnings Release',
    description: 'Microsoft will announce fiscal Q4 2026 results. Key points: Azure growth rate and Copilot enterprise monetization.',
    impact: 'HIGH'
  },
  {
    id: 'e4',
    symbol: 'MSFT',
    type: 'AGM',
    date: '2026-11-18',
    title: 'Annual Shareholders Meeting',
    description: 'Voting on executive compensation, board members, and review of corporate roadmap.',
    impact: 'MEDIUM'
  },
  {
    id: 'e5',
    symbol: 'NVDA',
    type: 'EARNINGS',
    date: '2026-05-27',
    title: 'Q1 2027 Earnings Release',
    description: 'Nvidia reports Q1 2027 earnings. Massive interest in Blackwell chip production ramp and H100/H200 delivery timelines.',
    impact: 'HIGH'
  },
  {
    id: 'e6',
    symbol: 'TSLA',
    type: 'EARNINGS',
    date: '2026-07-19',
    title: 'Q2 2026 Earnings Release',
    description: 'Tesla will release financials for Q2 2026. Spotlights will be on delivery guidance, FSD pricing adjustments, and margins.',
    impact: 'HIGH'
  },
  {
    id: 'e7',
    symbol: 'TSLA',
    type: 'CONFERENCE',
    date: '2026-08-08',
    title: 'Robotaxi Reveal Event',
    description: 'Autonomous vehicle demo and release of the next-generation platform architecture.',
    impact: 'HIGH'
  },
  {
    id: 'e8',
    symbol: 'SAP',
    type: 'DIVIDEND',
    date: '2026-05-29',
    title: 'Annual Dividend Payment',
    description: 'Proposed dividend of €2.20 per share for the fiscal year 2025. Yield stands at roughly 1.3%.',
    impact: 'LOW'
  },
  {
    id: 'e9',
    symbol: 'SAP',
    type: 'EARNINGS',
    date: '2026-07-22',
    title: 'Q2 2026 Financial Results',
    description: 'SAP SE publishes its second-quarter report. Strong focus on Cloud ERP Suite annual recurring revenue growth.',
    impact: 'HIGH'
  }
];

export const NEWS: NewsArticle[] = [
  {
    id: 'n1',
    symbol: 'NVDA',
    date: '2026-05-24',
    title: 'NVIDIA Announces Record Revenue in Latest Earnings Call',
    summary: 'Nvidia beat estimates with revenue rising 125% YoY to $60.9B, driven by explosive demand for AI computing infrastructure. Net income skyrocketed 240% to $29.7B as operating margins expanded.',
    source: 'Financial Times',
    sentiment: 'BULLISH',
    metrics: {
      revenueChange: 125.8,
      netIncomeChange: 240.5,
      eps: 11.90,
      epsEstimate: 10.75
    }
  },
  {
    id: 'n2',
    symbol: 'AAPL',
    date: '2026-05-20',
    title: 'Apple Q2 Earnings: Service Revenue Reaches Record High',
    summary: 'Apple reported positive service numbers (+12% YoY) offset by slight declines in iPhone hardware sales. Total revenue for the year 2024 stood at $391.0B, up 2% YoY, while FCF remained solid at $106.0B.',
    source: 'Bloomberg',
    sentiment: 'NEUTRAL',
    metrics: {
      revenueChange: 2.0,
      netIncomeChange: 3.5,
      eps: 6.49,
      epsEstimate: 6.42
    }
  },
  {
    id: 'n3',
    symbol: 'MSFT',
    date: '2026-04-28',
    title: 'Microsoft Surpasses Wall Street Targets Driven by Cloud Strength',
    summary: 'Microsoft announced stellar results with Q3 revenue up 15.7% to $245.1B for the trailing twelve months. Azure cloud service growth accelerated to 31%, beating analyst consensus.',
    source: 'Wall Street Journal',
    sentiment: 'BULLISH',
    metrics: {
      revenueChange: 15.7,
      netIncomeChange: 21.8,
      eps: 11.86,
      epsEstimate: 11.45
    }
  },
  {
    id: 'n4',
    symbol: 'TSLA',
    date: '2026-04-25',
    title: 'Tesla Faces Delivery Headwinds but Energy Storage Surges',
    summary: 'Tesla quarterly revenue growth slowed to 1.8% YoY ($98.5B for FY 2024), impacted by gigafactory temporary shutdowns and logistics bottlenecks. However, energy storage deployment grew 120%.',
    source: 'Reuters',
    sentiment: 'BEARISH',
    metrics: {
      revenueChange: 1.8,
      netIncomeChange: -10.0,
      eps: 4.25,
      epsEstimate: 4.60
    }
  },
  {
    id: 'n5',
    symbol: 'SAP',
    date: '2026-04-22',
    title: 'SAP Cloud Transformation Accelerates; Raises Full-Year Outlook',
    summary: 'SAP reported a solid 6.1% revenue growth to €33.1B, led by Cloud ERP business expansion (+25%). Under its restructuring program, SAP expects further margin improvement in 2026.',
    source: 'Handelsblatt',
    sentiment: 'BULLISH',
    metrics: {
      revenueChange: 6.1,
      netIncomeChange: 8.5,
      eps: 5.30,
      epsEstimate: 5.15
    }
  }
];

export function getStock(symbol: string): Stock | undefined {
  return STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
}

export function getNewsForStock(symbol: string): NewsArticle[] {
  return NEWS.filter(n => n.symbol.toUpperCase() === symbol.toUpperCase());
}

export function getEventsForStock(symbol: string): StockEvent[] {
  return EVENTS.filter(e => e.symbol.toUpperCase() === symbol.toUpperCase());
}
