import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUpdates } from '../updates/UpdateProvider';
import { radius, type } from '../theme/tokens';
import { AppText, Button, hair, useLayout } from './ui';

export function UpdateOverlay() {
  const { t } = useTranslation();
  const { available, installing, error, install, dismiss } = useUpdates();
  const { colors, row } = useLayout();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!available) return;
    Animated.parallel([
      Animated.timing(y, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [available, opacity, y]);

  if (!available) return null;

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 12) + 64,
          transform: [{ translateY: y }],
          opacity,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderWidth: hair,
          borderColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: row,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <AppText style={{ flex: 1, fontSize: type.body }} numberOfLines={2}>
          {error ? t('updateFailed') : t('updateTitle')}
        </AppText>
        <Button label={t('updateLater')} variant="ghost" onPress={dismiss} style={{ minHeight: 40, paddingHorizontal: 8 }} />
        <Button
          label={installing ? t('updateInstalling') : t('updateInstall')}
          loading={installing}
          onPress={() => void install()}
          style={{ minHeight: 40, paddingHorizontal: 14 }}
        />
      </Animated.View>
    </View>
  );
}
