import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { WarehouseItem } from '../types';
import { radius, type } from '../theme/tokens';
import { StatusBadge } from './StatusBadge';
import { AppText, hair, useLayout } from './ui';

export const ItemCard = React.memo(function ItemCard({
  item,
  onPress,
}: {
  item: WarehouseItem;
  onPress: () => void;
}) {
  const { i18n } = useTranslation();
  const { colors, row } = useLayout();
  const name = i18n.language === 'ar' ? item.nameAr : item.nameEn;
  const unit = i18n.language === 'ar' ? item.unitAr : item.unitEn;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={({ pressed }) => ({
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: hair,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 10,
        shadowColor: colors.shadow,
        shadowOpacity: 1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        opacity: pressed ? 0.86 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <View style={{ flexDirection: row, alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <AppText weight="semibold" style={{ fontSize: type.body, flex: 1 }} numberOfLines={2}>
          {name}
        </AppText>
        <StatusBadge status={item.status} />
      </View>
      <View
        style={{
          flexDirection: row,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginTop: 12,
        }}
      >
        <View
          style={{
            flexDirection: row,
            alignItems: 'center',
            gap: 6,
            backgroundColor: colors.surfaceMuted,
            borderRadius: radius.full,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <MapPin size={13} color={colors.textMuted} strokeWidth={1.75} />
          <AppText tone="muted" style={{ fontSize: type.label }}>
            {item.aisle}–{item.rack}–{item.bin}
          </AppText>
        </View>
        <AppText weight="semibold" style={{ fontSize: type.body, fontVariant: ['tabular-nums'] }}>
          {item.qty} {unit}
        </AppText>
      </View>
    </Pressable>
  );
});
