export interface RateCutProbability {
  changeBps: number; // e.g. -50, -25, 0 (Pause), 25
  label: string; // e.g. "-50 bps", "-25 bps", "Pause"
  probability: number; // e.g. 0.65 for 65%
}

export interface QuarterlyProbability {
  quarter: string; // e.g. "Q3 2026"
  meetingDate: string; // e.g. "Sept 17, 2026"
  probabilities: RateCutProbability[];
}

export interface CentralBank {
  name: string;
  acronym: string;
  currentRate: number;
  lastMeeting: string;
  nextMeeting: string;
  sentiment: 'HAWKISH' | 'NEUTRAL' | 'DOVISH';
  tendency: string; // Rate direction description (e.g. "Gradual Cuts")
  quarters: QuarterlyProbability[];
}

export interface CommodityPrice {
  name: string;
  symbol: string;
  category: 'CONSTRUCTION' | 'ENERGY' | 'PRECIOUS_METALS';
  price: number;
  unit: string;
  changeYtd: number; // e.g. 0.082 for +8.2%
  valuationState: 'UNDERVALUED' | 'FAIR' | 'OVERVALUED';
  realEstateImpact: string; // How this commodity price affects the housing industry
}

export interface RealEstateIndex {
  name: string;
  value: number;
  unit: string;
  changeYoY: number; // e.g. -0.045 for -4.5%
  description: string;
}
