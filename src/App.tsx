import { useState, useEffect } from 'react';
import { ThemeSelector } from './components/ThemeSelector';
import type { ThemeType } from './components/ThemeSelector';
import { SipCalculator } from './components/SipCalculator';
import { SwpCalculator } from './components/SwpCalculator';
import { MortgageOverpayment } from './components/MortgageOverpayment';
import { FireCalculator } from './components/FireCalculator';
import { TaxOptimizer } from './components/TaxOptimizer';
import { TrendingUp, Landmark, Home, Target, Landmark as TaxIcon } from 'lucide-react';

type TabType = 'sip' | 'swp' | 'mortgage' | 'fire' | 'tax';

const getInitialTheme = (): ThemeType => {
  const saved = localStorage.getItem('theme') as ThemeType;
  if (saved && ['light', 'dark', 'pink', 'unicorn'].includes(saved)) {
    return saved;
  }
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark ? 'dark' : 'light';
};

function App() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);
  const [activeTab, setActiveTab] = useState<TabType>('sip');

  // Sync theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const tabs: { id: TabType; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'sip',
      name: 'SIP Growth',
      icon: <TrendingUp className="w-4 h-4" />,
      desc: 'Compound regular savings'
    },
    {
      id: 'swp',
      name: 'Retirement SWP',
      icon: <Landmark className="w-4 h-4" />,
      desc: 'Systematic drawing plans'
    },
    {
      id: 'mortgage',
      name: 'Mortgage Overpay',
      icon: <Home className="w-4 h-4" />,
      desc: 'Clear property debt early'
    },
    {
      id: 'fire',
      name: 'FIRE Target',
      icon: <Target className="w-4 h-4" />,
      desc: 'Retire early milestone'
    },
    {
      id: 'tax',
      name: 'UK Tax Sacrifice',
      icon: <TaxIcon className="w-4 h-4" />,
      desc: 'Salary vs pension optimization'
    }
  ];

  return (
    <div className={`theme-${theme} min-h-screen transition-colors duration-500 bg-[var(--theme-bg)] flex flex-col justify-between`}>
      
      {/* Top Banner and Theme Selector */}
      <header className="relative z-10 w-full">
        <ThemeSelector theme={theme} setTheme={setTheme} />
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center py-8">
        
        {/* Navigation Selector */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 select-none">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 p-1.5 rounded-3xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm transition-all duration-300">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-[var(--theme-accent-light)] text-[var(--theme-accent)] border-[var(--theme-accent)]/20 shadow-sm font-bold scale-[1.02]'
                    : 'border-transparent text-[var(--theme-text)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-heading)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`p-1 rounded-lg ${activeTab === tab.id ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)]' : 'bg-transparent'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-tight">{tab.name}</span>
                </div>
                <span className="hidden sm:inline text-[10px] opacity-70 leading-tight">
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Panel View */}
        <div className="w-full transition-all duration-500">
          {activeTab === 'sip' && <SipCalculator theme={theme} />}
          {activeTab === 'swp' && <SwpCalculator theme={theme} />}
          {activeTab === 'mortgage' && <MortgageOverpayment theme={theme} />}
          {activeTab === 'fire' && <FireCalculator theme={theme} />}
          {activeTab === 'tax' && <TaxOptimizer />}
        </div>
      </main>

      {/* Bottom Footer Section */}
      <footer className="relative z-10 w-full py-8 border-t border-[var(--theme-border)] text-center select-none bg-[var(--theme-panel)] transition-colors duration-300">
        <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--theme-text)] opacity-70 mb-1">
          ✦ ForwardCalc ✦
        </p>
        <p className="text-[10px] text-[var(--theme-text)] opacity-50">
          Created for interactive planning, compounding visualizations, and tax efficiency modeling.
        </p>
      </footer>
      
    </div>
  );
}

export default App;
