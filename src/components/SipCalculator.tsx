import React, { useState, useMemo, useEffect } from 'react';
import { TrendingUp, Landmark, Award } from 'lucide-react';
import { calculateSip } from '../utils/calc';

interface SipCalculatorProps {
  theme: string;
}

export const SipCalculator: React.FC<SipCalculatorProps> = ({ theme }) => {
  const [initialBalance, setInitialBalance] = useState<number>(10000); // Default to £10,000 starting pot
  const [monthly, setMonthly] = useState<number>(500);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(15);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute SIP values
  const result = useMemo(() => calculateSip(monthly, rate, years, initialBalance), [monthly, rate, years, initialBalance]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 35;

  // Generate coordinates for SVG Path
  const points = useMemo(() => {
    if (result.yearlyData.length === 0) return { invested: '', total: '', coordinates: [] };

    const maxVal = Math.max(...result.yearlyData.map(d => d.totalValue), 100);
    const stepX = (chartWidth - padding * 2) / (result.yearlyData.length - 1 || 1);
    
    const coords = result.yearlyData.map((d, i) => {
      const x = padding + i * stepX;
      // SVG origin is top-left, so we subtract from height
      const yInvested = chartHeight - padding - (d.invested / maxVal) * (chartHeight - padding * 2);
      const yTotal = chartHeight - padding - (d.totalValue / maxVal) * (chartHeight - padding * 2);
      return { x, yInvested, yTotal, data: d };
    });

    // Create path strings
    const investedPath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yInvested}`).join(' ') + 
      ` L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

    const totalPath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yTotal}`).join(' ') + 
      ` L ${coords[coords.length - 1].x} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

    const totalLinePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yTotal}`).join(' ');

    return { invested: investedPath, total: totalPath, line: totalLinePath, coordinates: coords };
  }, [result.yearlyData, chartWidth, chartHeight, padding]);

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

  const [walkIdx, setWalkIdx] = useState<number>(0);

  // Animate the character from index 0 to the end index when the data updates
  useEffect(() => {
    setWalkIdx(0);
    let current = 0;
    const target = points.coordinates.length - 1;
    if (target <= 0) return;

    const interval = setInterval(() => {
      current++;
      setWalkIdx(current);
      if (current >= target) {
        clearInterval(interval);
      }
    }, 70); // 70ms per step

    return () => clearInterval(interval);
  }, [points.coordinates]);

  // Track coordinates of the character (falls back to current animated index if not hovered)
  const charPos = useMemo(() => {
    if (points.coordinates.length === 0) return null;
    const activeIdx = hoveredIdx !== null ? hoveredIdx : Math.min(walkIdx, points.coordinates.length - 1);
    return points.coordinates[activeIdx];
  }, [points.coordinates, hoveredIdx, walkIdx]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)]">SIP & Growth</h2>
          </div>

          {/* Initial Balance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Initial Investment / Lump Sum</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
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
              min={0} 
              max={1000000} 
              step={100}
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£0 (None)</span>
              <span>£1M</span>
            </div>
          </div>

          {/* Monthly Investment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Monthly Investment</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-28 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
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
              min={10} 
              max={5000} 
              step={1}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£10</span>
              <span>£5,000</span>
            </div>
          </div>

          {/* Return Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Expected Annual Return</span>
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
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Duration</span>
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
              min={1} 
              max={40} 
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>1 Yr</span>
              <span>40 Yrs</span>
            </div>
          </div>
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light">
          💡 A Systematic Investment Plan (SIP) utilizes <strong>compound interest</strong> to build wealth over time by investing a fixed amount regularly.
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Invested</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-heading)]">
              {formatCurrency(result.totalInvested)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Growth</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {formatCurrency(result.wealthGained)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Total Value</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-accent)]">
              {formatCurrency(result.futureValue)}
            </div>
          </div>
        </div>

        {/* Graph Display Card */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)] mb-4">
            Investment Growth Trajectory
          </h3>

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
              <path d={points.total} fill="url(#totalGrad)" className="transition-all duration-500" />
              <path d={points.invested} fill="url(#investedGrad)" className="transition-all duration-500" />

              {/* Hover Guide Line */}
              {hoveredIdx !== null && points.coordinates[hoveredIdx] && (
                <line 
                  x1={points.coordinates[hoveredIdx].x} 
                  y1={padding} 
                  x2={points.coordinates[hoveredIdx].x} 
                  y2={chartHeight - padding} 
                  stroke="var(--theme-accent)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  className="opacity-50 pointer-events-none"
                />
              )}

              {/* Line paths */}
              <path d={points.line} stroke="var(--theme-accent)" strokeWidth="3" strokeLinecap="round" className="transition-all duration-500" />

              {/* Walking Theme Character */}
              {charPos && (
                <g
                  style={{
                    transform: `translate(${charPos.x}px, ${Math.max(26, charPos.yTotal - 12)}px)`,
                    transition: 'transform 0.15s linear'
                  }}
                  className="select-none pointer-events-none"
                >
                  <text 
                    x="0" 
                    y="0" 
                    fontSize="22" 
                    textAnchor="middle"
                    fill="currentColor"
                    className="char-walk-animation"
                  >
                    {characterEmoji}
                  </text>
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
              </defs>
            </svg>

            {/* Custom SVG Chart Tooltip */}
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
                <div className="text-[var(--theme-text)] opacity-85">Invested: <span className="font-semibold">{formatCurrency(points.coordinates[hoveredIdx].data.invested)}</span></div>
                <div className="text-[var(--theme-accent)]">Total Value: <span className="font-bold">{formatCurrency(points.coordinates[hoveredIdx].data.totalValue)}</span></div>
              </div>
            )}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60 font-semibold px-4 pt-2">
            <span>Start</span>
            <span>Year {Math.round(years / 2)}</span>
            <span>Year {years}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
