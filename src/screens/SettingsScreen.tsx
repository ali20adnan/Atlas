import Constants from 'expo-constants';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Screen, hair, useLayout } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useSettings, type ThemeMode } from '../context/SettingsContext';
import type { Lang } from '../i18n';
import { radius, type } from '../theme/tokens';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { lang, setLang, themeMode, setThemeMode } = useSettings();
  const { colors } = useLayout();
  const isAr = lang === 'ar';
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const display = user ? (isAr ? user.displayAr : user.displayEn) : '';

  return (
    <Screen>
      <View style={{ flex: 1 }}>
      <AppText weight="semibold" style={{ fontSize: type.display, marginTop: 8 }}>
        {display}
      </AppText>
      <AppText tone="muted" style={{ fontSize: type.label, marginTop: 6 }}>
        {user?.role === 'supervisor' ? t('roleSupervisor') : t('roleOperator')}
      </AppText>

      <View
        style={{
          marginTop: 28,
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          borderWidth: hair,
          borderColor: colors.border,
          overflow: 'hidden',
        }}
      >
        <Row
          label={t('language')}
          value={lang === 'ar' ? t('arabic') : t('english')}
          onPress={() => void setLang((lang === 'ar' ? 'en' : 'ar') as Lang)}
        />
        <Row
          label={t('appearance')}
          value={
            themeMode === 'system' ? t('themeSystem') : themeMode === 'dark' ? t('themeDark') : t('themeLight')
          }
          onPress={() => {
            const order: ThemeMode[] = ['system', 'light', 'dark'];
            const next = order[(order.indexOf(themeMode) + 1) % order.length];
            void setThemeMode(next);
          }}
          last
        />
      </View>

      <Pressable
        onPress={() => void logout()}
        accessibilityRole="button"
        accessibilityLabel={t('signOut')}
        style={({ pressed }) => ({
          minHeight: 52,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          borderRadius: radius.xl,
          backgroundColor: colors.dangerSoft,
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <AppText tone="danger" weight="semibold">{t('signOut')}</AppText>
      </Pressable>

      <AppText tone="muted" style={{ fontSize: type.label, marginTop: 'auto', marginBottom: 24 }}>
        {version}
      </AppText>
      </View>
    </Screen>
  );
}

function Row({
  label,
  value,
  onPress,
  last,
}: {
  label: string;
  value: string;
  onPress: () => void;
  last?: boolean;
}) {
  const { colors, row } = useLayout();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}
      style={({ pressed }) => ({
        minHeight: 56,
        paddingHorizontal: 16,
        flexDirection: row,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: last ? 0 : hair,
        borderBottomColor: colors.border,
        opacity: pressed ? 0.6 : 1,
        gap: 16,
      })}
    >
      <AppText tone="muted">{label}</AppText>
      <AppText>{value}</AppText>
    </Pressable>
  );
}
