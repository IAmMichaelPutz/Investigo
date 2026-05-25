import { Stock, DCFAssumptions, DCFResult, ProjectedYear } from '../types';

/**
 * Calculates the Discounted Cash Flow (DCF) valuation of a stock.
 * 
 * Formulas used:
 * - Revenue(t) = Revenue(t-1) * (1 + GrowthRate(t))
 * - Free Cash Flow(t) = Revenue(t) * FCFMargin(t)
 * - Discount Factor(t) = 1 / (1 + WACC)^t
 * - Discounted FCF(t) = Free Cash Flow(t) * Discount Factor(t)
 * - Terminal Value = FCF(n) * (1 + g) / (WACC - g)
 * - Discounted Terminal Value = Terminal Value * Discount Factor(n)
 * - Enterprise Value = Sum(Discounted FCF(1..n)) + Discounted Terminal Value
 * - Equity Value = Enterprise Value - Net Debt
 * - Fair Value = Equity Value / Shares Outstanding
 * 
 * @param stock The stock details (historical financials, shares outstanding, net debt, etc.)
 * @param assumptions The user-customizable valuation assumptions
 * @returns DCFResult containing the full year-by-year projections and calculated intrinsic value
 */
export function calculateDCF(stock: Stock, assumptions: DCFAssumptions): DCFResult {
  const { wacc, terminalGrowthRate, projectionYears, customGrowthRates, customFCFMargins } = assumptions;
  
  // Safely grab the most recent historical financials as the baseline
  const historicals = stock.historicalFinancials;
  if (!historicals || historicals.length === 0) {
    throw new Error('Historical financials are required for DCF calculation.');
  }
  
  // Sort historicals by year ascending to get the latest
  const sortedHistoricals = [...historicals].sort((a, b) => a.year - b.year);
  const latestFinancials = sortedHistoricals[sortedHistoricals.length - 1];
  
  const baseRevenue = latestFinancials.revenue;
  const currentYear = latestFinancials.year;
  
  const projections: ProjectedYear[] = [];
  let cumulativePVOfFCFs = 0;
  
  let currentRevenue = baseRevenue;
  
  for (let i = 0; i < projectionYears; i++) {
    const yearIndex = i;
    const projectYear = currentYear + (i + 1);
    
    // Get growth rate and FCF margin for this specific year
    // Fallback to the last available custom rate/margin if the array is shorter than projectionYears
    const growthRate = customGrowthRates[yearIndex] !== undefined 
      ? customGrowthRates[yearIndex] 
      : (customGrowthRates[customGrowthRates.length - 1] || 0.05);
      
    const fcfMargin = customFCFMargins[yearIndex] !== undefined
      ? customFCFMargins[yearIndex]
      : (customFCFMargins[customFCFMargins.length - 1] || 0.10);
      
    // Financial Projections
    currentRevenue = currentRevenue * (1 + growthRate);
    const projectedFCF = currentRevenue * fcfMargin;
    
    // Discounting
    // discount factor = 1 / (1 + WACC)^t
    const discountFactor = 1 / Math.pow(1 + wacc, i + 1);
    const discountedFCF = projectedFCF * discountFactor;
    
    projections.push({
      year: projectYear,
      revenue: Math.round(currentRevenue * 100) / 100,
      revenueGrowth: growthRate,
      fcfMargin: fcfMargin,
      fcf: Math.round(projectedFCF * 100) / 100,
      discountFactor: Math.round(discountFactor * 10000) / 10000,
      discountedFCF: Math.round(discountedFCF * 100) / 100,
    });
    
    cumulativePVOfFCFs += discountedFCF;
  }
  
  const lastProjectedFCF = projections[projections.length - 1].fcf;
  
  // Terminal Value Calculation
  // Terminal Value = FCF_n * (1 + terminalGrowthRate) / (WACC - terminalGrowthRate)
  // Prevent division by zero or negative denominator
  const denominator = wacc - terminalGrowthRate;
  const safeDenominator = denominator <= 0 ? 0.01 : denominator;
  
  const terminalValue = (lastProjectedFCF * (1 + terminalGrowthRate)) / safeDenominator;
  
  // Discounted Terminal Value
  // Discounted TV = Terminal Value / (1 + WACC)^n
  const finalDiscountFactor = projections[projections.length - 1].discountFactor;
  const discountedTerminalValue = terminalValue * finalDiscountFactor;
  
  // Valuation Summation
  const enterpriseValue = cumulativePVOfFCFs + discountedTerminalValue;
  
  // Equity Value = Enterprise Value - Net Debt
  // Note: if Net Debt is negative (meaning company has net cash), subtracting net debt correctly increases equity value!
  const equityValue = enterpriseValue - stock.netDebt;
  
  // Fair Value per Share = Equity Value / Shares Outstanding
  const safeShares = stock.sharesOutstanding <= 0 ? 1 : stock.sharesOutstanding;
  const fairValue = equityValue / safeShares;
  
  // Margin of Safety = (Fair Value - Current Price) / Fair Value
  const marginOfSafety = fairValue > 0 ? (fairValue - stock.currentPrice) / fairValue : 0;
  
  return {
    projections,
    terminalValue: Math.round(terminalValue * 100) / 100,
    discountedTerminalValue: Math.round(discountedTerminalValue * 100) / 100,
    pvOfFreeCashFlows: Math.round(cumulativePVOfFCFs * 100) / 100,
    enterpriseValue: Math.round(enterpriseValue * 100) / 100,
    equityValue: Math.round(equityValue * 100) / 100,
    fairValue: Math.round(fairValue * 100) / 100,
    marginOfSafety: Math.round(marginOfSafety * 1000) / 1000,
    isUndervalued: fairValue > stock.currentPrice,
  };
}
