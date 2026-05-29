import React, { useState, useMemo } from 'react';
import { Target, HelpCircle, Activity, Award } from 'lucide-react';
import { calculateFire } from '../utils/calc';

export const FireCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(30);
  const [expenses, setExpenses] = useState<number>(30000);
  const [netWorth, setNetWorth] = useState<number>(50000);
  const [monthlySavings, setMonthlySavings] = useState<number>(1000);
  const [rate, setRate] = useState<number>(7);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line');

  // Compute FIRE projections
  const result = useMemo(() => 
    calculateFire(age, expenses, netWorth, monthlySavings, rate),
    [age, expenses, netWorth, monthlySavings, rate]
  );

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Compact currency formatting (e.g. £1.5M, £250k)
  const formatCompact = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      notation: 'compact',
      compactDisplay: 'short',
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 1,
    }).format(val);
  };

  const getXAxisTicks = (totalYears: number) => {
    if (totalYears <= 5) return Array.from({ length: totalYears + 1 }, (_, i) => i);
    if (totalYears <= 12) return Array.from({ length: Math.floor(totalYears / 2) + 1 }, (_, i) => i * 2);
    if (totalYears <= 25) return Array.from({ length: Math.floor(totalYears / 5) + 1 }, (_, i) => i * 5);
    return Array.from({ length: Math.floor(totalYears / 10) + 1 }, (_, i) => i * 10);
  };

  // Chart properties
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;

  // Generate SVG coordinates for net worth accumulation vs FIRE target flatline
  const points = useMemo(() => {
    if (result.yearlyBalances.length === 0) return { line: '', targetLine: '', coordinates: [] };

    // Max value is either target or the final compounded net worth (whichever is larger)
    const maxVal = Math.max(result.fireTarget, ...result.yearlyBalances.map(b => b.balance), 100);
    const innerWidth = chartWidth - paddingLeft - paddingRight;
    const innerHeight = chartHeight - paddingTop - paddingBottom;
    const stepX = innerWidth / (result.yearlyBalances.length - 1 || 1);

    const coords = result.yearlyBalances.map((d, i) => {
      const x = paddingLeft + i * stepX;
      const y = chartHeight - paddingBottom - (d.balance / maxVal) * innerHeight;
      const yTarget = chartHeight - paddingBottom - (result.fireTarget / maxVal) * innerHeight;
      return { x, y, yTarget, data: d };
    });

    const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    // Target is a straight horizontal line on the yTarget value
    const targetLine = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.yTarget}`).join(' ');

    return { line, targetLine, coordinates: coords };
  }, [result.yearlyBalances, result.fireTarget, chartWidth, chartHeight]);



  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)] font-display">FIRE Calculator</h2>
          </div>

          {/* Current Age Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Current Age</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  value={age === 0 ? '' : age} 
                  onChange={(e) => setAge(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">Yrs</span>
              </div>
            </div>
            <input 
              type="range" 
              min={18} 
              max={65} 
              step={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>18</span>
              <span>65</span>
            </div>
          </div>

          {/* Retirement Annual Expenses Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)] flex items-center gap-1">
                <span>Retirement Annual Spend</span>
                <span className="group relative cursor-pointer text-stone-400 hover:text-stone-600">
                  <HelpCircle className="w-3 h-3" />
                  <span className="absolute bottom-5 left-0 z-30 hidden group-hover:block w-48 bg-stone-900 text-white text-[9px] p-2 rounded-lg leading-normal select-none pointer-events-none shadow">
                    Your estimated annual expenses once you retire, in today's money.
                  </span>
                </span>
              </span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={expenses === 0 ? '' : expenses} 
                  onChange={(e) => setExpenses(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={5000} 
              max={250000} 
              step={100}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£5k</span>
              <span>£250k</span>
            </div>
          </div>

          {/* Current Net Worth Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Current Net Worth</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={netWorth === 0 ? '' : netWorth} 
                  onChange={(e) => setNetWorth(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={1000000} 
              step={1000}
              value={netWorth}
              onChange={(e) => setNetWorth(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£0</span>
              <span>£1M</span>
            </div>
          </div>

          {/* Monthly Savings Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Monthly Savings</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-28 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={monthlySavings === 0 ? '' : monthlySavings} 
                  onChange={(e) => setMonthlySavings(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={15000} 
              step={10}
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>None</span>
              <span>£15,000 / mo</span>
            </div>
          </div>

          {/* Growth Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Net Investment Return</span>
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
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light font-display">
          💡 FIRE stands for **Financial Independence, Retire Early**. The 25x target represents a **4% Safe Withdrawal Rate** to cover your annual costs.
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>FIRE Number</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-amber-500">
              {formatCurrency(result.fireTarget)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Years to FIRE</span>
            </div>
            <div className="text-sm sm:text-base lg:text-lg font-black text-[var(--theme-accent)]">
              {result.isFeasible ? `${result.yearsToFire} Yrs` : '> 50 Yrs'}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span>FIRE Age</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {result.isFeasible ? `${result.projectedAge} Yrs` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Compounding Accumulation Graph */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)]">
              Wealth Accumulation vs FIRE Target
            </h3>
            <div className="flex bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-0.5 text-xs select-none">
              <button 
                onClick={() => setGraphType('line')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${graphType === 'line' ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)] shadow-sm' : 'text-[var(--theme-text)] opacity-70 hover:opacity-100'}`}
              >
                Line
              </button>
              <button 
                onClick={() => setGraphType('bar')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${graphType === 'bar' ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)] shadow-sm' : 'text-[var(--theme-text)] opacity-70 hover:opacity-100'}`}
              >
                Bar
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
              <line x1={paddingLeft} y1={chartHeight/2} x2={chartWidth - paddingRight} y2={chartHeight/2} stroke="var(--theme-border)" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} stroke="var(--theme-border)" strokeWidth="1" />

              {/* FIRE Target line */}
              <path d={points.targetLine} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" className="transition-all duration-500 z-10" />

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
                const maxVal = Math.max(result.fireTarget, ...result.yearlyBalances.map(b => b.balance), 100);
                return (
                  <g className="select-none pointer-events-none">
                    <line x1={paddingLeft - 4} y1={paddingTop} x2={paddingLeft} y2={paddingTop} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={paddingTop} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      {formatCompact(maxVal)}
                    </text>

                    <line x1={paddingLeft - 4} y1={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} x2={paddingLeft} y2={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={paddingTop + (chartHeight - paddingTop - paddingBottom)/2} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      {formatCompact(maxVal / 2)}
                    </text>

                    <line x1={paddingLeft - 4} y1={chartHeight - paddingBottom} x2={paddingLeft} y2={chartHeight - paddingBottom} stroke="var(--theme-border)" strokeWidth="1" />
                    <text x={paddingLeft - 8} y={chartHeight - paddingBottom} fontSize="9" textAnchor="end" dominantBaseline="middle" fill="var(--theme-text)" opacity="0.6">
                      £0
                    </text>
                  </g>
                );
              })()}

              {/* X Axis Ticks and Labels */}
              {(() => {
                const tickYears = getXAxisTicks(result.yearlyBalances.length - 1);
                return (
                  <g className="select-none pointer-events-none">
                    {tickYears.map((y) => {
                      const idx = result.yearlyBalances.findIndex(d => d.year === y);
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
                            Age {age + y}
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
                  {/* Accumulated Wealth line */}
                  <path d={points.line} stroke="var(--theme-accent)" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 animate-graph-line graph-glow" />
                </>
              ) : (
                <g>
                  {points.coordinates.map((c, i) => {
                    const stepX = points.coordinates.length > 1 ? (chartWidth - paddingLeft - paddingRight) / (points.coordinates.length - 1) : chartWidth - paddingLeft - paddingRight;
                    const barWidth = Math.max(3, stepX * 0.7);
                    
                    const maxVal = Math.max(result.fireTarget, ...result.yearlyBalances.map(b => b.balance), 100);
                    const balanceHeight = (c.data.balance / maxVal) * (chartHeight - paddingTop - paddingBottom);

                    const isHovered = hoveredIdx === i;
                    const isAnyHovered = hoveredIdx !== null;

                    return (
                      <rect
                        key={i}
                        x={c.x - barWidth / 2}
                        y={chartHeight - paddingBottom - balanceHeight}
                        width={barWidth}
                        height={balanceHeight}
                        fill="url(#fireBarGrad)"
                        rx={1.5}
                        className="transition-all duration-500"
                        style={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.6) : 1 }}
                      />
                    );
                  })}
                </g>
              )}

              {/* Interactive Hover Dots */}
              {points.coordinates.map((c, i) => (
                <g key={i}>
                  <circle 
                    cx={c.x} 
                    cy={c.y} 
                    r={hoveredIdx === i ? "6" : "4"} 
                    fill="var(--theme-accent)" 
                    stroke="var(--theme-panel)" 
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onTouchStart={() => setHoveredIdx(i)}
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
                  />
                </g>
              ))}

              <defs>
                <linearGradient id="fireBarGrad" x1="0" y1="0" x2="0" y2="1">
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
                <div className="font-bold text-[var(--theme-heading)]">Year {points.coordinates[hoveredIdx].data.year} (Age {age + points.coordinates[hoveredIdx].data.year})</div>
                <div className="text-[var(--theme-accent)]">Net Worth: <span className="font-bold">{formatCurrency(points.coordinates[hoveredIdx].data.balance)}</span></div>
                <div className="text-amber-600">FIRE Target: <span className="font-semibold">{formatCurrency(points.coordinates[hoveredIdx].data.target)}</span></div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
