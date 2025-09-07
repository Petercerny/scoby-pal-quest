import { useState, useEffect, useCallback } from 'react';

export interface SettingsData {
  notifications: {
    batchReminders: boolean;
    healthAlerts: boolean;
    dailyReminders: boolean;
    reminderTime: string;
  };
  brewing: {
    defaultTargetDays: number;
    defaultTeaType: string;
    temperatureUnit: 'celsius' | 'fahrenheit';
    autoArchiveCompleted: boolean;
  };
  app: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackup: string | null;
  };
}

const DEFAULT_SETTINGS: SettingsData = {
  notifications: {
    batchReminders: true,
    healthAlerts: true,
    dailyReminders: false,
    reminderTime: '09:00',
  },
  brewing: {
    defaultTargetDays: 7,
    defaultTeaType: 'Black Tea',
    temperatureUnit: 'celsius',
    autoArchiveCompleted: false,
  },
  app: {
    theme: 'system',
    language: 'en',
  },
  data: {
    autoBackup: true,
    backupFrequency: 'weekly',
    lastBackup: null,
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('scoby-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('scoby-settings', JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.app.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
      } else {
        root.classList.toggle('dark', settings.app.theme === 'dark');
      }
    };

    applyTheme();

    // Listen for system theme changes when using system theme
    if (settings.app.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.app.theme, isLoading]);

  const updateSetting = useCallback(<K extends keyof SettingsData>(
    category: K,
    key: keyof SettingsData[K],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const getBrewingDefaults = useCallback(() => ({
    defaultTargetDays: settings.brewing.defaultTargetDays,
    defaultTeaType: settings.brewing.defaultTeaType,
  }), [settings.brewing.defaultTargetDays, settings.brewing.defaultTeaType]);


  const getTemperatureUnit = useCallback(() => {
    return settings.brewing.temperatureUnit;
  }, [settings.brewing.temperatureUnit]);

  return {
    settings,
    isLoading,
    updateSetting,
    resetSettings,
    getBrewingDefaults,
    getTemperatureUnit,
  };
};
