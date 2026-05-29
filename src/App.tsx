import { useState, useEffect } from 'react';
import { ThemeSelector } from './components/ThemeSelector';
import type { ThemeType } from './components/ThemeSelector';
import type { LocaleType } from './utils/locale';
import { localeConfigs } from './utils/locale';
import { SipCalculator } from './components/SipCalculator';
import { SwpCalculator } from './components/SwpCalculator';
import { MortgageOverpayment } from './components/MortgageOverpayment';
import { FireCalculator } from './components/FireCalculator';
import { TaxOptimizer } from './components/TaxOptimizer';
import { TrendingUp, Landmark, Home, Target, Landmark as TaxIcon, Plus, X } from 'lucide-react';

type TabType = 'sip' | 'swp' | 'mortgage' | 'fire' | 'tax';

const getInitialTheme = (): ThemeType => {
  const saved = localStorage.getItem('theme') as ThemeType;
  if (saved && ['light', 'dark', 'pink', 'unicorn'].includes(saved)) {
    return saved;
  }
  return 'light';
};

const getInitialLocale = (): LocaleType => {
  const saved = localStorage.getItem('locale') as LocaleType;
  if (saved && ['in', 'uk', 'us', 'fr', 'de', 'ar'].includes(saved)) {
    return saved;
  }
  
  // Detect based on browser language
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    if (!lang) continue;
    const lowerLang = lang.toLowerCase();
    if (lowerLang.startsWith('en-gb')) return 'uk';
    if (lowerLang.startsWith('en-in') || lowerLang.includes('hi')) return 'in';
    if (lowerLang.startsWith('en')) return 'us';
    if (lowerLang.startsWith('fr')) return 'fr';
    if (lowerLang.startsWith('de')) return 'de';
    if (lowerLang.startsWith('ar')) return 'ar';
  }
  
  return 'uk';
};

