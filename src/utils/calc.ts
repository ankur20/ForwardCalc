// SIP calculation output structure
export interface SipResult {
  totalInvested: number;
  wealthGained: number;
  futureValue: number;
  yearlyData: { year: number; invested: number; totalValue: number }[];
}

export const calculateSip = (monthly: number, rate: number, years: number): SipResult => {
  const r = rate / 12 / 100;
  const n = years * 12;
  const yearlyData: { year: number; invested: number; totalValue: number }[] = [];

  let accumulated = 0;
  let invested = 0;

  for (let month = 1; month <= n; month++) {
    invested += monthly;
    accumulated = (accumulated + monthly) * (1 + r);

    // Record data at the end of each year
    if (month % 12 === 0) {
      yearlyData.push({
        year: month / 12,
        invested: Math.round(invested),
        totalValue: Math.round(accumulated),
      });
    }
  }

  return {
    totalInvested: Math.round(invested),
    wealthGained: Math.round(accumulated - invested),
    futureValue: Math.round(accumulated),
    yearlyData,
  };
};

// SWP calculation output structure
export interface SwpResult {
  totalWithdrawn: number;
  finalBalance: number;
  monthsLasted: number;
  isDepleted: boolean;
  yearlyData: { year: number; balance: number; withdrawn: number }[];
}

export const calculateSwp = (pot: number, withdrawal: number, rate: number, years: number): SwpResult => {
  const r = rate / 12 / 100;
  const totalMonths = years * 12;
  const yearlyData: { year: number; balance: number; withdrawn: number }[] = [];

  let balance = pot;
  let totalWithdrawn = 0;
  let monthsLasted = 0;
  let isDepleted = false;

  for (let month = 1; month <= totalMonths; month++) {
    if (balance > 0) {
      // Add interest first, then deduct withdrawal
      balance = balance * (1 + r);
      const actualWithdrawal = Math.min(balance, withdrawal);
      balance -= actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
      monthsLasted++;

      if (balance <= 0) {
        balance = 0;
        isDepleted = true;
      }
    }

    if (month % 12 === 0 || month === totalMonths) {
      const yearNum = Math.ceil(month / 12);
      // Ensure we don't push duplicates for the last month if it aligns
      if (!yearlyData.some(d => d.year === yearNum)) {
        yearlyData.push({
          year: yearNum,
          balance: Math.round(balance),
          withdrawn: Math.round(totalWithdrawn),
        });
      }
    }
  }

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(balance),
    monthsLasted,
    isDepleted,
    yearlyData,
  };
};

// Mortgage calculation output structure
export interface MortgageResult {
  standardTotalInterest: number;
  overpaidTotalInterest: number;
  interestSaved: number;
  timeSavedYears: number;
  timeSavedMonths: number;
  standardTermMonths: number;
  overpaidTermMonths: number;
  amortizationData: { year: number; standardBalance: number; overpaidBalance: number }[];
}

