import { CentralBank, CommodityPrice, RealEstateIndex } from '../types/macro';

export const CENTRAL_BANKS: CentralBank[] = [
  {
    name: 'Federal Reserve',
    acronym: 'FED',
    currentRate: 5.375, // Target range 5.25% - 5.50%
    lastMeeting: 'May 3, 2026',
    nextMeeting: 'June 17, 2026',
    sentiment: 'NEUTRAL',
    tendency: 'Gradual easing expected starting late Summer 2026.',
    quarters: [
      {
        quarter: 'Q2 2026',
        meetingDate: 'June 17, 2026',
        probabilities: [
          { changeBps: -50, label: '-50 bps', probability: 0.02 },
          { changeBps: -25, label: '-25 bps', probability: 0.18 },
          { changeBps: 0, label: 'Pause', probability: 0.78 },
          { changeBps: 25, label: '+25 bps', probability: 0.02 }
        ]
      },
      {
        quarter: 'Q3 2026',
        meetingDate: 'Sept 16, 2026',
        probabilities: [
          { changeBps: -50, label: '-50 bps', probability: 0.15 },
          { changeBps: -25, label: '-25 bps', probability: 0.65 },
          { changeBps: 0, label: 'Pause', probability: 0.18 },
          { changeBps: 25, label: '+25 bps', probability: 0.02 }
        ]
      },
      {
        quarter: 'Q4 2026',
        meetingDate: 'Dec 16, 2026',
        probabilities: [
          { changeBps: -75, label: '-75 bps', probability: 0.10 },
          { changeBps: -50, label: '-50 bps', probability: 0.55 },
          { changeBps: -25, label: '-25 bps', probability: 0.30 },
          { changeBps: 0, label: 'Pause', probability: 0.05 }
        ]
      },
      {
        quarter: 'Q1 2027',
        meetingDate: 'Feb 3, 2027',
        probabilities: [
          { changeBps: -100, label: '-100 bps', probability: 0.08 },
          { changeBps: -75, label: '-75 bps', probability: 0.42 },
          { changeBps: -50, label: '-50 bps', probability: 0.40 },
          { changeBps: -25, label: '-25 bps', probability: 0.10 }
        ]
      }
    ]
  },
  {
    name: 'European Central Bank',
    acronym: 'ECB',
    currentRate: 4.00, // Deposit facility rate
    lastMeeting: 'April 23, 2026',
    nextMeeting: 'June 4, 2026',
    sentiment: 'DOVISH',
    tendency: 'Active rate-cut cycle to support sluggish Eurozone growth.',
    quarters: [
      {
        quarter: 'Q2 2026',
        meetingDate: 'June 4, 2026',
        probabilities: [
          { changeBps: -50, label: '-50 bps', probability: 0.05 },
          { changeBps: -25, label: '-25 bps', probability: 0.82 },
          { changeBps: 0, label: 'Pause', probability: 0.13 }
        ]
      },
      {
        quarter: 'Q3 2026',
        meetingDate: 'Sept 10, 2026',
        probabilities: [
          { changeBps: -75, label: '-75 bps', probability: 0.12 },
          { changeBps: -50, label: '-50 bps', probability: 0.68 },
          { changeBps: -25, label: '-25 bps', probability: 0.18 },
          { changeBps: 0, label: 'Pause', probability: 0.02 }
        ]
      },
      {
        quarter: 'Q4 2026',
        meetingDate: 'Dec 10, 2026',
        probabilities: [
          { changeBps: -100, label: '-100 bps', probability: 0.22 },
          { changeBps: -75, label: '-75 bps', probability: 0.58 },
          { changeBps: -50, label: '-50 bps', probability: 0.18 },
          { changeBps: -25, label: '-25 bps', probability: 0.02 }
        ]
      },
      {
        quarter: 'Q1 2027',
        meetingDate: 'Jan 28, 2027',
        probabilities: [
          { changeBps: -125, label: '-125 bps', probability: 0.15 },
          { changeBps: -100, label: '-100 bps', probability: 0.50 },
          { changeBps: -75, label: '-75 bps', probability: 0.30 },
          { changeBps: -50, label: '-50 bps', probability: 0.05 }
        ]
      }
    ]
  },
  {
    name: 'Bank of England',
    acronym: 'BOE',
    currentRate: 5.25,
    lastMeeting: 'May 7, 2026',
    nextMeeting: 'June 18, 2026',
    sentiment: 'NEUTRAL',
    tendency: 'Gradual cuts expected as inflation stabilizes near 2% target.',
    quarters: [
      {
        quarter: 'Q2 2026',
        meetingDate: 'June 18, 2026',
        probabilities: [
          { changeBps: -25, label: '-25 bps', probability: 0.35 },
          { changeBps: 0, label: 'Pause', probability: 0.62 },
          { changeBps: 25, label: '+25 bps', probability: 0.03 }
        ]
      },
      {
        quarter: 'Q3 2026',
        meetingDate: 'Sept 17, 2026',
        probabilities: [
          { changeBps: -50, label: '-50 bps', probability: 0.20 },
          { changeBps: -25, label: '-25 bps', probability: 0.58 },
          { changeBps: 0, label: 'Pause', probability: 0.22 }
        ]
      },
      {
        quarter: 'Q4 2026',
        meetingDate: 'Dec 17, 2026',
        probabilities: [
          { changeBps: -75, label: '-75 bps', probability: 0.15 },
          { changeBps: -50, label: '-50 bps', probability: 0.52 },
          { changeBps: -25, label: '-25 bps', probability: 0.30 },
          { changeBps: 0, label: 'Pause', probability: 0.03 }
        ]
      },
      {
        quarter: 'Q1 2027',
        meetingDate: 'Feb 4, 2027',
        probabilities: [
          { changeBps: -100, label: '-100 bps', probability: 0.12 },
          { changeBps: -75, label: '-75 bps', probability: 0.48 },
          { changeBps: -50, label: '-50 bps', probability: 0.35 },
          { changeBps: -25, label: '-25 bps', probability: 0.05 }
        ]
      }
    ]
  },
  {
    name: 'Swiss National Bank',
    acronym: 'SNB',
    currentRate: 1.25,
    lastMeeting: 'March 20, 2026',
    nextMeeting: 'June 18, 2026',
    sentiment: 'DOVISH',
    tendency: 'Switzerland leads rate cuts due to low inflation and strong Swiss Franc.',
    quarters: [
      {
        quarter: 'Q2 2026',
        meetingDate: 'June 18, 2026',
        probabilities: [
          { changeBps: -25, label: '-25 bps', probability: 0.70 },
          { changeBps: 0, label: 'Pause', probability: 0.30 }
        ]
      },
      {
        quarter: 'Q3 2026',
        meetingDate: 'Sept 24, 2026',
        probabilities: [
          { changeBps: -50, label: '-50 bps', probability: 0.40 },
          { changeBps: -25, label: '-25 bps', probability: 0.55 },
          { changeBps: 0, label: 'Pause', probability: 0.05 }
        ]
      },
      {
        quarter: 'Q4 2026',
        meetingDate: 'Dec 17, 2026',
        probabilities: [
          { changeBps: -75, label: '-75 bps', probability: 0.15 },
          { changeBps: -50, label: '-50 bps', probability: 0.65 },
          { changeBps: -25, label: '-25 bps', probability: 0.20 }
        ]
      },
      {
        quarter: 'Q1 2027',
        meetingDate: 'March 18, 2027',
        probabilities: [
          { changeBps: -75, label: '-75 bps', probability: 0.45 },
          { changeBps: -50, label: '-50 bps', probability: 0.45 },
          { changeBps: -25, label: '-25 bps', probability: 0.10 }
        ]
      }
    ]
  }
];

