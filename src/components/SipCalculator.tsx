import React, { useState, useMemo } from 'react';
import { TrendingUp, Landmark, Award } from 'lucide-react';
import { calculateSip } from '../utils/calc';
import type { LocaleType } from '../utils/locale';
import { localeConfigs, formatCurrency, formatCompact, getXAxisTicks } from '../utils/locale';

interface SipCalculatorProps {
  locale: LocaleType;
}

export const SipCalculator: React.FC<SipCalculatorProps> = ({ locale }) => {
  const [initialBalance, setInitialBalance] = useState<number>(10000); // Default starting pot
  const [monthly, setMonthly] = useState<number>(500);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(15);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line');

  const t = localeConfigs[locale];

  // Compute SIP values
  const result = useMemo(() => calculateSip(monthly, rate, years, initialBalance), [monthly, rate, years, initialBalance]);

  // Chart layout config
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  // Locale-dependent slider boundaries
  const lumpSumMin = 0;
  const lumpSumMax = locale === 'in' ? 10000000 : locale === 'ar' ? 5000000 : 1000000;
  const lumpSumStep = locale === 'in' ? 5000 : 1000;

  const monthlyMin = locale === 'in' ? 100 : locale === 'ar' ? 100 : 10;
  const monthlyMax = locale === 'in' ? 500000 : locale === 'ar' ? 20000 : 5000;
  const monthlyStep = locale === 'in' ? 500 : locale === 'ar' ? 100 : 10;

  // Generate coordinates for SVG Path
  const points = useMemo(() => {
    if (result.yearlyData.length === 0) return { invested: '', total: '', coordinates: [] };

    const maxVal = Math.max(...result.yearlyData.map(d => d.totalValue), 100);
    const innerWidth = chartWidth - paddingLeft - paddingRight;
    const innerHeight = chartHeight - paddingTop - paddingBottom;
    const stepX = innerWidth / (result.yearlyData.length - 1 || 1);
    
    const coords = result.yearlyData.map((d, i) => {
      const x = paddingLeft + i * stepX;
      // SVG origin is top-left, so we subtract from height
      const yInvested = chartHeight - paddingBottom - (d.invested / maxVal) * innerHeight;
      const yTotal = chartHeight - paddingBottom - (d.totalValue / maxVal) * innerHeight;
      return { x, yInvested, yTotal, data: d };
    });

    // Create path strings
    const investedPath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yInvested}`).join(' ') + 
      ` L ${coords[coords.length - 1].x} ${chartHeight - paddingBottom} L ${paddingLeft} ${chartHeight - paddingBottom} Z`;

    const totalPath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yTotal}`).join(' ') + 
      ` L ${coords[coords.length - 1].x} ${chartHeight - paddingBottom} L ${paddingLeft} ${chartHeight - paddingBottom} Z`;

    const totalLinePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yTotal}`).join(' ');

    return { invested: investedPath, total: totalPath, line: totalLinePath, coordinates: coords };
  }, [result.yearlyData, chartWidth, chartHeight]);



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)]">{t.sipCalc.title}</h2>
          </div>

          {/* Initial Balance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.sipCalc.lumpSumLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.currencySymbol}</span>
                <input 
                  type="number" 
                  value={initialBalance === 0 ? '' : initialBalance} 
                  onChange={(e) => setInitialBalance(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={lumpSumMin} 
              max={lumpSumMax} 
              step={lumpSumStep}
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.sipCalc.lumpSumMinMax.split(' - ')[0]}</span>
              <span>{t.sipCalc.lumpSumMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Monthly Investment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.sipCalc.monthlyLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-28 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.currencySymbol}</span>
                <input 
                  type="number" 
                  value={monthly === 0 ? '' : monthly} 
                  onChange={(e) => setMonthly(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={monthlyMin} 
              max={monthlyMax} 
              step={monthlyStep}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.sipCalc.monthlyMinMax.split(' - ')[0]}</span>
              <span>{t.sipCalc.monthlyMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Return Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.sipCalc.rateLabel}</span>
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
              max={30} 
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.sipCalc.rateMinMax.split(' - ')[0]}</span>
              <span>{t.sipCalc.rateMinMax.split(' - ')[1]}</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">{t.sipCalc.durationLabel}</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  value={years === 0 ? '' : years} 
                  onChange={(e) => setYears(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">{t.yearShort}</span>
              </div>
            </div>
            <input 
              type="range" 
              min={1} 
              max={40} 
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>{t.sipCalc.durationMinMax.split(' - ')[0]}</span>
              <span>{t.sipCalc.durationMinMax.split(' - ')[1]}</span>
            </div>
          </div>
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light">
          💡 {t.sipCalc.infoBox}
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>{t.sipCalc.cardInvested}</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-heading)]">
              {formatCurrency(result.totalInvested, locale)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.sipCalc.cardGrowth}</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {formatCurrency(result.wealthGained, locale)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.sipCalc.cardTotal}</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-accent)]">
              {formatCurrency(result.futureValue, locale)}
            </div>
          </div>
        </div>

        {/* Graph Display Card */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)]">
              {t.sipCalc.chartTitle}
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
                const maxVal = Math.max(...result.yearlyData.map(d => d.totalValue), 100);
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
                const tickYears = getXAxisTicks(years);
                return (
                  <g className="select-none pointer-events-none">
                    {tickYears.map((y) => {
                      const idx = result.yearlyData.findIndex(d => d.year === y);
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
                  {/* Area filled paths */}
                  <path d={points.total} fill="url(#totalGrad)" className="transition-all duration-500" />
                  <path d={points.invested} fill="url(#investedGrad)" className="transition-all duration-500" />

                  {/* Line paths */}
                  <path d={points.line} stroke="var(--theme-accent)" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500 animate-graph-line graph-glow" />
                </>
              ) : (
                <g>
                  {points.coordinates.map((c, i) => {
                    const stepX = points.coordinates.length > 1 ? (chartWidth - paddingLeft - paddingRight) / (points.coordinates.length - 1) : chartWidth - paddingLeft - paddingRight;
                    const barWidth = Math.max(3, stepX * 0.7);
                    
                    const maxVal = Math.max(...result.yearlyData.map(d => d.totalValue), 100);
                    const totalHeight = (c.data.totalValue / maxVal) * (chartHeight - paddingTop - paddingBottom);
                    const investedHeight = (c.data.invested / maxVal) * (chartHeight - paddingTop - paddingBottom);
                    const growthHeight = Math.max(0, totalHeight - investedHeight);

                    const isHovered = hoveredIdx === i;
                    const isAnyHovered = hoveredIdx !== null;

                    return (
                      <g 
                        key={i} 
                        className="transition-all duration-300"
                        style={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.6) : 1 }}
                      >
                        {/* Invested portion rect */}
                        <rect
                          x={c.x - barWidth / 2}
                          y={chartHeight - paddingBottom - investedHeight}
                          width={barWidth}
                          height={investedHeight}
                          fill="url(#barInvestedGrad)"
                          rx={1.5}
                          className="transition-all duration-500"
                        />
                        {/* Growth portion rect */}
                        <rect
                          x={c.x - barWidth / 2}
                          y={chartHeight - paddingBottom - totalHeight}
                          width={barWidth}
                          height={growthHeight}
                          fill="url(#barGrowthGrad)"
                          rx={1.5}
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
                    cy={c.yTotal} 
                    r={hoveredIdx === i ? "6" : "4"} 
                    fill="var(--theme-accent)" 
                    stroke="var(--theme-panel)" 
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onTouchStart={() => setHoveredIdx(i)}
                    onClick={() => setYears(c.data.year)}
                  />
                  <circle 
                    cx={c.x} 
                    cy={c.yTotal} 
                    r="12" 
                    fill="transparent" 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onTouchStart={() => setHoveredIdx(i)}
                    onClick={() => setYears(c.data.year)}
                  />
                </g>
              ))}

              {/* Gradients */}
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="barGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="barInvestedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Custom SVG Chart Tooltip */}
            {hoveredIdx !== null && points.coordinates[hoveredIdx] && (
              <div 
                className="absolute z-20 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl p-3 shadow-md pointer-events-none text-[11px] transition-all duration-150 animate-in fade-in zoom-in-95 text-left"
                style={{
                  left: `${(points.coordinates[hoveredIdx].x / chartWidth) * 100}%`,
                  bottom: '75px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="font-bold text-[var(--theme-heading)]">{t.yearShort} {points.coordinates[hoveredIdx].data.year}</div>
                <div className="text-[var(--theme-text)] opacity-85">{t.sipCalc.tooltipInvested}: <span className="font-semibold">{formatCurrency(points.coordinates[hoveredIdx].data.invested, locale)}</span></div>
                <div className="text-[var(--theme-accent)]">{t.sipCalc.tooltipTotal}: <span className="font-bold">{formatCurrency(points.coordinates[hoveredIdx].data.totalValue, locale)}</span></div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