export const calculateMortgage = (
  balance: number,
  rate: number,
  termYears: number,
  overpaymentMonthly: number,
  overpaymentOneOff: number
): MortgageResult => {
  const r = rate / 12 / 100;
  const standardTermMonths = termYears * 12;

  // Monthly Standard Payment Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const standardPayment =
    r === 0
      ? balance / standardTermMonths
      : (balance * (r * Math.pow(1 + r, standardTermMonths))) /
        (Math.pow(1 + r, standardTermMonths) - 1);

  // Simulation 1: Standard
  let standardBal = balance;
  let standardTotalInterest = 0;

  for (let m = 1; m <= standardTermMonths; m++) {
    const interest = standardBal * r;
    const principal = standardPayment - interest;
    standardTotalInterest += interest;
    standardBal -= principal;
  }

  // Simulation 2: Overpayments
  let overpaidBal = balance - overpaymentOneOff;
  if (overpaidBal < 0) overpaidBal = 0;
  let overpaidTotalInterest = 0;
  let overpaidTermMonths = 0;
  const amortizationData: { year: number; standardBalance: number; overpaidBalance: number }[] = [];

  let tempStandardBal = balance;
  let tempOverpaidBal = overpaidBal;

  for (let m = 1; m <= standardTermMonths; m++) {
    // Standard path tracking for graph
    const stdInterest = tempStandardBal * r;
    const stdPrincipal = standardPayment - stdInterest;
    tempStandardBal = Math.max(0, tempStandardBal - stdPrincipal);

    // Overpaid path tracking for graph
    if (tempOverpaidBal > 0) {
      const interest = tempOverpaidBal * r;
      overpaidTotalInterest += interest;
      overpaidTermMonths++;

      // Paying standard amount + extra
      const extraPayment = standardPayment + overpaymentMonthly;
      const principal = Math.min(tempOverpaidBal, extraPayment - interest);
      tempOverpaidBal -= principal;
      if (tempOverpaidBal < 0) tempOverpaidBal = 0;
    }

    // Capture annual balances for visualization
    if (m % 12 === 0 || m === standardTermMonths) {
      amortizationData.push({
        year: Math.ceil(m / 12),
        standardBalance: Math.round(tempStandardBal),
        overpaidBalance: Math.round(tempOverpaidBal),
      });
    }
  }

  const interestSaved = Math.max(0, standardTotalInterest - overpaidTotalInterest);
  const monthsSaved = Math.max(0, standardTermMonths - overpaidTermMonths);
  const timeSavedYears = Math.floor(monthsSaved / 12);
  const timeSavedMonths = monthsSaved % 12;

  return {
    standardTotalInterest: Math.round(standardTotalInterest),
    overpaidTotalInterest: Math.round(overpaidTotalInterest),
    interestSaved: Math.round(interestSaved),
    timeSavedYears,
    timeSavedMonths,
    standardTermMonths,
    overpaidTermMonths,
    amortizationData,
  };
};

// FIRE calculation output structure
export interface FireResult {
  fireTarget: number;
  yearsToFire: number;
  projectedAge: number;
  isFeasible: boolean;
  yearlyBalances: { year: number; balance: number; target: number }[];
}

export const calculateFire = (
  currentAge: number,
  annualExpenses: number,
  currentWorth: number,
  monthlySavings: number,
  expectedRate: number
): FireResult => {
  const fireTarget = annualExpenses * 25; // 25x rule (4% safe withdrawal rate)
  const r = expectedRate / 12 / 100;
  const yearlyBalances: { year: number; balance: number; target: number }[] = [];

  let balance = currentWorth;
  let monthsToFire = -1;
  const maxYears = 50;

  for (let month = 1; month <= maxYears * 12; month++) {
    balance += monthlySavings;
    balance = balance * (1 + r);

    if (balance >= fireTarget && monthsToFire === -1) {
      monthsToFire = month;
    }

    if (month % 12 === 0) {
      yearlyBalances.push({
        year: month / 12,
        balance: Math.round(balance),
        target: fireTarget,
      });
    }
  }

  const yearsToFire = monthsToFire === -1 ? maxYears : Math.round((monthsToFire / 12) * 10) / 10;
  const projectedAge = Math.round((currentAge + (monthsToFire === -1 ? maxYears : yearsToFire)));

  return {
    fireTarget: Math.round(fireTarget),
    yearsToFire: monthsToFire === -1 ? maxYears : yearsToFire,
    projectedAge,
    isFeasible: monthsToFire !== -1,
    yearlyBalances,
  };
};

// UK Tax calculation output structure
export interface TaxResult {
  pensionContribution: number;
  taxableSalary: number;
  originalTax: number;
  newTax: number;
  originalNi: number;
  newNi: number;
  originalTakeHome: number;
  newTakeHome: number;
  takeHomeReduction: number; // what you lose in net pay
  pensionGain: number;       // what goes into your pension pot
  taxSaving: number;
  niSaving: number;
  leverageRatio: number;     // £ put in pension vs £ lost from take-home
}

