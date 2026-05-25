export interface HistoricalFinancials {
  year: number;
  revenue: number; // in millions
  revenueGrowth: number; // e.g. 0.15 for 15%
  netIncome: number; // in millions
  netMargin: number; // e.g. 0.12 for 12%
  operatingCashFlow: number; // in millions
  capex: number; // in millions
  freeCashFlow: number; // in millions
  fcfMargin: number; // e.g. 0.10 for 10%
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  currentPrice: number;
  currency: string;
  sharesOutstanding: number; // in millions
  netDebt: number; // in millions (total debt - cash)
  beta: number;
  historicalFinancials: HistoricalFinancials[];
}

export interface StockEvent {
  id: string;
  symbol: string;
  type: 'EARNINGS' | 'DIVIDEND' | 'AGM' | 'CONFERENCE';
  date: string; // ISO date string YYYY-MM-DD
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NewsArticle {
  id: string;
  symbol: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  metrics?: {
    revenueChange?: number; // YoY percentage, e.g. 18.5
    netIncomeChange?: number; // YoY percentage, e.g. 24.2
    eps?: number;
    epsEstimate?: number;
  };
}

export interface DCFAssumptions {
  wacc: number; // Weighted Average Cost of Capital, e.g. 0.085 (8.5%)
  terminalGrowthRate: number; // e.g. 0.02 (2%)
  projectionYears: number; // usually 5 or 10
  customGrowthRates: number[]; // custom revenue growth rate per projected year
  customFCFMargins: number[]; // custom FCF margin per projected year
}

export interface ProjectedYear {
  year: number;
  revenue: number;
  revenueGrowth: number;
  fcfMargin: number;
  fcf: number;
  discountFactor: number;
  discountedFCF: number;
}

export interface DCFResult {
  projections: ProjectedYear[];
  terminalValue: number;
  discountedTerminalValue: number;
  pvOfFreeCashFlows: number;
  enterpriseValue: number;
  equityValue: number;
  fairValue: number;
  marginOfSafety: number; // difference in % vs current price
  isUndervalued: boolean;
}

export interface PortfolioTransaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  date: string;
  price: number;
  quantity: number;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  totalGain: number;
  totalGainPercentage: number;
}
