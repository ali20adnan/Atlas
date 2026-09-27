import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { WarehouseItem } from '../types';
import { type } from '../theme/tokens';
import { StatusBadge } from './StatusBadge';
import { AppText, useLayout } from './ui';

export const ItemCard = React.memo(function ItemCard({
  item,
  onPress,
}: {
  item: WarehouseItem;
  onPress: () => void;
}) {
  const { i18n } = useTranslation();
  const { colors, row, isRTL } = useLayout();
  const name = i18n.language === 'ar' ? item.nameAr : item.nameEn;
  const unit = i18n.language === 'ar' ? item.unitAr : item.unitEn;
  const place = `${item.aisle}–${item.rack}–${item.bin}`;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${item.qty} ${unit}, ${place}`}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 16,
      })}
    >
      <View style={{ flexDirection: row, alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText weight="semibold" style={{ fontSize: type.body }} numberOfLines={2}>
            {name}
          </AppText>
          <AppText tone="muted" style={{ fontSize: type.label, fontVariant: ['tabular-nums'] }}>
            {place}
          </AppText>
        </View>
        <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end', gap: 2 }}>
          <AppText
            weight="semibold"
            style={{ fontSize: type.title, fontVariant: ['tabular-nums'], textAlign: isRTL ? 'left' : 'right' }}
          >
            {item.qty}
          </AppText>
          <AppText tone="muted" style={{ fontSize: type.label, textAlign: isRTL ? 'left' : 'right' }}>
            {unit}
          </AppText>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <StatusBadge status={item.status} />
      </View>
    </Pressable>
  );
});
