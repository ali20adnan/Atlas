import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import i18n, { type Lang } from '../i18n';
import { darkColors, fontsArabic, fontsLatin, lightColors, type Colors, type FontKey } from '../theme/tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

type SettingsValue = {
  lang: Lang;
  isRTL: boolean;
  themeMode: ThemeMode;
  colors: Colors;
  scheme: 'light' | 'dark';
  fonts: Record<FontKey, string>;
  setLang: (lang: Lang) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  ready: boolean;
};

const KEY_LANG = 'qrwh.lang';
const KEY_THEME = 'qrwh.theme';

const SettingsContext = createContext<SettingsValue | null>(null);

function deviceLang(): Lang {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'en';
  return tag === 'ar' ? 'ar' : 'en';
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [lang, setLangState] = useState<Lang>('en');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [savedLang, savedTheme] = await Promise.all([
        AsyncStorage.getItem(KEY_LANG),
        AsyncStorage.getItem(KEY_THEME),
      ]);
      const nextLang: Lang = savedLang === 'ar' || savedLang === 'en' ? savedLang : deviceLang();
      const nextTheme: ThemeMode =
        savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system' ? savedTheme : 'system';
      setLangState(nextLang);
      setThemeModeState(nextTheme);
      await i18n.changeLanguage(nextLang);
      setReady(true);
    })();
  }, []);

  const setLang = useCallback(async (next: Lang) => {
    setLangState(next);
    await i18n.changeLanguage(next);
    await AsyncStorage.setItem(KEY_LANG, next);
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem(KEY_THEME, mode);
  }, []);

  const scheme: 'light' | 'dark' =
    themeMode === 'system' ? (system === 'dark' ? 'dark' : 'light') : themeMode;

  const value = useMemo<SettingsValue>(
    () => ({
      lang,
      isRTL: lang === 'ar',
      themeMode,
      scheme,
      colors: scheme === 'dark' ? darkColors : lightColors,
      fonts: lang === 'ar' ? fontsArabic : fontsLatin,
      setLang,
      setThemeMode,
      ready,
    }),
    [lang, themeMode, scheme, setLang, setThemeMode, ready],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}


