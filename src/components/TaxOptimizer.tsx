import React, { useState, useMemo } from 'react';
import { Award, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { calculateUkTax } from '../utils/calc';

export const TaxOptimizer: React.FC = () => {
  const [salary, setSalary] = useState<number>(65000);
  const [pensionPercent, setPensionPercent] = useState<number>(8);

  const result = useMemo(() => calculateUkTax(salary, pensionPercent), [salary, pensionPercent]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Check if they are in the "60% tax trap" (£100k - £125,140)
  const isInSixtyPercentTrap = salary > 100000 && salary < 125140;
  // Check if sacrifice helps them escape it
  const escapesSixtyPercentTrap = isInSixtyPercentTrap && result.taxableSalary <= 100000;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Column */}
      <div className="lg:col-span-5 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm transition-all duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 className="text-xl font-bold text-[var(--theme-heading)] font-display">Tax Optimizer</h2>
          </div>

          {/* Salary Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Annual Gross Salary</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-32 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <span className="text-xs font-bold text-[var(--theme-accent)]">£</span>
                <input 
                  type="number" 
                  value={salary === 0 ? '' : salary} 
                  onChange={(e) => setSalary(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
            <input 
              type="range" 
              min={15000} 
              max={250000} 
              step={100}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>£15k</span>
              <span>£250k</span>
            </div>
          </div>

          {/* Pension Sacrifice Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-[var(--theme-text)]">Salary Sacrifice Contribution</span>
              <div className="flex items-center gap-1 bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-xl px-2.5 py-1 w-24 focus-within:border-[var(--theme-accent)] transition-all duration-300">
                <input 
                  type="number" 
                  step="0.01"
                  value={pensionPercent === 0 ? '' : pensionPercent} 
                  onChange={(e) => setPensionPercent(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-transparent border-none text-right font-black text-sm text-[var(--theme-heading)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-bold text-[var(--theme-accent)]">%</span>
              </div>
            </div>
            <input 
              type="range" 
              min={0} 
              max={40} 
              step={0.01}
              value={pensionPercent}
              onChange={(e) => setPensionPercent(Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-[var(--theme-text)] opacity-60">
              <span>0% (Opt Out)</span>
              <span>40%</span>
            </div>
          </div>

          {/* Alert messages for tax bracket traps */}
          {isInSixtyPercentTrap && (
            <div className={`p-4 rounded-2xl border text-xs leading-normal flex gap-3 ${
              escapesSixtyPercentTrap 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-800'
            }`}>
              {escapesSixtyPercentTrap ? (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p>
                    🎉 <strong>Amazing!</strong> By sacrificing {pensionPercent}%, you've brought your taxable income below £100,000, escaping the <strong>60% tax trap</strong> and restoring your full Personal Allowance!
                  </p>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p>
                    ⚠️ <strong>60% Tax Trap:</strong> Between £100k and £125k, your Personal Allowance tapers, creating a 60% effective tax rate. Consider sacrificing to bring your taxable salary under £100k!
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Informational Blurb */}
        <div className="pt-4 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] opacity-70 leading-relaxed font-light font-display">
          💡 **Salary Sacrifice** bypasses both **Income Tax** and **National Insurance**, making it the most tax-efficient way to build retirement wealth in the UK.
        </div>
      </div>

      {/* Visualiser Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pension Value</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-emerald-500">
              {formatCurrency(result.pensionGain)}
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Leverage Ratio</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-amber-500">
              {result.leverageRatio}x
            </div>
            <div className="text-[8px] text-stone-400 font-semibold uppercase mt-0.5">
              Pot gain vs net cost
            </div>
          </div>

          <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] p-4 rounded-2xl shadow-sm text-center">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-70 mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span>Tax/NI Saved</span>
            </div>
            <div className="text-sm sm:text-lg lg:text-xl font-black text-[var(--theme-accent)]">
              {formatCurrency(result.taxSaving + result.niSaving)}
            </div>
          </div>
        </div>

        {/* Visual Comparison Card */}
        <div className="bg-[var(--theme-panel)] border border-[var(--theme-border)] rounded-3xl p-6 flex-1 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--theme-heading)] mb-6">
            Net Take-Home vs Pension Allocation
          </h3>

          <div className="space-y-8 flex-1 flex flex-col justify-center">
            
            {/* Original Path */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[var(--theme-text)]">
                <span>Original Strategy (0% Sacrifice)</span>
                <span>Net Take-Home: {formatCurrency(result.originalTakeHome)}</span>
              </div>
              <div className="h-6 w-full rounded-xl bg-stone-200 overflow-hidden flex shadow-inner">
                {/* Take home bar */}
                <div 
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500" 
                  style={{ width: `${(result.originalTakeHome / salary) * 100}%` }}
                >
                  Take-Home
                </div>
                {/* Tax / NI bar */}
                <div 
                  className="bg-rose-500/90 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500" 
                  style={{ width: `${((result.originalTax + result.originalNi) / salary) * 100}%` }}
                >
                  Tax & NI
                </div>
              </div>
            </div>

            {/* Optimized Path */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[var(--theme-text)]">
                <span>Optimized Strategy ({pensionPercent}% Sacrifice)</span>
                <span className="text-[var(--theme-accent)]">Net Take-Home: {formatCurrency(result.newTakeHome)}</span>
              </div>
              <div className="h-6 w-full rounded-xl bg-stone-200 overflow-hidden flex shadow-inner">
                {/* Take home bar */}
                <div 
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500" 
                  style={{ width: `${(result.newTakeHome / salary) * 100}%` }}
                >
                  Take-Home
                </div>
                {/* Pension Contribution bar */}
                <div 
                  className="bg-amber-500 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500 animate-pulse" 
                  style={{ width: `${(result.pensionGain / salary) * 100}%` }}
                >
                  Pension Pot
                </div>
                {/* Tax / NI bar */}
                <div 
                  className="bg-rose-500/90 h-full flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500" 
                  style={{ width: `${((result.newTax + result.newNi) / salary) * 100}%` }}
                >
                  Tax & NI
                </div>
              </div>
            </div>

          </div>

          {/* Explanatory summary bottom row */}
          <div className="pt-6 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)] leading-relaxed font-light">
            👉 Putting <strong>{formatCurrency(result.pensionGain)}</strong> into your pension only reduced your take-home pay by <strong>{formatCurrency(result.takeHomeReduction)}</strong>. The government paid the remaining <strong>{formatCurrency(result.taxSaving + result.niSaving)}</strong> of your contribution!
          </div>
        </div>

      </div>

    </div>
  );
};
