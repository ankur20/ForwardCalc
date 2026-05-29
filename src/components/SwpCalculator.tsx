import React, { useState, useMemo } from 'react';
import { Landmark, ArrowUpRight, Flame, Hourglass } from 'lucide-react';
import { calculateSwp } from '../utils/calc';

interface SwpCalculatorProps {
  theme: string;
}

export const SwpCalculator: React.FC<SwpCalculatorProps> = ({ theme }) => {
  const [pot, setPot] = useState<number>(250000);
  const [withdrawal, setWithdrawal] = useState<number>(1500);
  const [rate, setRate] = useState<number>(6);
  const [years, setYears] = useState<number>(25);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute SWP values
  const result = useMemo(() => calculateSwp(pot, withdrawal, rate, years), [pot, withdrawal, rate, years]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // SVG Chart settings
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 35;

  // Generate SVG coordinates for Balance curve
  const points = useMemo(() => {
    if (result.yearlyData.length === 0) return { line: '', area: '', coordinates: [] };

    // Max val can be pot or if the pot actually grows (highly possible if withdrawal is small!)
    const maxVal = Math.max(pot, ...result.yearlyData.map(d => d.balance), 100);
    const stepX = (chartWidth - padding * 2) / (result.yearlyData.length - 1 || 1);

    const coords = result.yearlyData.map((d, i) => {
      const x = padding + i * stepX;
      const y = chartHeight - padding - (d.balance / maxVal) * (chartHeight - padding * 2);
      return { x, y, data: d };
    });

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const areaPath = linePath + ` L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

    return { line: linePath, area: areaPath, coordinates: coords };
  }, [result.yearlyData, pot, chartWidth, chartHeight, padding]);

  // Determine character emoji based on active theme
  const characterEmoji = useMemo(() => {
    switch (theme) {
      case 'dark':
        return '👾';
      case 'pink':
        return '🚶‍♀️';
      case 'unicorn':
        return '🦄';
      default:
        return '🚶‍♂️';
    }
  }, [theme]);

  // Track coordinates of the character (falls back to the end of the line if no hover index)
  const charPos = useMemo(() => {
    if (points.coordinates.length === 0) return null;
    const activeIdx = hoveredIdx !== null ? hoveredIdx : points.coordinates.length - 1;
    return points.coordinates[activeIdx];
  }, [points.coordinates, hoveredIdx]);

  const yearsLasted = Math.floor(result.monthsLasted / 12);
  const monthsLasted = result.monthsLasted % 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)]">Retirement SWP</h2>
          </div>

          {/* Capital Pot Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Starting Retirement Pot</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={pot === 0 ? '' : pot} 
                  onChange={(e) => setPot(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={10000} 
              max={2000000} 
              step={1000}
              value={pot}
              onChange={(e) => setPot(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£10k</span>
              <span>£2M</span>
            </div>
          </div>

          {/* Monthly Withdrawal Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Monthly Withdrawal</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-28 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={withdrawal === 0 ? '' : withdrawal} 
                  onChange={(e) => setWithdrawal(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={100} 
              max={15000} 
              step={10}
              value={withdrawal}
              onChange={(e) => setWithdrawal(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£100</span>
              <span>£15,000</span>
            </div>
          </div>

          {/* Return Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Annual Growth Rate</span>
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
              max={15} 
              step={0.01}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Time Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Simulation Period</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  value={years === 0 ? '' : years} 
                  onChange={(e) => setYears(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">Yrs</span>
              </div>
            </div>
            <input 
              type="range" 
              min={5} 
              max={40} 
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>5 Yrs</span>
              <span>40 Yrs</span>
            </div>
          </div>
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light">
          💡 A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed income from your retirement fund, while the remaining balance continues to grow.
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Total Pay</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {formatCurrency(result.totalWithdrawn)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Pot Lasts</span>
            </div>
            <div className={`text-xs sm:text-base lg:text-lg font-black ${result.isDepleted ? 'text-rose-500' : 'text-emerald-500'}`}>
              {result.isDepleted ? `${yearsLasted}y ${monthsLasted}m` : 'Infinite / Full'}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-amber-500" />
              <span>End Pot</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-heading)]">
              {formatCurrency(result.finalBalance)}
            </div>
          </div>
        </div>

        {/* Depletion Graph Card */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)]">
              Retirement Capital Over Time
            </h3>
            {result.isDepleted && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 uppercase bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <Flame className="w-3 h-3" />
                <span>Depletion Risk</span>
              </span>
            )}
          </div>

          <div className="relative w-full flex items-center justify-center">
            <svg 
              className="w-full h-auto max-h-[220px]" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              fill="none"
            >
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--theme-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={padding} y1={chartHeight/2} x2={chartWidth - padding} y2={chartHeight/2} stroke="var(--theme-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--theme-border)" strokeWidth="1" />

              {/* Area filled paths */}
              <path d={points.area} fill="url(#balanceGrad)" className="transition-all duration-500" />

              {/* Hover Guide Line */}
              {hoveredIdx !== null && points.coordinates[hoveredIdx] && (
                <line 
                  x1={points.coordinates[hoveredIdx].x} 
                  y1={padding} 
                  x2={points.coordinates[hoveredIdx].x} 
                  y2={chartHeight - padding} 
                  stroke={result.isDepleted ? '#ef4444' : 'var(--theme-accent)'} 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  className="opacity-50 pointer-events-none"
                />
              )}

              {/* Line paths */}
              <path 
                d={points.line} 
                stroke={result.isDepleted ? '#ef4444' : 'var(--theme-accent)'} 
                strokeWidth="3" 
                strokeLinecap="round" 
                className="transition-all duration-500" 
              />

              {/* Walking Theme Character */}
              {charPos && (
                <text 
                  x={charPos.x} 
                  y={Math.max(26, charPos.y - 12)} 
                  fontSize="22" 
                  textAnchor="middle"
                  fill="currentColor"
                  className="transition-all duration-300 select-none pointer-events-none animate-bounce"
                >
                  {characterEmoji}
                </text>
              )}

              {/* Interactive Hover Dots */}
              {points.coordinates.map((c, i) => (
                <g key={i}>
                  <circle 
                    cx={c.x} 
                    cy={c.y} 
                    r={hoveredIdx === i ? "6" : "4"} 
                    fill={result.isDepleted ? '#ef4444' : 'var(--theme-accent)'} 
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
                    cy={c.y} 
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
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={result.isDepleted ? '#ef4444' : 'var(--theme-accent)'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={result.isDepleted ? '#ef4444' : 'var(--theme-accent)'} stopOpacity="0.0" />
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
                <div className="font-bold text-[var(--theme-heading)]">Year {points.coordinates[hoveredIdx].data.year}</div>
                <div className="text-[var(--theme-text)] opacity-85">withdrawn: <span className="font-semibold">{formatCurrency(points.coordinates[hoveredIdx].data.withdrawn)}</span></div>
                <div className="text-[var(--theme-accent)]">Remaining Pot: <span className="font-bold">{formatCurrency(points.coordinates[hoveredIdx].data.balance)}</span></div>
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60 font-semibold px-4 pt-2">
            <span>Pot Start</span>
            <span>Year {Math.round(years / 2)}</span>
            <span>Year {years}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