export const COMMODITIES: CommodityPrice[] = [
  {
    name: 'Framing Lumber',
    symbol: 'LBS',
    category: 'CONSTRUCTION',
    price: 524.50,
    unit: '1,000 Board Feet',
    changeYtd: 0.081,
    valuationState: 'FAIR',
    realEstateImpact: 'Directly impacts wood-framing building costs for residential family homes. High volatility.'
  },
  {
    name: 'Hot-Rolled Steel Coil',
    symbol: 'STEEL',
    category: 'CONSTRUCTION',
    price: 810.00,
    unit: 'Short Ton',
    changeYtd: -0.065,
    valuationState: 'UNDERVALUED',
    realEstateImpact: 'Crucial for commercial high-rise reinforcement structures, rebars, concrete foundations, and roofing.'
  },
  {
    name: 'COMEX Copper',
    symbol: 'COPPER',
    category: 'CONSTRUCTION',
    price: 4.54,
    unit: 'Pound (lb)',
    changeYtd: 0.168,
    valuationState: 'OVERVALUED',
    realEstateImpact: 'Drives pricing for plumbing pipes, electrical wiring, HVAC units, and smart grid integrations. Rising demand.'
  },
  {
    name: 'Crude Oil (WTI)',
    symbol: 'OIL',
    category: 'ENERGY',
    price: 78.40,
    unit: 'Barrel (bbl)',
    changeYtd: 0.052,
    valuationState: 'FAIR',
    realEstateImpact: 'Drives global freight logistics shipping costs, asphalt road construction, and plastic insulation piping.'
  },
  {
    name: 'Gold (COMEX)',
    symbol: 'GOLD',
    category: 'PRECIOUS_METALS',
    price: 2320.00,
    unit: 'Troy Ounce',
    changeYtd: 0.145,
    valuationState: 'OVERVALUED',
    realEstateImpact: 'Acts as a macroeconomic inflation hedge and safe-haven asset, highly inversely correlated to real interest yields.'
  }
];

export const REAL_ESTATE_METRICS: RealEstateIndex[] = [
  {
    name: 'US 30-Year Fixed Mortgage Rate',
    value: 6.94,
    unit: '%',
    changeYoY: 0.048,
    description: 'Average interest rate for US long-term residential housing buyers. High levels pressure affordability.'
  },
  {
    name: 'German 10-Year Fixed Bauzinsen',
    value: 3.42,
    unit: '%',
    changeYoY: -0.085,
    description: 'Average 10-year mortgage yield for German home builders. Off Peak (4.2%) but remains elevated vs 2021.'
  },
  {
    name: 'Residential REIT P/FFO Multiple',
    value: 16.4,
    unit: 'x',
    changeYoY: -0.125,
    description: 'Price to Funds From Operations ratio for major residential landlords. Trading below historical average (20x).'
  },
  {
    name: 'Case-Shiller US Housing Price Index',
    value: 326.4,
    unit: 'Points',
    changeYoY: 0.064,
    description: 'Leading index tracking single-family home prices nationwide. Remains near record highs due to tight inventory.'
  }
];
