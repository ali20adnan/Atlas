import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Kicker, Screen, useLayout } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useSettings, type ThemeMode } from '../context/SettingsContext';
import type { Lang } from '../i18n';
import { elevation, radius, type } from '../theme/tokens';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}

export function SettingsScreen() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { lang, setLang, themeMode, setThemeMode } = useSettings();
  const { colors, row, isRTL } = useLayout();
  const isAr = lang === 'ar';
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const display = user ? (isAr ? user.displayAr : user.displayEn) : '';

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: row, alignItems: 'center', gap: 16, marginTop: 8 }}>
          <LinearGradient
            colors={colors.accentGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.gold,
              ...elevation.cta(colors),
            }}
          >
            <AppText weight="bold" style={{ fontSize: type.title, color: '#F5E9CE' }}>
              {initials(display)}
            </AppText>
          </LinearGradient>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText weight="bold" style={{ fontSize: type.title, lineHeight: 28 }}>
              {display}
            </AppText>
            <Kicker>
              {user?.role === 'supervisor' ? t('roleSupervisor') : t('roleOperator')}
            </Kicker>
          </View>
        </View>

        <View
          style={{
            marginTop: 28,
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            overflow: 'hidden',
            ...elevation.card(colors),
          }}
        >
          <Row
            label={t('language')}
            value={lang === 'ar' ? t('arabic') : t('english')}
            onPress={() => void setLang((lang === 'ar' ? 'en' : 'ar') as Lang)}
            last
          />
        </View>

        <View style={{ marginTop: 24, gap: 10 }}>
          <Kicker tone="muted">{t('appearance')}</Kicker>
          <Segmented
            value={themeMode}
            options={[
              { value: 'system', label: t('themeSystem') },
              { value: 'light', label: t('themeLight') },
              { value: 'dark', label: t('themeDark') },
            ]}
            onChange={(mode) => void setThemeMode(mode)}
          />
        </View>

        <Pressable
          onPress={() => void logout()}
          accessibilityRole="button"
          accessibilityLabel={t('signOut')}
          style={({ pressed }) => ({
            minHeight: 54,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 'auto',
            borderRadius: radius.full,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.dangerBorder,
            backgroundColor: colors.dangerSoft,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <AppText tone="danger" weight="semibold">
            {t('signOut')}
          </AppText>
        </Pressable>

        <AppText
          tone="muted"
          style={{
            fontSize: type.micro,
            letterSpacing: isRTL ? 0 : 1,
            marginTop: 16,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {isRTL ? t('version', { version }) : t('version', { version }).toUpperCase()}
        </AppText>
      </View>
    </Screen>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: ThemeMode;
  options: { value: ThemeMode; label: string }[];
  onChange: (mode: ThemeMode) => void;
}) {
  const { colors, row } = useLayout();
  return (
    <View
      style={{
        flexDirection: row,
        backgroundColor: colors.surfaceMuted,
        borderRadius: radius.full,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={opt.label}
            style={[
              {
                flex: 1,
                minHeight: 44,
                borderRadius: radius.full,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? colors.surface : 'transparent',
                borderWidth: on ? StyleSheet.hairlineWidth : 0,
                borderColor: colors.border,
              },
              on ? elevation.card(colors) : undefined,
            ]}
          >
            <AppText weight={on ? 'semibold' : 'medium'} tone={on ? 'primary' : 'secondary'} style={{ fontSize: type.label }}>
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
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
        paddingHorizontal: 18,
        flexDirection: row,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        opacity: pressed ? 0.6 : 1,
        gap: 16,
      })}
    >
      <AppText tone="muted">{label}</AppText>
      <AppText weight="medium">{value}</AppText>
    </Pressable>
  );
}
