import React, { useState, useMemo } from 'react';
import { Home, Calendar, Clock, Award } from 'lucide-react';
import { calculateMortgage } from '../utils/calc';
import type { LocaleType } from '../utils/locale';
import { localeConfigs, formatCurrency, formatCompact, getXAxisTicks } from '../utils/locale';

interface MortgageOverpaymentProps {
  locale: LocaleType;
}

export const MortgageOverpayment: React.FC<MortgageOverpaymentProps> = ({ locale }) => {
  const [balance, setBalance] = useState<number>(200000);
  const [rate, setRate] = useState<number>(4.5);
  const [term, setTerm] = useState<number>(25);
  const [monthlyOverpay, setMonthlyOverpay] = useState<number>(200);
  const [oneOffOverpay, setOneOffOverpay] = useState<number>(5000);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line');

  const t = localeConfigs[locale];

  // Compute mortgage metrics
  const result = useMemo(() => 
    calculateMortgage(balance, rate, term, monthlyOverpay, oneOffOverpay),
    [balance, rate, term, monthlyOverpay, oneOffOverpay]
  );

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  // Generate SVG coordinates for dual lines (standard balance vs overpaid balance)
  const points = useMemo(() => {
    if (result.amortizationData.length === 0) return { standardLine: '', overpaidLine: '', coordinates: [] };

    const maxVal = balance;
    const innerWidth = chartWidth - paddingLeft - paddingRight;
    const innerHeight = chartHeight - paddingTop - paddingBottom;
    const stepX = innerWidth / (result.amortizationData.length - 1 || 1);

    const coords = result.amortizationData.map((d, i) => {
      const x = paddingLeft + i * stepX;
      const yStandard = chartHeight - paddingBottom - (d.standardBalance / maxVal) * innerHeight;
      const yOverpaid = chartHeight - paddingBottom - (d.overpaidBalance / maxVal) * innerHeight;
      return { x, yStandard, yOverpaid, data: d };
    });

    const standardLine = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yStandard}`).join(' ');
    const overpaidLine = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yOverpaid}`).join(' ');

    return { standardLine, overpaidLine, coordinates: coords };
  }, [result.amortizationData, balance, chartWidth, chartHeight]);



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)]">{t.mortgageCalc.title}</h2>
          </div>

          {/* Balance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.mortgageCalc.balanceLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.currencySymbol}</span>
                <input 
                  type="number" 
                  value={balance === 0 ? '' : balance} 
                  onChange={(e) => setBalance(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={locale === 'in' ? 500000 : 50000} 
              max={locale === 'in' ? 150000000 : 1500000} 
              step={locale === 'in' ? 50000 : 10000}
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.mortgageCalc.balanceMinMax.split(' - ')[0]}</span>
              <span>{t.mortgageCalc.balanceMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.mortgageCalc.rateLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  step="0.01"
                  value={rate === 0 ? '' : rate} 
                  onChange={(e) => setRate(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">%</span>
              </div>
            </div>
            <input 
              type="range" 
              min={1} 
              max={10} 
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.mortgageCalc.rateMinMax.split(' - ')[0]}</span>
              <span>{t.mortgageCalc.rateMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Remaining Term Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.mortgageCalc.durationLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  value={term === 0 ? '' : term} 
                  onChange={(e) => setTerm(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.yearShort}</span>
              </div>
            </div>
            <input 
              type="range" 
              min={5} 
              max={35} 
              step={1}
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.mortgageCalc.durationMinMax.split(' - ')[0]}</span>
              <span>{t.mortgageCalc.durationMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Monthly Overpayment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.mortgageCalc.monthlyOverpayLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-28 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.currencySymbol}</span>
                <input 
                  type="number" 
                  value={monthlyOverpay === 0 ? '' : monthlyOverpay} 
                  onChange={(e) => setMonthlyOverpay(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={locale === 'in' ? 500000 : 5000} 
              step={locale === 'in' ? 500 : 10}
              value={monthlyOverpay}
              onChange={(e) => setMonthlyOverpay(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.mortgageCalc.monthlyOverpayMinMax.split(' - ')[0]}</span>
              <span>{t.mortgageCalc.monthlyOverpayMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Lump Sum Overpayment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.mortgageCalc.lumpSumOverpayLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.currencySymbol}</span>
                <input 
                  type="number" 
                  value={oneOffOverpay === 0 ? '' : oneOffOverpay} 
                  onChange={(e) => setOneOffOverpay(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={locale === 'in' ? 10000000 : 100000} 
              step={locale === 'in' ? 5000 : 1000}
              value={oneOffOverpay}
              onChange={(e) => setOneOffOverpay(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.mortgageCalc.lumpSumOverpayMinMax.split(' - ')[0]}</span>
              <span>{t.mortgageCalc.lumpSumOverpayMinMax.split(' - ')[1]}</span>
            </div>
          </div>
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light">
          💡 {t.mortgageCalc.infoBox}
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.mortgageCalc.cardSavedInterest}</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {formatCurrency(result.interestSaved, locale)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>{t.mortgageCalc.cardSavedTime}</span>
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-black text-[var(--theme-accent)]">
              {result.timeSavedYears > 0 || result.timeSavedMonths > 0 ? (
                `${result.timeSavedYears}${t.yearShort} ${result.timeSavedMonths}m`
              ) : (
                `0 ${t.yearShort}`
              )}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.mortgageCalc.cardNewTerm}</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-heading)]">
              {Math.round((result.overpaidTermMonths / 12) * 10) / 10} {t.yearShort}
            </div>
          </div>
        </div>

        {/* Graph Display Card */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)]">
              {t.mortgageCalc.chartTitle}
            </h3>
            <div className="flex bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-0.5 text-xs select-none">
              <button 
                onClick={() => setGraphType('line')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${graphType === 'line' ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)] shadow-sm' : 'text-[var(--theme-text)] opacity-70 hover:opacity-100'}`}
              >
                {t.line}
              </button>
              <button 
                onClick={() => setGraphType('bar')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${graphType === 'bar' ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)] shadow-sm' : 'text-[var(--theme-text)] opacity-70 hover:opacity-100'}`}
              >
                {t.bar}
              </button>
            </div>
          </div>

          <div className="relative w-full flex items-center justify-center">
            <svg 
              className="w-full h-auto max-h-[220px]" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              fill="none"
            >
              {/* Grid Lines */}
              <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} stroke="var(--theme-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={paddingLeft} y1={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} x2={chartWidth - paddingRight} y2={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} stroke="var(--theme-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="var(--theme-border)" strokeWidth="1" />

              {/* Hover Guide Line */}
              {hoveredIdx !== null && points.coordinates[hoveredIdx] && (
                <line 
                  x1={points.coordinates[hoveredIdx].x} 
                  y1={paddingTop} 
                  x2={points.coordinates[hoveredIdx].x} 
                  y2={chartHeight - paddingBottom} 
                  stroke="var(--theme-accent)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  className="opacity-50 pointer-events-none"
                />
              )}

              {/* Y Axis Ticks and Labels */}
              {(() => {
                const maxVal = balance;
                return (
                  <g className="select-none pointer-events-none">
                    <line x1={paddingLeft - 4} y1={paddingTop} x2={paddingLeft} y2={paddingTop} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={paddingTop} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      {formatCompact(maxVal, locale)}
                    </text>

                    <line x1={paddingLeft - 4} y1={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} x2={paddingLeft} y2={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      {formatCompact(maxVal / 2, locale)}
                    </text>

                    <line x1={paddingLeft - 4} y1={chartHeight - paddingBottom} x2={paddingLeft} y2={chartHeight - paddingBottom} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={chartHeight - paddingBottom} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      {t.currencySymbol}0
                    </text>
                  </g>
                );
              })()}

              {/* X Axis Ticks and Labels */}
              {(() => {
                const tickYears = getXAxisTicks(term);
                return (
                  <g className="select-none pointer-events-none">
                    {tickYears.map((y) => {
                      const idx = result.amortizationData.findIndex(d => d.year === y);
                      if (idx === -1 || !points.coordinates[idx]) return null;
                      const c = points.coordinates[idx];
                      return (
                        <g key={y}>
                          <line 
                            x1={c.x} 
                            y1={chartHeight - paddingBottom} 
                            x2={c.x} 
                            y2={chartHeight - paddingBottom + 4} 
                            stroke="var(--theme-border)" 
                            strokeWidth="1" 
                          />
                          <text 
                            x={c.x} 
                            y={chartHeight - paddingBottom + 15} 
                            fontSize="8" 
                            textAnchor="middle" 
                            fill="var(--theme-text)" 
                            opacity="0.6"
                          >
                            {y === 0 ? t.start : `${t.yearShort} ${y}`}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}

              {/* Graph Type Selection Conditional Rendering */}
              {graphType === 'line' ? (
                <>
                  {/* Trajectory lines */}
                  <path d={points.standardLine} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" className="transition-all duration-500 animate-graph-line" />
                  <path d={points.overpaidLine} stroke="var(--theme-accent)" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 animate-graph-line graph-glow" />
                </>
              ) : (
                <g>
                  {points.coordinates.map((c, i) => {
                    const stepX = points.coordinates.length > 1 ? (chartWidth - paddingLeft - paddingRight) / (points.coordinates.length - 1) : chartWidth - paddingLeft - paddingRight;
                    const barWidth = Math.max(2, stepX * 0.35);
                    
                    const maxVal = balance;
                    const standardHeight = (c.data.standardBalance / maxVal) * (chartHeight - paddingTop - paddingBottom);
                    const overpaidHeight = (c.data.overpaidBalance / maxVal) * (chartHeight - paddingTop - paddingBottom);

                    const isHovered = hoveredIdx === i;
                    const isAnyHovered = hoveredIdx !== null;

                    return (
                      <g 
                        key={i} 
                        className="transition-all duration-300"
                        style={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.6) : 1 }}
                      >
                        {/* Standard Balance Bar */}
                        <rect
                          x={c.x - barWidth - 1}
                          y={chartHeight - paddingBottom - standardHeight}
                          width={barWidth}
                          height={standardHeight}
                          fill="url(#mortgageStandardBarGrad)"
                          rx={1}
                          className="transition-all duration-500"
                        />
                        {/* Overpaid Balance Bar */}
                        <rect
                          x={c.x + 1}
                          y={chartHeight - paddingBottom - overpaidHeight}
                          width={barWidth}
                          height={overpaidHeight}
                          fill="url(#mortgageOverpaidBarGrad)"
                          rx={1}
                          className="transition-all duration-500"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Interactive Hover Dots */}
              {points.coordinates.map((c, i) => (
                <g key={i}>
                  <circle 
                    cx={c.x} 
                    cy={c.yOverpaid} 
                    r={hoveredIdx === i ? "6" : "4"} 
                    fill="var(--theme-accent)" 
                    stroke="var(--theme-panel)" 
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onTouchStart={() => setHoveredIdx(i)}
                    onClick={() => setTerm(c.data.year)}
                  />
                  <circle 
                    cx={c.x} 
                    cy={c.yOverpaid} 
                    r="12" 
                    fill="transparent" 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onTouchStart={() => setHoveredIdx(i)}
                    onClick={() => setTerm(c.data.year)}
                  />
                </g>
              ))}

              <defs>
                <linearGradient id="mortgageStandardBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="mortgageOverpaidBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Custom Tooltip */}
            {hoveredIdx !== null && points.coordinates[hoveredIdx] && (
              <div 
                className="absolute z-20 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl p-3 shadow-md pointer-events-none text-left space-y-1 text-[11px] transition-all duration-150 animate-in fade-in zoom-in-95"
                style={{
                  left: `${(points.coordinates[hoveredIdx].x / chartWidth) * 100}%`,
                  bottom: '75px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="font-bold text-[var(--theme-heading)]">{t.yearShort} {points.coordinates[hoveredIdx].data.year}</div>
                <div className="text-stone-500">{t.mortgageCalc.tooltipStandard}: <span className="font-semibold">{formatCurrency(points.coordinates[hoveredIdx].data.standardBalance, locale)}</span></div>
                <div className="text-[var(--theme-accent)]">{t.mortgageCalc.tooltipOverpaid}: <span className="font-bold">{formatCurrency(points.coordinates[hoveredIdx].data.overpaidBalance, locale)}</span></div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
