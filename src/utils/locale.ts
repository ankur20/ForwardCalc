export type LocaleType = 'in' | 'uk' | 'us' | 'fr' | 'de' | 'ar';

export interface LocaleConfig {
  localeCode: string;
  currency: string;
  currencySymbol: string;
  name: string;
  flag: string;
  
  // Tabs & Metadata
  tabs: {
    sip: { title: string; desc: string };
    swp: { title: string; desc: string };
    mortgage: { title: string; desc: string };
    fire: { title: string; desc: string };
    tax: { title: string; desc: string };
  };

  // General Text
  line: string;
  bar: string;
  start: string;
  yearShort: string;
  ageText: string;

  // SIP Calculator
  sipCalc: {
    title: string;
    lumpSumLabel: string;
    lumpSumMinMax: string;
    monthlyLabel: string;
    monthlyMinMax: string;
    rateLabel: string;
    rateMinMax: string;
    durationLabel: string;
    durationMinMax: string;
    infoBox: string;
    cardInvested: string;
    cardGrowth: string;
    cardTotal: string;
    tooltipInvested: string;
    tooltipTotal: string;
    chartTitle: string;
  };

  // SWP Calculator
  swpCalc: {
    title: string;
    potLabel: string;
    potMinMax: string;
    withdrawalLabel: string;
    withdrawalMinMax: string;
    rateLabel: string;
    rateMinMax: string;
    durationLabel: string;
    durationMinMax: string;
    infoBox: string;
    cardTotalWithdrawn: string;
    cardPotLasts: string;
    cardEndPot: string;
    infinitePot: string;
    depletionRisk: string;
    tooltipWithdrawn: string;
    tooltipRemaining: string;
    chartTitle: string;
    yearMonthFormat: string;
  };

  // Mortgage Calculator
  mortgageCalc: {
    title: string;
    balanceLabel: string;
    balanceMinMax: string;
    rateLabel: string;
    rateMinMax: string;
    durationLabel: string;
    durationMinMax: string;
    monthlyOverpayLabel: string;
    monthlyOverpayMinMax: string;
    lumpSumOverpayLabel: string;
    lumpSumOverpayMinMax: string;
    infoBox: string;
    cardSavedInterest: string;
    cardSavedTime: string;
    cardNewTerm: string;
    tooltipStandard: string;
    tooltipOverpaid: string;
    chartTitle: string;
  };

  // FIRE Calculator
  fireCalc: {
    title: string;
    ageLabel: string;
    ageMinMax: string;
    expensesLabel: string;
    expensesMinMax: string;
    expensesTooltip: string;
    netWorthLabel: string;
    netWorthMinMax: string;
    monthlySavingsLabel: string;
    monthlySavingsMinMax: string;
    rateLabel: string;
    rateMinMax: string;
    infoBox: string;
    cardFireNumber: string;
    cardYearsToFire: string;
    cardFireAge: string;
    tooltipNetWorth: string;
    tooltipFireTarget: string;
    chartTitle: string;
    notFeasible: string;
    naValue: string;
  };

  // Tax Optimizer
  taxCalc: {
    title: string;
    salaryLabel: string;
    salaryMinMax: string;
    currentPensionLabel: string;
    currentPensionMinMax: string;
    optimizedPensionLabel: string;
    optimizedPensionMinMax: string;
    infoBox: string;
    cardNetTakeHome: string;
    cardTotalPension: string;
    cardTaxSaved: string;
    headingBefore: string;
    headingAfter: string;
    labelGross: string;
    labelTax: string;
    labelNI: string;
    labelPension: string;
    labelNet: string;
    summaryText: string;
    optimiseButton: string;
  };
}