export const calculateUkTax = (salary: number, pensionContributionPercent: number): TaxResult => {
  const pensionContribution = salary * (pensionContributionPercent / 100);
  const taxableSalaryOriginal = salary;
  const taxableSalaryNew = Math.max(0, salary - pensionContribution);

  // Internal helper to calculate UK 2026/27 Income Tax
  const getIncomeTax = (grossIncome: number): number => {
    // Tapered Personal Allowance (£12,570 decreases by £1 for every £2 of income above £100,000)
    let personalAllowance = 12570;
    if (grossIncome > 100000) {
      const taper = (grossIncome - 100000) / 2;
      personalAllowance = Math.max(0, personalAllowance - taper);
    }

    let remainingIncome = grossIncome;
    let tax = 0;

    // Personal Allowance Band (0% tax)
    const personalAllowanceTaxed = Math.min(remainingIncome, personalAllowance);
    remainingIncome -= personalAllowanceTaxed;

    // Basic Rate Band (20% tax on next £37,700)
    if (remainingIncome > 0) {
      const basicRateIncome = Math.min(remainingIncome, 37700);
      tax += basicRateIncome * 0.20;
      remainingIncome -= basicRateIncome;
    }

    // Higher Rate Band (40% tax on income between basic band and £125,140)
    // Note: Since personal allowance tapers, the actual threshold for 40% is grossIncome - personalAllowance
    // But basic rate band is always exactly £37,700 of taxable income.
    // Higher rate band goes up to £125,140 total income.
    const higherRateLimit = 125140;
    const currentThreshold = personalAllowance + 37700;
    
    if (grossIncome > currentThreshold) {
      const higherRateIncome = Math.min(grossIncome, higherRateLimit) - currentThreshold;
      if (higherRateIncome > 0) {
        tax += higherRateIncome * 0.40;
      }
    }

    // Additional Rate Band (45% tax on everything above £125,140)
    if (grossIncome > higherRateLimit) {
      tax += (grossIncome - higherRateLimit) * 0.45;
    }

    return tax;
  };

  // Internal helper to calculate UK 2026/27 Class 1 Employee National Insurance
  const getNationalInsurance = (grossIncome: number): number => {
    const primaryThreshold = 12570;
    const upperEarningsLimit = 50270;
    
    if (grossIncome <= primaryThreshold) return 0;
    
    let ni = 0;
    // 8% on earnings between £12,570 and £50,270
    const mainBandEarnings = Math.min(grossIncome, upperEarningsLimit) - primaryThreshold;
    if (mainBandEarnings > 0) {
      ni += mainBandEarnings * 0.08;
    }
    
    // 2% on earnings above £50,270
    if (grossIncome > upperEarningsLimit) {
      ni += (grossIncome - upperEarningsLimit) * 0.02;
    }
    
    return ni;
  };

  const originalTax = getIncomeTax(taxableSalaryOriginal);
  const newTax = getIncomeTax(taxableSalaryNew);

  const originalNi = getNationalInsurance(taxableSalaryOriginal);
  const newNi = getNationalInsurance(taxableSalaryNew);

  const originalTakeHome = taxableSalaryOriginal - originalTax - originalNi;
  const newTakeHome = taxableSalaryNew - newTax - newNi;

  const takeHomeReduction = originalTakeHome - newTakeHome;
  const pensionGain = pensionContribution; // assuming Salary Sacrifice match / tax relief inclusive
  
  const taxSaving = originalTax - newTax;
  const niSaving = originalNi - newNi;

  // Leverage ratio represents how much value goes into your pension pot for every £1 you give up in take-home pay
  // E.g., if you sacrifice £100 of take-home and get £166 in pension, leverage ratio is 1.66
  const leverageRatio = takeHomeReduction <= 0 ? 1 : Math.round((pensionGain / takeHomeReduction) * 100) / 100;

  return {
    pensionContribution: Math.round(pensionContribution),
    taxableSalary: Math.round(taxableSalaryNew),
    originalTax: Math.round(originalTax),
    newTax: Math.round(newTax),
    originalNi: Math.round(originalNi),
    newNi: Math.round(newNi),
    originalTakeHome: Math.round(originalTakeHome),
    newTakeHome: Math.round(newTakeHome),
    takeHomeReduction: Math.round(takeHomeReduction),
    pensionGain: Math.round(pensionGain),
    taxSaving: Math.round(taxSaving),
    niSaving: Math.round(niSaving),
    leverageRatio,
  };
};
