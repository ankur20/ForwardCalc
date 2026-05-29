import React, { useState } from 'react';
import { Sun, Moon, Heart, Sparkles, Settings, X } from 'lucide-react';
import type { LocaleType } from '../utils/locale';
import { localeConfigs } from '../utils/locale';

export type ThemeType = 'light' | 'dark' | 'pink' | 'unicorn';

interface ThemeSelectorProps {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  locale: LocaleType;
  setLocale: (locale: LocaleType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme, locale, setLocale }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes: { id: ThemeType; name: string; icon: React.ReactNode; activeColor: string }[] = [
    {
      id: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      activeColor: 'bg-white text-indigo-600 border-indigo-600/10 shadow-sm',
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      activeColor: 'bg-slate-800 text-purple-400 border-slate-700 shadow-sm',
    },
    {
      id: 'pink',
      name: 'Pink',
      icon: <Heart className="w-4 h-4" />,
      activeColor: 'bg-rose-100 text-pink-600 border-pink-200 shadow-sm',
    },
    {
      id: 'unicorn',
      name: 'Unicorn',
      icon: <Sparkles className="w-4 h-4 animate-pulse" />,
      activeColor: 'bg-gradient-to-r from-red-200 via-yellow-100 via-green-100 via-blue-200 to-purple-200 text-indigo-950 font-bold border-indigo-200 shadow-md',
    },
  ];

  const handleThemeChange = (newTheme: ThemeType, e: React.MouseEvent<HTMLButtonElement>) => {
    setTheme(newTheme);

    // Unicorn click sparkles trigger
    if (newTheme === 'unicorn' || newTheme === 'pink') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'unicorn-sparkle';

        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'absolute';
        particle.style.left = `${x - size / 2 + window.scrollX}px`;
        particle.style.top = `${y - size / 2 + window.scrollY}px`;
        particle.style.zIndex = '9999';

        // Select colors based on theme
        const colors = newTheme === 'unicorn' 
          ? ['#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171']
          : ['#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#fecdd3'];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = `radial-gradient(circle, #ffffff 0%, ${randomColor} 70%, rgba(255,255,255,0) 100%)`;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80 + 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 1500);
      }
    }
  };

  const renderLocaleButtons = (isMobile = false) => {
    return (Object.keys(localeConfigs) as LocaleType[]).map((loc) => {
      const config = localeConfigs[loc];
      return (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
            locale === loc
              ? 'bg-[var(--theme-accent-light)] text-[var(--theme-accent)] border-[var(--theme-accent)]/20 shadow-sm font-bold scale-[1.02]'
              : 'border-transparent text-[var(--theme-text)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-heading)]'
          } ${isMobile ? 'flex-1 justify-center' : ''}`}
          title={config.name}
        >
          <span className="text-sm">{config.flag}</span>
          <span className="uppercase text-xs tracking-tight">{loc}</span>
        </button>
      );
    });
  };

  const renderThemeButtons = (isMobile = false) => {
    return themes.map((t) => (
      <button
        key={t.id}
        onClick={(e) => handleThemeChange(t.id, e)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer border ${
          theme === t.id
            ? t.activeColor
            : 'border-transparent text-[var(--theme-text)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-heading)]'
        } ${isMobile ? 'flex-1 justify-center' : ''}`}
      >
        {t.icon}
        <span className="hidden sm:inline">{t.name}</span>
      </button>
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 md:px-8 border-b border-[var(--theme-border)] select-none">
      <div className="flex justify-between items-center w-full">
        {/* Brand Header Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[var(--theme-accent-light)] text-[var(--theme-accent)] transition-colors duration-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--theme-heading)] font-display m-0 leading-none">
              Growth<span className="text-[var(--theme-accent)] transition-colors duration-300">Calc</span>
            </h1>
            <p className="text-xs uppercase font-bold tracking-wider text-[var(--theme-text)] opacity-70">
              Interactive Growth Simulators
            </p>
          </div>
        </div>

        {/* Mobile Settings Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-[var(--theme-panel)] border border-[var(--theme-border)] text-[var(--theme-text)] hover:text-[var(--theme-heading)] cursor-pointer transition-all duration-300 shadow-sm flex items-center justify-center"
          aria-label="Toggle settings"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>

        {/* Desktop Selectors (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Geography / Locale Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm transition-all duration-300">
            {renderLocaleButtons()}
          </div>

          {/* Theme Options */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm transition-all duration-300">
            {renderThemeButtons()}
          </div>
        </div>
      </div>

      {/* Mobile Settings Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-[var(--theme-border)] flex flex-col gap-4 animate-fade-in">
          {/* Mobile Region Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text)] opacity-50 px-1">Region</span>
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm w-full overflow-x-auto">
              {renderLocaleButtons(true)}
            </div>
          </div>

          {/* Mobile Theme Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text)] opacity-50 px-1">Theme</span>
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--theme-panel)] border border-[var(--theme-border)] shadow-sm w-full">
              {renderThemeButtons(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