export const localeConfigs: Record<LocaleType, LocaleConfig> = {
  in: {
    localeCode: 'en-IN',
    currency: 'INR',
    currencySymbol: '₹',
    name: 'India',
    flag: '🇮🇳',
    tabs: {
      sip: { title: 'SIP Growth', desc: 'Compound regular savings' },
      swp: { title: 'Retirement SWP', desc: 'Systematic drawing plans' },
      mortgage: { title: 'Home Loan Overpay', desc: 'Clear property debt early' },
      fire: { title: 'FIRE Target', desc: 'Retire early milestone' },
      tax: { title: 'Salary Sacrifice', desc: 'UK pension tax optimization' },
    },
    line: 'Line',
    bar: 'Bar',
    start: 'Start',
    yearShort: 'Yr',
    ageText: 'Age',
    sipCalc: {
      title: 'SIP & Growth',
      lumpSumLabel: 'Initial Investment / Lump Sum',
      lumpSumMinMax: '₹0 (None) - ₹10L+',
      monthlyLabel: 'Monthly Investment',
      monthlyMinMax: '₹100 - ₹5L',
      rateLabel: 'Expected Annual Return',
      rateMinMax: '1% - 30%',
      durationLabel: 'Duration',
      durationMinMax: '1 Yr - 40 Yrs',
      infoBox: 'A Systematic Investment Plan (SIP) utilizes compound interest to build wealth over time by investing a fixed amount regularly.',
      cardInvested: 'Invested Amount',
      cardGrowth: 'Wealth Gained',
      cardTotal: 'Total Value',
      tooltipInvested: 'Invested',
      tooltipTotal: 'Total Value',
      chartTitle: 'Investment Growth Trajectory',
    },
    swpCalc: {
      title: 'Retirement SWP',
      potLabel: 'Starting Retirement Pot',
      potMinMax: '₹10k - ₹20Cr',
      withdrawalLabel: 'Monthly Withdrawal',
      withdrawalMinMax: '₹100 - ₹15L',
      rateLabel: 'Annual Growth Rate',
      rateMinMax: '1% - 15%',
      durationLabel: 'Simulation Period',
      durationMinMax: '5 Yrs - 40 Yrs',
      infoBox: 'A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed income from your retirement fund, while the remaining balance continues to grow.',
      cardTotalWithdrawn: 'Total Paid Out',
      cardPotLasts: 'Pot Lasts',
      cardEndPot: 'Final Balance',
      infinitePot: 'Infinite / Full',
      depletionRisk: 'Depletion Risk',
      tooltipWithdrawn: 'Withdrawn',
      tooltipRemaining: 'Remaining Pot',
      chartTitle: 'Retirement Capital Over Time',
      yearMonthFormat: '{y}y {m}m',
    },
    mortgageCalc: {
      title: 'Home Loan Overpay',
      balanceLabel: 'Home Loan Balance',
      balanceMinMax: '₹5L - ₹15Cr',
      rateLabel: 'Interest Rate',
      rateMinMax: '1% - 15%',
      durationLabel: 'Remaining Term',
      durationMinMax: '5 Yrs - 35 Yrs',
      monthlyOverpayLabel: 'Monthly Overpayment',
      monthlyOverpayMinMax: 'None - ₹5L/mo',
      lumpSumOverpayLabel: 'One-off Lump Sum (Month 1)',
      lumpSumOverpayMinMax: 'None - ₹10L',
      infoBox: 'Home loan overpayments directly reduce the principal balance, which exponentially cuts down the overall interest paid and shortens the tenure.',
      cardSavedInterest: 'Interest Saved',
      cardSavedTime: 'Time Saved',
      cardNewTerm: 'New Term',
      tooltipStandard: 'Standard Bal',
      tooltipOverpaid: 'Overpaid Bal',
      chartTitle: 'Debt Reduction Trajectory',
    },
    fireCalc: {
      title: 'FIRE Calculator',
      ageLabel: 'Current Age',
      ageMinMax: '18 - 65',
      expensesLabel: 'Retirement Annual Spend',
      expensesMinMax: '₹50k - ₹2.5Cr',
      expensesTooltip: 'Your estimated annual expenses once you retire, in today\'s money.',
      netWorthLabel: 'Current Net Worth',
      netWorthMinMax: '₹0 - ₹10Cr',
      monthlySavingsLabel: 'Monthly Savings',
      monthlySavingsMinMax: 'None - ₹15L/mo',
      rateLabel: 'Net Investment Return',
      rateMinMax: '1% - 15%',
      infoBox: 'FIRE stands for Financial Independence, Retire Early. The 25x target represents a 4% Safe Withdrawal Rate to cover your annual costs.',
      cardFireNumber: 'FIRE Target',
      cardYearsToFire: 'Years to FIRE',
      cardFireAge: 'FIRE Age',
      tooltipNetWorth: 'Net Worth',
      tooltipFireTarget: 'FIRE Target',
      chartTitle: 'Wealth Accumulation vs FIRE Target',
      notFeasible: '> 50 Yrs',
      naValue: 'N/A',
    },
    taxCalc: {
      title: 'Salary Sacrifice',
      salaryLabel: 'Annual Gross Salary',
      salaryMinMax: '£10k - £250k',
      currentPensionLabel: 'Current Pension Contribution',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'Optimized Pension Contribution',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'In the UK, salary sacrifice reduces income tax and National Insurance (NI) contributions. Note: This calculator is UK tax code focused.',
      cardNetTakeHome: 'Net Take Home',
      cardTotalPension: 'Total Pension Pot',
      cardTaxSaved: 'Tax Saved',
      headingBefore: 'Before Optimization',
      headingAfter: 'After Optimization',
      labelGross: 'Gross Salary',
      labelTax: 'Income Tax',
      labelNI: 'National Insurance',
      labelPension: 'Pension Contribution',
      labelNet: 'Net Take Home',
      summaryText: 'By increasing your sacrifice to {opt}%, you save {saved} in taxes and National Insurance, boosting your overall compound compensation.',
      optimiseButton: 'Auto-Optimise Sacrifice',
    },
  },
  uk: {
    localeCode: 'en-GB',
    currency: 'GBP',
    currencySymbol: '£',
    name: 'United Kingdom',
    flag: '🇬🇧',
    tabs: {
      sip: { title: 'Regular Savings', desc: 'Compound regular savings' },
      swp: { title: 'Pension Drawdown', desc: 'Systematic drawing plans' },
      mortgage: { title: 'Mortgage Overpay', desc: 'Clear property debt early' },
      fire: { title: 'FIRE Target', desc: 'Retire early milestone' },
      tax: { title: 'Tax Sacrifice', desc: 'Salary vs pension optimization' },
    },
    line: 'Line',
    bar: 'Bar',
    start: 'Start',
    yearShort: 'Yr',
    ageText: 'Age',
    sipCalc: {
      title: 'Regular Savings & Growth',
      lumpSumLabel: 'Initial Investment / Lump Sum',
      lumpSumMinMax: '£0 (None) - £1M',
      monthlyLabel: 'Monthly Investment',
      monthlyMinMax: '£10 - £5,000',
      rateLabel: 'Expected Annual Return',
      rateMinMax: '1% - 30%',
      durationLabel: 'Duration',
      durationMinMax: '1 Yr - 40 Yrs',
      infoBox: 'A regular savings plan utilizes compound interest to build wealth over time by investing a fixed amount regularly.',
      cardInvested: 'Invested',
      cardGrowth: 'Growth',
      cardTotal: 'Total Value',
      tooltipInvested: 'Invested',
      tooltipTotal: 'Total Value',
      chartTitle: 'Investment Growth Trajectory',
    },
    swpCalc: {
      title: 'Pension Drawdown SWP',
      potLabel: 'Starting Retirement Pot',
      potMinMax: '£10k - £2M',
      withdrawalLabel: 'Monthly Withdrawal',
      withdrawalMinMax: '£100 - £15,000',
      rateLabel: 'Annual Growth Rate',
      rateMinMax: '1% - 15%',
      durationLabel: 'Simulation Period',
      durationMinMax: '5 Yrs - 40 Yrs',
      infoBox: 'A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed income from your retirement fund, while the remaining balance continues to grow.',
      cardTotalWithdrawn: 'Total Pay',
      cardPotLasts: 'Pot Lasts',
      cardEndPot: 'End Pot',
      infinitePot: 'Infinite / Full',
      depletionRisk: 'Depletion Risk',
      tooltipWithdrawn: 'withdrawn',
      tooltipRemaining: 'Remaining Pot',
      chartTitle: 'Retirement Capital Over Time',
      yearMonthFormat: '{y}y {m}m',
    },
    mortgageCalc: {
      title: 'Mortgage Overpay',
      balanceLabel: 'Mortgage Balance',
      balanceMinMax: '£50k - £1.5M',
      rateLabel: 'Mortgage Interest Rate',
      rateMinMax: '1% - 10%',
      durationLabel: 'Remaining Term',
      durationMinMax: '5 Yrs - 35 Yrs',
      monthlyOverpayLabel: 'Monthly Overpayment',
      monthlyOverpayMinMax: 'None - £5,000 / mo',
      lumpSumOverpayLabel: 'One-off Lump Sum (Month 1)',
      lumpSumOverpayMinMax: 'None - £100k',
      infoBox: 'UK mortgages allow overpayments (usually up to 10% annually penalty-free), which can significantly reduce interest and clear your debt early.',
      cardSavedInterest: 'Interest Saved',
      cardSavedTime: 'Time Saved',
      cardNewTerm: 'New Term',
      tooltipStandard: 'Standard Bal',
      tooltipOverpaid: 'Overpaid Bal',
      chartTitle: 'Debt Reduction Trajectory',
    },
    fireCalc: {
      title: 'FIRE Calculator',
      ageLabel: 'Current Age',
      ageMinMax: '18 - 65',
      expensesLabel: 'Retirement Annual Spend',
      expensesMinMax: '£5k - £250k',
      expensesTooltip: 'Your estimated annual expenses once you retire, in today\'s money.',
      netWorthLabel: 'Current Net Worth',
      netWorthMinMax: '£0 - £1M',
      monthlySavingsLabel: 'Monthly Savings',
      monthlySavingsMinMax: 'None - £15,000 / mo',
      rateLabel: 'Net Investment Return',
      rateMinMax: '1% - 15%',
      infoBox: 'FIRE stands for Financial Independence, Retire Early. The 25x target represents a 4% Safe Withdrawal Rate to cover your annual costs.',
      cardFireNumber: 'FIRE Number',
      cardYearsToFire: 'Years to FIRE',
      cardFireAge: 'FIRE Age',
      tooltipNetWorth: 'Net Worth',
      tooltipFireTarget: 'FIRE Target',
      chartTitle: 'Wealth Accumulation vs FIRE Target',
      notFeasible: '> 50 Yrs',
      naValue: 'N/A',
    },
    taxCalc: {
      title: 'Salary Sacrifice',
      salaryLabel: 'Annual Gross Salary',
      salaryMinMax: '£10k - £250k',
      currentPensionLabel: 'Current Pension Sacrifice',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'Optimized Pension Sacrifice',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'UK taxpayers face steep marginal tax rates (up to 60% between £100k and £125k). Salary sacrifice bypasses this tax to secure your retirement savings.',
      cardNetTakeHome: 'Net Take Home',
      cardTotalPension: 'Total Pension Pot',
      cardTaxSaved: 'Tax Saved',
      headingBefore: 'Before Optimization',
      headingAfter: 'After Optimization',
      labelGross: 'Gross Salary',
      labelTax: 'Income Tax',
      labelNI: 'National Insurance',
      labelPension: 'Pension Contribution',
      labelNet: 'Net Take Home',
      summaryText: 'By increasing your sacrifice to {opt}%, you save {saved} in taxes and National Insurance, boosting your overall compound compensation.',
      optimiseButton: 'Auto-Optimise Sacrifice',
    },
  },
  us: {
    localeCode: 'en-US',
    currency: 'USD',
    currencySymbol: '$',
    name: 'United States',
    flag: '🇺🇸',
    tabs: {
      sip: { title: 'Recurring Save', desc: 'Compound regular savings' },
      swp: { title: 'Systematic Payout', desc: 'Systematic drawing plans' },
      mortgage: { title: 'Mortgage Overpay', desc: 'Clear property debt early' },
      fire: { title: 'FIRE Target', desc: 'Retire early milestone' },
      tax: { title: 'Tax Optimizer', desc: '401k vs salary optimization' },
    },
    line: 'Line',
    bar: 'Bar',
    start: 'Start',
    yearShort: 'Yr',
    ageText: 'Age',
    sipCalc: {
      title: 'Recurring Investment & Growth (DCA)',
      lumpSumLabel: 'Initial Investment / Lump Sum',
      lumpSumMinMax: '$0 (None) - $1M',
      monthlyLabel: 'Monthly Contribution',
      monthlyMinMax: '$10 - $5,000',
      rateLabel: 'Expected Growth Rate',
      rateMinMax: '1% - 30%',
      durationLabel: 'Duration',
      durationMinMax: '1 Yr - 40 Yrs',
      infoBox: 'A Recurring Investment Plan automates Dollar-Cost Averaging (DCA), reducing market timing risks while utilizing compounding interest.',
      cardInvested: 'Invested',
      cardGrowth: 'Growth',
      cardTotal: 'Total Value',
      tooltipInvested: 'Invested',
      tooltipTotal: 'Total Value',
      chartTitle: 'Investment Growth Trajectory',
    },
    swpCalc: {
      title: 'Retirement Systematic Withdrawal',
      potLabel: 'Starting Nest Egg',
      potMinMax: '$10k - $2M',
      withdrawalLabel: 'Monthly Pension Withdrawal',
      withdrawalMinMax: '$100 - $15,000',
      rateLabel: 'Annual Growth Rate',
      rateMinMax: '1% - 15%',
      durationLabel: 'Simulation Period',
      durationMinMax: '5 Yrs - 40 Yrs',
      infoBox: 'A Systematic Withdrawal Plan (SWP) generates structured retirement payouts while keeping your principal capital invested for continuous growth.',
      cardTotalWithdrawn: 'Total Withdrawn',
      cardPotLasts: 'Fund Durability',
      cardEndPot: 'Ending Nest Egg',
      infinitePot: 'Infinite / Full',
      depletionRisk: 'Depletion Risk',
      tooltipWithdrawn: 'Withdrawn',
      tooltipRemaining: 'Remaining Fund',
      chartTitle: 'Nest Egg Trajectory Over Time',
      yearMonthFormat: '{y}y {m}m',
    },
    mortgageCalc: {
      title: 'Mortgage Overpayment',
      balanceLabel: 'Loan Balance',
      balanceMinMax: '$50k - $1.5M',
      rateLabel: 'Mortgage APR',
      rateMinMax: '1% - 10%',
      durationLabel: 'Loan Term',
      durationMinMax: '5 Yrs - 35 Yrs',
      monthlyOverpayLabel: 'Monthly Overpayment',
      monthlyOverpayMinMax: 'None - $5,000 / mo',
      lumpSumOverpayLabel: 'One-off Principal Pay (Month 1)',
      lumpSumOverpayMinMax: 'None - $100k',
      infoBox: 'Making regular overpayments directly targets your principal loan balance, which dramatically cuts mortgage amortization timeline and interest fees.',
      cardSavedInterest: 'Interest Saved',
      cardSavedTime: 'Time Saved',
      cardNewTerm: 'New Term',
      tooltipStandard: 'Standard Bal',
      tooltipOverpaid: 'Overpaid Bal',
      chartTitle: 'Debt Reduction Trajectory',
    },
    fireCalc: {
      title: 'FIRE Calculator',
      ageLabel: 'Current Age',
      ageMinMax: '18 - 65',
      expensesLabel: 'Retirement Annual Spend',
      expensesMinMax: '$5k - $250k',
      expensesTooltip: 'Your estimated annual expenses once you retire, in today\'s money.',
      netWorthLabel: 'Current Net Worth',
      netWorthMinMax: '$0 - $1M',
      monthlySavingsLabel: 'Monthly Savings',
      monthlySavingsMinMax: 'None - $15,000 / mo',
      rateLabel: 'Net Investment Return',
      rateMinMax: '1% - 15%',
      infoBox: 'FIRE stands for Financial Independence, Retire Early. The 25x target represents a 4% Safe Withdrawal Rate to cover your annual costs.',
      cardFireNumber: 'FIRE Target',
      cardYearsToFire: 'Years to FIRE',
      cardFireAge: 'FIRE Age',
      tooltipNetWorth: 'Net Worth',
      tooltipFireTarget: 'FIRE Target',
      chartTitle: 'Wealth Accumulation vs FIRE Target',
      notFeasible: '> 50 Yrs',
      naValue: 'N/A',
    },
    taxCalc: {
      title: 'US Tax Sacrifice (UK-focused)',
      salaryLabel: 'Annual Gross Salary',
      salaryMinMax: '$10k - $250k',
      currentPensionLabel: 'Current Pension Sacrifice',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'Optimized Pension Sacrifice',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'In the US, 401(k) pre-tax contributions act similarly to tax sacrifice. Note: This specific tax optimization module uses UK tax code logic.',
      cardNetTakeHome: 'Net Take Home',
      cardTotalPension: 'Total Pension Pot',
      cardTaxSaved: 'Tax Saved',
      headingBefore: 'Before Optimization',
      headingAfter: 'After Optimization',
      labelGross: 'Gross Salary',
      labelTax: 'Income Tax',
      labelNI: 'National Insurance',
      labelPension: 'Pension Contribution',
      labelNet: 'Net Take Home',
      summaryText: 'By increasing your sacrifice to {opt}%, you save {saved} in taxes and National Insurance, boosting your overall compound compensation.',
      optimiseButton: 'Auto-Optimise Sacrifice',
    },
  },
  fr: {
    localeCode: 'fr-FR',
    currency: 'EUR',
    currencySymbol: '€',
    name: 'France',
    flag: '🇫🇷',
    tabs: {
      sip: { title: 'Épargne SIP', desc: 'Intérêts composés périodiques' },
      swp: { title: 'Retrait SWP', desc: 'Planification des retraits' },
      mortgage: { title: 'Rachat Crédit', desc: 'Remboursement anticipé' },
      fire: { title: 'Objectif FIRE', desc: 'Indépendance financière' },
      tax: { title: 'Fiscalité UK', desc: 'Optimisation fiscale (R-U)' },
    },
    line: 'Ligne',
    bar: 'Barre',
    start: 'Début',
    yearShort: 'An',
    ageText: 'Âge',
    sipCalc: {
      title: 'Plan d\'Épargne Périodique (SIP)',
      lumpSumLabel: 'Capital Initial / Versement Unique',
      lumpSumMinMax: '0 € (Aucun) - 1M €',
      monthlyLabel: 'Versement Mensuel',
      monthlyMinMax: '10 € - 5 000 €',
      rateLabel: 'Rendement Annuel Estimé',
      rateMinMax: '1% - 30%',
      durationLabel: 'Durée d\'Épargne',
      durationMinMax: '1 an - 40 ans',
      infoBox: 'Un plan d\'épargne périodique (SIP) utilise les intérêts composés pour accumuler du capital en investissant un montant fixe régulièrement.',
      cardInvested: 'Total Investi',
      cardGrowth: 'Intérêts Gagnés',
      cardTotal: 'Valeur Finale',
      tooltipInvested: 'Investi',
      tooltipTotal: 'Valeur Totale',
      chartTitle: 'Trajectoire de Croissance de l\'Épargne',
    },
    swpCalc: {
      title: 'Plan de Retrait Systématique (SWP)',
      potLabel: 'Capital de Départ Retraite',
      potMinMax: '10k € - 2M €',
      withdrawalLabel: 'Retrait Mensuel (Rente)',
      withdrawalMinMax: '100 € - 15 000 €',
      rateLabel: 'Taux de Croissance Annuel',
      rateMinMax: '1% - 15%',
      durationLabel: 'Période de Simulation',
      durationMinMax: '5 ans - 40 ans',
      infoBox: 'Le retrait systématique (SWP) vous permet de prélever un revenu fixe de votre capital retraite tandis que le solde restant continue de fructifier.',
      cardTotalWithdrawn: 'Revenu Total Extrait',
      cardPotLasts: 'Durée du Capital',
      cardEndPot: 'Capital Résiduel',
      infinitePot: 'Infini / Complet',
      depletionRisk: 'Risque d\'Épuisement',
      tooltipWithdrawn: 'Retiré',
      tooltipRemaining: 'Capital Restant',
      chartTitle: 'Évolution du Capital de Retraite',
      yearMonthFormat: '{y}a {m}m',
    },
    mortgageCalc: {
      title: 'Remboursement Anticipé',
      balanceLabel: 'Capital Restant Dû',
      balanceMinMax: '50k € - 1,5M €',
      rateLabel: 'Taux d\'Intérêt Nominal',
      rateMinMax: '1% - 10%',
      durationLabel: 'Durée Restante du Crédit',
      durationMinMax: '5 ans - 35 ans',
      monthlyOverpayLabel: 'Mensualité Additionnelle',
      monthlyOverpayMinMax: 'Aucune - 5 000 €/mois',
      lumpSumOverpayLabel: 'Apport Ponctuel (Mois 1)',
      lumpSumOverpayMinMax: 'Aucun - 100k €',
      infoBox: 'Les remboursements anticipés ciblent directement le principal du prêt, réduisant la durée du crédit et le coût global des intérêts.',
      cardSavedInterest: 'Intérêts Économisés',
      cardSavedTime: 'Temps Économisé',
      cardNewTerm: 'Nouvelle Durée',
      tooltipStandard: 'Sans Surpaiement',
      tooltipOverpaid: 'Avec Surpaiement',
      chartTitle: 'Trajectoire de Désendettement',
    },
    fireCalc: {
      title: 'Calculateur FIRE',
      ageLabel: 'Âge Actuel',
      ageMinMax: '18 - 65',
      expensesLabel: 'Dépenses Annuelles à la Retraite',
      expensesMinMax: '5k € - 250k €',
      expensesTooltip: 'Vos dépenses annuelles estimées une fois à la retraite (en valeur d\'aujourd\'hui).',
      netWorthLabel: 'Patrimoine Net Actuel',
      netWorthMinMax: '0 € - 1M €',
      monthlySavingsLabel: 'Épargne Mensuelle',
      monthlySavingsMinMax: 'Aucune - 15 000 €/mois',
      rateLabel: 'Rendement Net des Placements',
      rateMinMax: '1% - 15%',
      infoBox: 'FIRE signifie "Financial Independence, Retire Early". L\'objectif de 25x les dépenses correspond à un taux de retrait sécurisé de 4%.',
      cardFireNumber: 'Montant FIRE',
      cardYearsToFire: 'Années avant FIRE',
      cardFireAge: 'Âge FIRE',
      tooltipNetWorth: 'Patrimoine',
      tooltipFireTarget: 'Objectif FIRE',
      chartTitle: 'Patrimoine Net vs Objectif FIRE',
      notFeasible: '> 50 ans',
      naValue: 'N/A',
    },
    taxCalc: {
      title: 'Optimisation Fiscale (R-U)',
      salaryLabel: 'Salaire Brut Annuel',
      salaryMinMax: '10k € - 250k €',
      currentPensionLabel: 'Taux de Sacrifice Actuel',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'Taux Optimisé',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'Ce module d\'optimisation fiscale utilise les règles et tranches d\'imposition spécifiques du Royaume-Uni (UK Salary Sacrifice).',
      cardNetTakeHome: 'Salaire Net',
      cardTotalPension: 'Marmite Retraite',
      cardTaxSaved: 'Impôts Économisés',
      headingBefore: 'Avant Optimisation',
      headingAfter: 'Après Optimisation',
      labelGross: 'Salaire Brut',
      labelTax: 'Impôt sur le Revenu',
      labelNI: 'Charges Sociales',
      labelPension: 'Cotisation Retraite',
      labelNet: 'Salaire Net Dispo',
      summaryText: 'En augmentant votre sacrifice à {opt}%, vous économisez {saved} en impôts et cotisations, maximisant votre rémunération totale.',
      optimiseButton: 'Optimiser Automatiquement',
    },
  },
  de: {
    localeCode: 'de-DE',
    currency: 'EUR',
    currencySymbol: '€',
    name: 'Deutschland',
    flag: '🇩🇪',
    tabs: {
      sip: { title: 'ETF-Sparplan', desc: 'Zinseszins-Sparplan' },
      swp: { title: 'Entnahmeplan', desc: 'Systematisches Auszahlen' },
      mortgage: { title: 'Sondertilgung', desc: 'Kreditschuld schneller tilgen' },
      fire: { title: 'FIRE Frührente', desc: 'Meilenstein zur Frührente' },
      tax: { title: 'UK Steuer-Optimierer', desc: 'Gehaltsumwandlung (UK)' },
    },
    line: 'Linie',
    bar: 'Balken',
    start: 'Start',
    yearShort: 'J.',
    ageText: 'Alter',
    sipCalc: {
      title: 'ETF & Fondssparplan (SIP)',
      lumpSumLabel: 'Einmalanlage / Startkapital',
      lumpSumMinMax: '0 € (Keine) - 1M €',
      monthlyLabel: 'Monatliche Sparrate',
      monthlyMinMax: '10 € - 5.000 €',
      rateLabel: 'Erwartete Jahresrendite',
      rateMinMax: '1% - 30%',
      durationLabel: 'Spardauer',
      durationMinMax: '1 J. - 40 J.',
      infoBox: 'Ein Sparplan (SIP) nutzt den Zinseszins-Effekt, um durch regelmäßige Investitionen langfristig Vermögen aufzubauen.',
      cardInvested: 'Eingezahltes Kapital',
      cardGrowth: 'Wertzuwachs',
      cardTotal: 'Endguthaben',
      tooltipInvested: 'Investiert',
      tooltipTotal: 'Gesamtwert',
      chartTitle: 'Wertentwicklung des Sparplans',
    },
    swpCalc: {
      title: 'Entnahmeplan & Auszahlplan (SWP)',
      potLabel: 'Startkapital für Rente',
      potMinMax: '10k € - 2M €',
      withdrawalLabel: 'Monatliche Auszahlung (Rente)',
      withdrawalMinMax: '100 € - 15.000 €',
      rateLabel: 'Jährliche Wachstumsrate',
      rateMinMax: '1% - 15%',
      durationLabel: 'Simulationszeitraum',
      durationMinMax: '5 J. - 40 J.',
      infoBox: 'Ein Entnahmeplan (SWP) ermöglicht es Ihnen, eine regelmäßige Zusatzrente auszuzahlen, während das Restguthaben investiert bleibt und weiter wächst.',
      cardTotalWithdrawn: 'Gesamtauszahlung',
      cardPotLasts: 'Kapitaldauer',
      cardEndPot: 'Restkapital',
      infinitePot: 'Unendlich / Erhalt',
      depletionRisk: 'Verzehr-Risiko',
      tooltipWithdrawn: 'Ausgezahlt',
      tooltipRemaining: 'Restkapital',
      chartTitle: 'Kapitalverlauf über Zeit',
      yearMonthFormat: '{y}J {m}M',
    },
    mortgageCalc: {
      title: 'Tilgung & Sondertilgung',
      balanceLabel: 'Restschuld Darlehen',
      balanceMinMax: '50k € - 1,5M €',
      rateLabel: 'Sollzins (effektiv)',
      rateMinMax: '1% - 10%',
      durationLabel: 'Sollzinsbindung (Jahre)',
      durationMinMax: '5 J. - 35 J.',
      monthlyOverpayLabel: 'Monatliche Sondertilgung',
      monthlyOverpayMinMax: 'Keine - 5.000 €/Monat',
      lumpSumOverpayLabel: 'Einmalige Sondertilgung (Monat 1)',
      lumpSumOverpayMinMax: 'Keine - 100k €',
      infoBox: 'Sondertilgungen reduzieren direkt die Restschuld des Kredits, wodurch Zinskosten exponentiell gesenkt und die Gesamtlaufzeit verkürzt wird.',
      cardSavedInterest: 'Gesparte Zinsen',
      cardSavedTime: 'Zeit-Ersparnis',
      cardNewTerm: 'Neue Laufzeit',
      tooltipStandard: 'Standard-Verlauf',
      tooltipOverpaid: 'Mit Sondertilgung',
      chartTitle: 'Restschuld-Verlauf',
    },
    fireCalc: {
      title: 'FIRE-Rechner (Frührente)',
      ageLabel: 'Aktuelles Alter',
      ageMinMax: '18 - 65',
      expensesLabel: 'Jährliche Wunschrente (Kosten)',
      expensesMinMax: '5k € - 250k €',
      expensesTooltip: 'Ihre geschätzten jährlichen Ausgaben im Ruhestand, in heutiger Kaufkraft.',
      netWorthLabel: 'Aktuelles Vermögen',
      netWorthMinMax: '0 € - 1M €',
      monthlySavingsLabel: 'Monatliche Sparrate',
      monthlySavingsMinMax: 'Keine - 15.000 €/Monat',
      rateLabel: 'Nettorendite Anlagen',
      rateMinMax: '1% - 15%',
      infoBox: 'FIRE steht für Financial Independence, Retire Early. Das 25-Fache der Jahresausgaben entspricht einer sicheren Entnahmerate von 4 %.',
      cardFireNumber: 'FIRE-Zahl (Ziel)',
      cardYearsToFire: 'Jahre bis zur FIRE',
      cardFireAge: 'FIRE-Alter',
      tooltipNetWorth: 'Vermögen',
      tooltipFireTarget: 'FIRE-Ziel',
      chartTitle: 'Vermögensaufbau vs. FIRE-Ziel',
      notFeasible: '> 50 J.',
      naValue: 'N/A',
    },
    taxCalc: {
      title: 'UK Gehaltsumwandlung',
      salaryLabel: 'Bruttojahresgehalt',
      salaryMinMax: '10k € - 250k €',
      currentPensionLabel: 'Aktuelle Umwandlungsrate',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'Optimierte Umwandlung',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'Dieses Steueroptimierungs-Modul basiert speziell auf den Steuersätzen und Rentenvorschriften des Vereinigten Königreichs (UK).',
      cardNetTakeHome: 'Netto-Gehalt',
      cardTotalPension: 'Renten-Sparschwein',
      cardTaxSaved: 'Gesparte Steuern',
      headingBefore: 'Vor Optimierung',
      headingAfter: 'Nach Optimierung',
      labelGross: 'Bruttogehalt',
      labelTax: 'Einkommensteuer',
      labelNI: 'Sozialabgaben',
      labelPension: 'Rentenbeitrag',
      labelNet: 'Nettogehalt',
      summaryText: 'Durch Erhöhung des Beitrags auf {opt}% sparen Sie {saved} an Steuern und Abgaben und steigern Ihr Gesamtvermögen.',
      optimiseButton: 'Automatisch optimieren',
    },
  },
  ar: {
    localeCode: 'ar-AE',
    currency: 'AED',
    currencySymbol: 'د.إ',
    name: 'العربية',
    flag: '🇦🇪',
    tabs: {
      sip: { title: 'خطة استثمار دورية', desc: 'مضاعفة المدخرات المنتظمة' },
      swp: { title: 'خطة سحب دورية', desc: 'خطط السحب المنظم للمتقاعدين' },
      mortgage: { title: 'سداد العقار المبكر', desc: 'سداد ديون التمويل العقاري مبكراً' },
      fire: { title: 'هدف التقاعد المبكر', desc: 'بلوغ مرحلة الاستقلال المالي' },
      tax: { title: 'توفير الضرائب (UK)', desc: 'تحسين الضرائب التقاعدية للمملكة المتحدة' },
    },
    line: 'خط',
    bar: 'أعمدة',
    start: 'البداية',
    yearShort: 'سنة',
    ageText: 'العمر',
    sipCalc: {
      title: 'خطة الاستثمار المنتظم (SIP)',
      lumpSumLabel: 'الاستثمار الأولي / دفعة واحدة',
      lumpSumMinMax: '0 د.إ (بدون) - 1 مليون د.إ',
      monthlyLabel: 'الاستثمار الشهري الدوري',
      monthlyMinMax: '10 د.إ - 5,000 د.إ',
      rateLabel: 'العائد السنوي المتوقع',
      rateMinMax: '1% - 30%',
      durationLabel: 'مدة الاستثمار',
      durationMinMax: '1 سنة - 40 سنة',
      infoBox: 'تعتمد خطة الاستثمار المنتظم (SIP) على مبدأ الفائدة المركبة لتراكم الثروة عن طريق استثمار مبالغ ثابتة ومستمرة على فترات دورية.',
      cardInvested: 'إجمالي المبالغ المستثمرة',
      cardGrowth: 'الأرباح المحققة',
      cardTotal: 'القيمة الإجمالية للثروة',
      tooltipInvested: 'المبالغ المستثمرة',
      tooltipTotal: 'القيمة الإجمالية',
      chartTitle: 'مسار نمو واستثمار الثروة',
    },
    swpCalc: {
      title: 'خطة السحب المنتظم (SWP)',
      potLabel: 'محفظة رأس مال التقاعد',
      potMinMax: '10k د.إ - 2 مليون د.إ',
      withdrawalLabel: 'مبلغ السحب الشهري',
      withdrawalMinMax: '100 د.إ - 15,000 د.إ',
      rateLabel: 'معدل النمو السنوي للمحفظة',
      rateMinMax: '1% - 15%',
      durationLabel: 'فترة محاكاة السحب',
      durationMinMax: '5 سنوات - 40 سنة',
      infoBox: 'تتيح لك خطة السحب المنتظم (SWP) سحب دخل شهري ثابت من أموال التقاعد الخاصة بك، بينما يستمر الرصيد المتبقي في النمو.',
      cardTotalWithdrawn: 'إجمالي المبالغ المسحوبة',
      cardPotLasts: 'استدامة رأس المال',
      cardEndPot: 'الرصيد المتبقي للمحفظة',
      infinitePot: 'مستمر / رأس المال آمن',
      depletionRisk: 'مخاطر نفاد السيولة',
      tooltipWithdrawn: 'المسحوبات',
      tooltipRemaining: 'الرصيد المتبقي',
      chartTitle: 'رأس مال التقاعد عبر الزمن',
      yearMonthFormat: '{y}سنة و {m}أشهر',
    },
    mortgageCalc: {
      title: 'تسريع سداد القرض العقاري',
      balanceLabel: 'مبلغ القرض العقاري المتبقي',
      balanceMinMax: '50k د.إ - 1.5 مليون د.إ',
      rateLabel: 'معدل نسبة الفائدة السنوية',
      rateMinMax: '1% - 10%',
      durationLabel: 'المدة المتبقية للقرض',
      durationMinMax: '5 سنوات - 35 سنة',
      monthlyOverpayLabel: 'السداد الإضافي الشهري',
      monthlyOverpayMinMax: 'بدون سداد - 5,000 د.إ',
      lumpSumOverpayLabel: 'دفعة سداد أولى إضافية (الشهر 1)',
      lumpSumOverpayMinMax: 'بدون دفعة - 100k د.إ',
      infoBox: 'يساعد سداد مبالغ إضافية للقرض العقاري في تقليل أصل الدين مباشرة، مما يقلل بشكل كبير الفوائد التراكمية ويقصر مدة القرض الإجمالية.',
      cardSavedInterest: 'الفوائد التي تم توفيرها',
      cardSavedTime: 'الوقت الموفر للسداد',
      cardNewTerm: 'المدة الجديدة للقرض',
      tooltipStandard: 'السداد العادي',
      tooltipOverpaid: 'السداد الإضافي',
      chartTitle: 'مسار خفض الديون العقارية',
    },
    fireCalc: {
      title: 'حاسبة الاستقلال المالي والتقاعد المبكر',
      ageLabel: 'العمر الحالي',
      ageMinMax: '18 - 65',
      expensesLabel: 'المصاريف السنوية عند التقاعد',
      expensesMinMax: '5k د.إ - 250k د.إ',
      expensesTooltip: 'مصاريفك السنوية التقاعدية المتوقعة، مقدرة بقيمة القوة الشرائية للنقد اليوم.',
      netWorthLabel: 'صافي الثروة الحالية',
      netWorthMinMax: '0 د.إ - 1 مليون د.إ',
      monthlySavingsLabel: 'المدخرات الشهرية',
      monthlySavingsMinMax: 'بدون ادخار - 15,000 د.إ',
      rateLabel: 'عائد الاستثمار الصافي المتوقع',
      rateMinMax: '1% - 15%',
      infoBox: 'يرمز مصطلح FIRE إلى الاستقلال المالي والتقاعد المبكر. استهداف 25 ضعف مصاريفك يتيح سحب 4% كنسبة سنوية آمنة لتغطية تكاليف معيشتك.',
      cardFireNumber: 'رقم الاستقلال المالي المستهدف',
      cardYearsToFire: 'السنوات المطلوبة للهدف',
      cardFireAge: 'عمر التقاعد المالي المتوقع',
      tooltipNetWorth: 'صافي الثروة',
      tooltipFireTarget: 'الهدف المستهدف',
      chartTitle: 'تراكم الثروة مقارنة بالرقم المستهدف',
      notFeasible: 'أكثر من 50 سنة',
      naValue: 'غير متوفر',
    },
    taxCalc: {
      title: 'محسن الضرائب والتقاعد',
      salaryLabel: 'الراتب السنوي الإجمالي',
      salaryMinMax: '10k د.إ - 250k د.إ',
      currentPensionLabel: 'معدل التضحية بالراتب الحالي',
      currentPensionMinMax: '0% - 70%',
      optimizedPensionLabel: 'المعدل المحسن للتقاعد',
      optimizedPensionMinMax: '0% - 70%',
      infoBox: 'تساعد التضحية بالراتب في المملكة المتحدة في خفض ضريبة الدخل والضمان الوطني. يرجى الملاحظة: هذه الحاسبة مخصصة فقط لقوانين ضرائب المملكة المتحدة.',
      cardNetTakeHome: 'صافي الدخل المستلم',
      cardTotalPension: 'محفظة التقاعد الكلية',
      cardTaxSaved: 'الضرائب التي تم توفيرها',
      headingBefore: 'قبل التحسين',
      headingAfter: 'بعد التحسين',
      labelGross: 'الراتب الإجمالي',
      labelTax: 'ضريبة الدخل',
      labelNI: 'التأمين الوطني',
      labelPension: 'المساهمة التقاعدية',
      labelNet: 'الصافي المستلم',
      summaryText: 'عن طريق زيادة التضحية بالراتب إلى {opt}%، ستوفر {saved} من الضرائب والضمان الوطني لصالح محفظتك التقاعدية التراكمية.',
      optimiseButton: 'تحسين تلقائي للتضحية بالراتب',
    },
  },
};

// Global formatters that accept a locale parameter
export const formatCurrency = (val: number, locale: LocaleType) => {
  const config = localeConfigs[locale];
  return new Intl.NumberFormat(config.localeCode, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatCompact = (val: number, locale: LocaleType) => {
  const config = localeConfigs[locale];
  return new Intl.NumberFormat(config.localeCode, {
    notation: 'compact',
    compactDisplay: 'short',
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 1,
  }).format(val);
};

export const getXAxisTicks = (totalYears: number) => {
  if (totalYears <= 5) return Array.from({ length: totalYears + 1 }, (_, i) => i);
  if (totalYears <= 12) return Array.from({ length: Math.floor(totalYears / 2) + 1 }, (_, i) => i * 2);
  if (totalYears <= 25) return Array.from({ length: Math.floor(totalYears / 5) + 1 }, (_, i) => i * 5);
  return Array.from({ length: Math.floor(totalYears / 10) + 1 }, (_, i) => i * 10);
};
