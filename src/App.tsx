import { useState, useEffect, useRef } from 'react';
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

const getInitialSlots = (locale: LocaleType): (TabType | null)[] => {
  const saved = localStorage.getItem('calculator_slots');
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as (TabType | null)[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const maxSlots = locale === 'uk' ? 5 : 4;
        let cleaned = parsed.map(id => (id === 'tax' && locale !== 'uk' ? null : id));
        if (cleaned.length > maxSlots) {
          cleaned = cleaned.slice(0, maxSlots);
        } else {
          while (cleaned.length < maxSlots) {
            cleaned.push(null);
          }
        }
        return cleaned;
      }
    } catch (e) {
      // Ignore
    }
  }
  const defaults: (TabType | null)[] = ['sip', 'swp', 'mortgage', 'fire'];
  if (locale === 'uk') {
    defaults.push('tax');
  }
  return defaults;
};

function App() {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);
  const [locale, setLocale] = useState<LocaleType>(getInitialLocale);
  const [slots, setSlots] = useState<(TabType | null)[]>(() => getInitialSlots(locale));
  const [activeTab, setActiveTab] = useState<TabType>('sip');
  const [openDropdownSlotIndex, setOpenDropdownSlotIndex] = useState<number | null>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selector on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      selectorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Sync slots when locale changes (e.g. adjust slot size, clean 'tax')
  useEffect(() => {
    setSlots(prev => {
      const maxSlots = locale === 'uk' ? 5 : 4;
      let cleaned = prev.map(id => (id === 'tax' && locale !== 'uk' ? null : id));
      if (cleaned.length > maxSlots) {
        cleaned = cleaned.slice(0, maxSlots);
      } else {
        while (cleaned.length < maxSlots) {
          cleaned.push(null);
        }
      }
      return cleaned;
    });
  }, [locale]);

  // Sync slots to localStorage
  useEffect(() => {
    localStorage.setItem('calculator_slots', JSON.stringify(slots));
  }, [slots]);

  // Auto-redirect active tab if its slot becomes empty
  useEffect(() => {
    if (!slots.includes(activeTab)) {
      const firstNonNull = slots.find(id => id !== null);
      if (firstNonNull) {
        setActiveTab(firstNonNull);
      }
    }
  }, [slots, activeTab]);

  // Sync theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync locale preference to localStorage
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const handleRemoveSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const activeSlotsCount = slots.filter(id => id !== null).length;
    if (activeSlotsCount <= 1) return; // Keep at least one active
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
  };

  const handleAssignSlot = (slotIndex: number, tabId: TabType) => {
    const newSlots = [...slots];
    newSlots[slotIndex] = tabId;
    setSlots(newSlots);
    setActiveTab(tabId);
    setOpenDropdownSlotIndex(null);
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
  const assignedIds = slots.filter(id => id !== null) as TabType[];
  const unassignedCalculators = availableCalculators.filter(t => !assignedIds.includes(t.id));

  return (
    <div className={`theme-${theme} min-h-screen transition-colors duration-500 bg-[var(--theme-bg)] flex flex-col justify-between`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner and Theme Selector */}
      <header className="relative z-10 w-full">
        <ThemeSelector theme={theme} setTheme={setTheme} locale={locale} setLocale={setLocale} />
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center py-8">
        
        {/* Navigation Selector */}
        <div ref={selectorRef} className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 select-none">
          <div className={`grid grid-cols-2 ${slots.length === 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-4'} gap-2.5 p-1.5 rounded-3xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm transition-all duration-300 w-full relative`}>
            {slots.map((slotId, slotIndex) => {
              if (slotId !== null) {
                const tab = tabs.find(t => t.id === slotId)!;
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all duration-300 cursor-pointer border min-h-[64px] ${
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

                    {/* Close Button (Unassign/Remove from slot) */}
                    {slots.filter(id => id !== null).length > 1 && (
                      <button
                        onClick={(e) => handleRemoveSlot(slotIndex, e)}
                        className="p-1 rounded-full hover:bg-[var(--theme-panel)] text-[var(--theme-text)] opacity-40 hover:opacity-100 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                        title="Remove calculator"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              } else {
                return (
                  <div
                    key={`empty-${slotIndex}`}
                    className={`relative flex items-center justify-center p-3.5 rounded-2xl border border-dashed border-[var(--theme-border)] text-[var(--theme-text)] opacity-60 hover:opacity-100 hover:bg-[var(--theme-accent-light)]/20 hover:border-[var(--theme-accent)]/30 hover:text-[var(--theme-accent)] transition-all duration-300 cursor-pointer min-h-[64px] ${
                      openDropdownSlotIndex === slotIndex ? 'bg-[var(--theme-accent-light)]/20 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]' : ''
                    }`}
                    onClick={() => setOpenDropdownSlotIndex(slotIndex)}
                  >
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                      <Plus className="w-4 h-4" />
                      <span>Choose Calculator</span>
                    </div>

                    {/* Dropdown Menu for this slot */}
                    {openDropdownSlotIndex === slotIndex && (
                      <>
                        <div 
                          className="fixed inset-0 z-40 bg-transparent" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownSlotIndex(null);
                          }} 
                        />
                        <div className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 top-full mt-2 w-72 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-lg p-2.5 z-50 animate-fade-in flex flex-col gap-1">
                          <div className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text)] opacity-50 px-2.5 py-1.5 border-b border-[var(--theme-border)]">
                            Choose Calculator
                          </div>
                          {unassignedCalculators.length === 0 ? (
                            <div className="text-xs text-[var(--theme-text)] opacity-50 px-2.5 py-3 text-center">
                              All calculators are in use!
                            </div>
                          ) : (
                            unassignedCalculators.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignSlot(slotIndex, tab.id);
                                }}
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
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              }
            })}
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
