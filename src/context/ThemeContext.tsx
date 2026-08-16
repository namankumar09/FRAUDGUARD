import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorPreset = 'signature' | 'emerald' | 'amethyst' | 'monochrome';

export interface UserAccountProfile {
  name: string;
  email: string;
  role: string;
  title?: string;
  department?: string;
  phone?: string;
  organization: string;
  securityTier: string;
  yubikeyEnrolled: boolean;
  biometricEnrolled: boolean;
  autoLockMinutes: number;
  pushNotifications: boolean;
  soundAlerts: boolean;
  stepUpThreshold: number;
  autoQuarantineThreshold: number;
  simulationPaceSec: number;
  webhookUrl: string;
}

const DEFAULT_PROFILE: UserAccountProfile = {
  name: 'Naman Kumar',
  email: 'kumarnaman0907@gmail.com',
  role: 'Principal Fraud Operations Director',
  title: 'Senior Risk & Fraud Analyst',
  department: 'Financial Crimes & Biometric Intelligence Unit',
  phone: '+91 98765 43210',
  organization: 'Fraud Buddy Enterprise AI Network',
  securityTier: 'Level 5 - Sovereign Zero-Day Authority',
  yubikeyEnrolled: true,
  biometricEnrolled: true,
  autoLockMinutes: 30,
  pushNotifications: true,
  soundAlerts: true,
  stepUpThreshold: 75,
  autoQuarantineThreshold: 85,
  simulationPaceSec: 7,
  webhookUrl: 'https://api.fraudbuddy.internal/webhooks/v1/triage',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  colorPreset: ColorPreset;
  setColorPreset: (preset: ColorPreset) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  profile: UserAccountProfile;
  updateProfile: (updates: Partial<UserAccountProfile>) => void;
  resetSettingsToDefault: () => void;
  // backward compatibility
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Mode (light / dark / system)
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fraudbuddy_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode;
    }
    return 'dark'; // Default dark theme with dark blue and dark purple
  });

  // Color Preset
  const [colorPreset, setColorPresetState] = useState<ColorPreset>(() => {
    const saved = localStorage.getItem('fraudbuddy_color_preset');
    if (saved === 'signature' || saved === 'emerald' || saved === 'amethyst' || saved === 'monochrome') {
      return saved as ColorPreset;
    }
    return 'signature';
  });

  // High contrast mode
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('fraudbuddy_high_contrast') === 'true';
  });

  // User Profile & Settings
  const [profile, setProfileState] = useState<UserAccountProfile>(() => {
    const saved = localStorage.getItem('fraudbuddy_user_profile');
    if (saved) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  // System theme detection
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute resolved theme
  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system' ? (systemIsDark ? 'dark' : 'light') : themeMode;

  // Sync DOM classes and attributes
  useEffect(() => {
    localStorage.setItem('fraudbuddy_theme_mode', themeMode);
    localStorage.setItem('fraudbuddy_color_preset', colorPreset);
    localStorage.setItem('fraudbuddy_high_contrast', String(highContrast));
    localStorage.setItem('fraudbuddy_user_profile', JSON.stringify(profile));

    const root = document.documentElement;

    // Apply dark or light class
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-theme-mode', themeMode);
    root.setAttribute('data-preset', colorPreset);

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [themeMode, resolvedTheme, colorPreset, highContrast, profile]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  };

  const setColorPreset = (preset: ColorPreset) => {
    setColorPresetState(preset);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
  };

  const updateProfile = (updates: Partial<UserAccountProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updates }));
  };

  const resetSettingsToDefault = () => {
    setThemeModeState('dark');
    setColorPresetState('signature');
    setHighContrastState(false);
    setProfileState(DEFAULT_PROFILE);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        setThemeMode,
        toggleTheme,
        colorPreset,
        setColorPreset,
        highContrast,
        setHighContrast,
        profile,
        updateProfile,
        resetSettingsToDefault,
        theme: resolvedTheme,
        setTheme: (t) => setThemeMode(t),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