const getInitialPinnedTabs = (locale: LocaleType): TabType[] => {
  const saved = localStorage.getItem('pinned_tabs');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as TabType[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(id => id !== 'tax' || locale === 'uk');
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  const defaults: TabType[] = ['sip', 'swp', 'mortgage', 'fire'];
  if (locale === 'uk') {
    defaults.push('tax');
  }
  return defaults;
};

function App() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);
  const [locale, setLocale] = useState<LocaleType>(getInitialLocale);
  const [pinnedTabs, setPinnedTabs] = useState<TabType[]>(() => getInitialPinnedTabs(locale));
  const [activeTab, setActiveTab] = useState<TabType>(() => pinnedTabs[0] || 'sip');
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  // Sync pinned tabs when locale changes (e.g. filter out tax if leaving UK)
  useEffect(() => {
    setPinnedTabs(prev => {
      const filtered = prev.filter(id => id !== 'tax' || locale === 'uk');
      if (filtered.length === 0) {
        return ['sip'];
      }
      return filtered;
    });
  }, [locale]);

  // Sync pinned tabs to localStorage
  useEffect(() => {
    localStorage.setItem('pinned_tabs', JSON.stringify(pinnedTabs));
  }, [pinnedTabs]);

  // Auto-redirect active tab if it gets unpinned or disabled
  useEffect(() => {
    if (!pinnedTabs.includes(activeTab)) {
      setActiveTab(pinnedTabs[0] || 'sip');
    }
  }, [pinnedTabs, activeTab]);

  // Sync theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync locale preference to localStorage
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const handleUnpin = (tabId: TabType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinnedTabs.length <= 1) return;
    const newPinned = pinnedTabs.filter(id => id !== tabId);
    setPinnedTabs(newPinned);
  };

  const handlePin = (tabId: TabType) => {
    if (pinnedTabs.length >= 5) return;
    const newPinned = [...pinnedTabs, tabId];
    setPinnedTabs(newPinned);
    setActiveTab(tabId);
    setIsAddDropdownOpen(false);
  };

  const config = localeConfigs[locale];

  const tabs: { id: TabType; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'sip',
      name: config.tabs.sip.title,
      icon: <TrendingUp className="w-4 h-4" />,
      desc: config.tabs.sip.desc
    },
    {
      id: 'swp',
      name: config.tabs.swp.title,
      icon: <Landmark className="w-4 h-4" />,
      desc: config.tabs.swp.desc
    },
    {
      id: 'mortgage',
      name: config.tabs.mortgage.title,
      icon: <Home className="w-4 h-4" />,
      desc: config.tabs.mortgage.desc
    },
    {
      id: 'fire',
      name: config.tabs.fire.title,
      icon: <Target className="w-4 h-4" />,
      desc: config.tabs.fire.desc
    },
    {
      id: 'tax',
      name: config.tabs.tax.title,
      icon: <TaxIcon className="w-4 h-4" />,
      desc: config.tabs.tax.desc
    }
  ];

  const availableCalculators = tabs.filter(t => t.id !== 'tax' || locale === 'uk');
  const unpinnedCalculators = availableCalculators.filter(t => !pinnedTabs.includes(t.id));
  const pinnedTabObjects = pinnedTabs.map(id => tabs.find(t => t.id === id)).filter(Boolean) as typeof tabs;

  return (
    <div className={`theme-${theme} min-h-screen transition-colors duration-500 bg-[var(--theme-bg)] flex flex-col justify-between`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner and Theme Selector */}
      <header className="relative z-10 w-full">
        <ThemeSelector theme={theme} setTheme={setTheme} locale={locale} setLocale={setLocale} />
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center py-8">
        
        {/* Navigation Selector */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 select-none">
          <div className="flex flex-wrap md:flex-nowrap items-stretch gap-2.5 p-1.5 rounded-3xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm transition-all duration-300 w-full relative">
            
            {/* Pinned Tab Buttons */}
            {pinnedTabObjects.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border flex-1 min-w-[140px] md:min-w-0 ${
                  activeTab === tab.id
                    ? 'bg-[var(--theme-accent-light)] text-[var(--theme-accent)] border-[var(--theme-accent)]/20 shadow-sm font-bold scale-[1.02]'
                    : 'border-transparent text-[var(--theme-text)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-heading)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-[var(--theme-panel)] text-[var(--theme-accent)]' : 'bg-transparent'}`}>
                    {tab.icon}
                  </span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">{tab.name}</span>
                    <span className="hidden sm:inline text-[10px] opacity-70 font-light">
                      {tab.desc}
                    </span>
                  </div>
                </div>

                {/* Close Button (Unpin) */}
                {pinnedTabs.length > 1 && (
                  <button
                    onClick={(e) => handleUnpin(tab.id, e)}
                    className="p-1 rounded-full hover:bg-[var(--theme-panel)] text-[var(--theme-text)] opacity-40 hover:opacity-100 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                    title="Remove calculator tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}

            {/* Add Calculator Button */}
            {unpinnedCalculators.length > 0 && (
              <div className="relative flex-1 md:flex-initial min-w-[140px]">
                <button
                  onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                  className={`w-full h-full flex items-center justify-center gap-1.5 p-3.5 rounded-2xl border border-dashed border-[var(--theme-border)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent-light)] transition-all duration-300 cursor-pointer font-bold text-xs sm:text-sm shadow-sm ${
                    isAddDropdownOpen ? 'bg-[var(--theme-accent-light)] border-[var(--theme-accent)]/30' : ''
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Calculator</span>
                </button>

                {/* Dropdown Menu Overlay */}
                {isAddDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsAddDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-lg p-2.5 z-50 animate-fade-in flex flex-col gap-1">
                      <div className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text)] opacity-50 px-2.5 py-1.5 border-b border-[var(--theme-border)]">
                        More Calculators
                      </div>
                      {unpinnedCalculators.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handlePin(tab.id)}
                          className="flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-[var(--theme-bg)] transition-all duration-200 cursor-pointer w-full"
                        >
                          <span className="p-1.5 rounded-lg bg-[var(--theme-accent-light)] text-[var(--theme-accent)] mt-0.5">
                            {tab.icon}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--theme-heading)]">{tab.name}</span>
                            <span className="text-[10px] text-[var(--theme-text)] opacity-70 leading-normal">{tab.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Panel View */}
        <div className="w-full transition-all duration-500">
          {activeTab === 'sip' && <SipCalculator locale={locale} />}
          {activeTab === 'swp' && <SwpCalculator locale={locale} />}
          {activeTab === 'mortgage' && <MortgageOverpayment locale={locale} />}
          {activeTab === 'fire' && <FireCalculator locale={locale} />}
          {activeTab === 'tax' && <TaxOptimizer locale={locale} />}
        </div>
      </main>

      {/* Bottom Footer Section */}
      <footer className="relative z-10 w-full py-8 border-t border-[var(--theme-border)] text-center select-none bg-[var(--theme-panel)] transition-colors duration-300">
        <p className="text-xs uppercase font-bold tracking-widest text-[var(--theme-text)] opacity-70 mb-1">
          ✦ GrowthCalc ✦
        </p>
        <p className="text-xs text-[var(--theme-text)] opacity-50">
          Created for interactive planning, compounding visualizations, and tax efficiency modeling.
        </p>
      </footer>
      
    </div>
  );
}

export default App;
