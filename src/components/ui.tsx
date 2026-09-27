import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { elevation, radius, space, type, type FontKey } from '../theme/tokens';

export function useLayout() {
  const { isRTL, colors, fonts, scheme, lang } = useSettings();
  return {
    isRTL,
    lang,
    colors,
    fonts,
    scheme,
    row: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    start: (isRTL ? 'right' : 'left') as 'left' | 'right',
    writing: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right',
  };
}

type AppTextProps = TextProps & {
  weight?: FontKey;
  tone?: 'primary' | 'secondary' | 'muted' | 'accent' | 'gold' | 'danger';
};

export function AppText({ weight = 'regular', tone = 'primary', style, children, ...rest }: AppTextProps) {
  const { colors, fonts, writing, textAlign } = useLayout();
  const color =
    tone === 'secondary'
      ? colors.textSecondary
      : tone === 'muted'
        ? colors.textMuted
        : tone === 'accent'
          ? colors.accent
          : tone === 'gold'
            ? colors.gold
            : tone === 'danger'
              ? colors.danger
              : colors.text;
  return (
    <Text
      {...rest}
      style={[
        { color, fontFamily: fonts[weight], writingDirection: writing, textAlign },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Uppercase micro label. Letter-spacing is Latin-only — it breaks Arabic letterforms. */
export function Kicker({ children, tone = 'gold', style, ...rest }: Omit<AppTextProps, 'weight'>) {
  const { isRTL } = useLayout();
  return (
    <AppText
      weight="semibold"
      tone={tone}
      {...rest}
      style={[
        {
          fontSize: type.micro,
          lineHeight: 16,
          letterSpacing: isRTL ? 0 : 1.6,
          textTransform: isRTL ? 'none' : 'uppercase',
        },
        style,
      ]}
    >
      {children}
    </AppText>
  );
}

export function Screen({
  children,
  style,
  padded = true,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  const { colors } = useLayout();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.bg,
          paddingTop: insets.top,
          paddingLeft: padded ? Math.max(insets.left, 20) : insets.left,
          paddingRight: padded ? Math.max(insets.right, 20) : insets.right,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const { colors } = useLayout();
  const body = (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: space[16],
        },
        elevation.card(colors),
        style,
      ]}
    >
      {children}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }], opacity: pressed ? 0.92 : 1 })}
    >
      {body}
    </Pressable>
  );
}

type BtnProps = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
};

export function Button({ label, variant = 'primary', loading, icon, disabled, style, ...rest }: BtnProps) {
  const { colors, fonts, row } = useLayout();
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.onAccent : variant === 'danger' ? '#FFFFFF' : colors.text;
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        {
          minHeight: 54,
          borderRadius: radius.full,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
          // Solid backing so Android elevation has an outline to shadow; the gradient covers it.
          backgroundColor: isPrimary ? colors.accentDeep : variant === 'danger' ? colors.danger : colors.surface,
          paddingHorizontal: space[24],
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: row,
          gap: 8,
          opacity: disabled ? 0.45 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          overflow: 'hidden',
        },
        isPrimary ? elevation.cta(colors) : variant === 'secondary' ? elevation.card(colors) : undefined,
        style as StyleProp<ViewStyle>,
      ]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={colors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, { borderRadius: radius.full }]}
        />
      ) : null}
      {loading ? <ActivityIndicator color={fg} /> : icon}
      {!loading ? (
        <Text style={{ color: fg, fontFamily: fonts.semibold, fontSize: type.body }}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

type FieldProps = TextInputProps & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

export function Field({ label, error, trailing, style, onFocus, onBlur, ...rest }: FieldProps) {
  const { colors, fonts, writing, textAlign, row } = useLayout();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <AppText weight="semibold" tone="muted" style={{ fontSize: type.micro, letterSpacing: 1 }}>
        {label}
      </AppText>
      <View
        style={[
          {
            minHeight: 56,
            borderRadius: radius.lg,
            borderWidth: 1.5,
            borderColor: error ? colors.danger : focused ? colors.accent : 'transparent',
            backgroundColor: focused ? colors.surface : colors.surfaceMuted,
            flexDirection: row,
            alignItems: 'center',
            paddingHorizontal: 16,
          },
          focused && !error
            ? {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 16,
                shadowOpacity: 0.18,
                elevation: 4,
              }
            : undefined,
        ]}
      >
        <TextInput
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          style={[
            {
              flex: 1,
              minHeight: 56,
              color: colors.text,
              fontFamily: fonts.regular,
              fontSize: type.body,
              writingDirection: writing,
              textAlign,
            },
            style as StyleProp<TextStyle>,
          ]}
        />
        {trailing}
      </View>
      {error ? (
        <AppText tone="danger" weight="medium" accessibilityRole="alert" style={{ fontSize: type.label }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

export function IconBtn({
  onPress,
  label,
  children,
  size = 44,
}: {
  onPress: () => void;
  label: string;
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.5 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}

export const hair = StyleSheet.hairlineWidth;
