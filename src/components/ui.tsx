import React from 'react';
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
import { radius, space, type, type FontKey } from '../theme/tokens';

export function useLayout() {
  const { isRTL, colors, fonts, scheme } = useSettings();
  return {
    isRTL,
    colors,
    fonts,
    scheme,
    row: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    start: (isRTL ? 'right' : 'left') as 'left' | 'right',
    writing: (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right',
  };
}

type AppTextProps = TextProps & { weight?: FontKey; tone?: 'primary' | 'secondary' | 'muted' | 'accent' | 'danger' };

export function AppText({ weight = 'regular', tone = 'primary', style, children, ...rest }: AppTextProps) {
  const { colors, fonts, writing, textAlign } = useLayout();
  const color =
    tone === 'secondary'
      ? colors.textSecondary
      : tone === 'muted'
        ? colors.textMuted
        : tone === 'accent'
          ? colors.accent
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
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          padding: space[16],
        },
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
  const bg =
    variant === 'primary'
      ? colors.accent
      : variant === 'danger'
        ? colors.danger
        : variant === 'secondary'
          ? colors.surfaceMuted
          : 'transparent';
  const fg =
    variant === 'primary'
      ? colors.onAccent
      : variant === 'danger'
        ? '#FFFFFF'
        : colors.text;
  const border = variant === 'secondary' ? colors.border : 'transparent';
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        {
          minHeight: 52,
          borderRadius: radius.full,
          backgroundColor: pressed && variant === 'primary' ? colors.accentPressed : bg,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          borderColor: border,
          paddingHorizontal: space[16],
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: row,
          gap: 8,
          opacity: disabled ? 0.45 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
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

export function Field({ label, error, trailing, style, ...rest }: FieldProps) {
  const { colors, fonts, writing, textAlign, row } = useLayout();
  return (
    <View style={{ gap: 8 }}>
      <AppText weight="medium" tone="secondary" style={{ fontSize: type.label }}>
        {label}
      </AppText>
      <View
        style={{
          minHeight: 52,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: error ? colors.danger : colors.border,
          backgroundColor: colors.surface,
          flexDirection: row,
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          {...rest}
          placeholderTextColor={colors.textMuted}
          style={[
            {
              flex: 1,
              minHeight: 52,
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
