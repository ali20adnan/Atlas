import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBadge } from '../components/StatusBadge';
import { AppText, Kicker, Screen, useLayout } from '../components/ui';
import { getItem } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import type { ItemStatus } from '../types';
import { elevation, radius, type } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetail'>;

function formatWhen(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function qtyColor(status: ItemStatus, colors: { text: string; warning: string; danger: string }) {
  if (status === 'low_stock') return colors.warning;
  if (status === 'damaged' || status === 'expired') return colors.danger;
  return colors.text;
}

export function ItemDetailScreen({ navigation, route }: Props) {
  const { t, i18n } = useTranslation();
  const { colors, row, isRTL } = useLayout();
  const item = getItem(route.params.id);
  const isAr = i18n.language === 'ar';
  const Back = isRTL ? ArrowRight : ArrowLeft;

  if (!item) {
    return (
      <Screen>
        <AppText>{t('notFoundTitle')}</AppText>
      </Screen>
    );
  }

  const name = isAr ? item.nameAr : item.nameEn;
  const unit = isAr ? item.unitAr : item.unitEn;
  const supplier = isAr ? item.supplierAr : item.supplierEn;
  const category = isAr ? item.categoryAr : item.categoryEn;
  const last = item.history[0];
  const numberColor = qtyColor(item.status, colors);

  return (
    <Screen padded={false}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 8,
          backgroundColor: colors.bg,
          zIndex: 2,
          flexDirection: row,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 46,
            height: 46,
            borderRadius: radius.full,
            backgroundColor: colors.surface,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
            ...elevation.card(colors),
          })}
        >
          <Back size={21} color={colors.text} strokeWidth={1.75} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}>
        <View style={{ flexDirection: row, marginTop: 4 }}>
          <StatusBadge status={item.status} />
        </View>
        <View style={{ marginTop: 14, gap: 6 }}>
          <Kicker>{category}</Kicker>
          <AppText
            weight="bold"
            style={{ fontSize: type.display, lineHeight: 46, letterSpacing: isRTL ? 0 : -0.5 }}
          >
            {name}
          </AppText>
          <AppText tone="secondary" style={{ fontSize: type.body, fontVariant: ['tabular-nums'] }}>
            {item.sku}
          </AppText>
        </View>

        <View style={{ marginTop: 24, gap: 10 }}>
          <Kicker tone="muted">{t('location')}</Kicker>
          <View
            style={{
              flexDirection: row,
              backgroundColor: colors.surface,
              borderRadius: radius.xl,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              overflow: 'hidden',
              ...elevation.card(colors),
            }}
          >
            <Place label={t('aisle')} value={item.aisle} />
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
            <Place label={t('rack')} value={item.rack} />
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
            <Place label={t('bin')} value={item.bin} />
          </View>
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: colors.accentSoft,
            borderRadius: radius.xl,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.accentBorder,
            paddingHorizontal: 20,
            paddingVertical: 18,
            flexDirection: row,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Kicker tone="muted">{t('quantity')}</Kicker>
            <AppText tone="secondary" style={{ fontSize: type.body }}>
              {unit}
            </AppText>
            {item.status === 'low_stock' ? (
              <AppText weight="medium" style={{ fontSize: type.label, color: colors.warning, marginTop: 4 }}>
                {t('minQuantity')} {item.minQty}
              </AppText>
            ) : null}
          </View>
          <AppText
            weight="bold"
            style={{
              fontSize: 52,
              lineHeight: 58,
              color: numberColor,
              fontVariant: ['tabular-nums'],
              textAlign: isRTL ? 'left' : 'right',
            }}
          >
            {item.qty}
          </AppText>
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            paddingHorizontal: 18,
            ...elevation.card(colors),
          }}
        >
          <Fact label={t('barcode')} value={item.barcode} tabular />
          <View style={{ flexDirection: row }}>
            <Fact label={t('category')} value={category} half />
            <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
            <Fact label={t('condition')} value={t(`condition_${item.condition}`)} half inset />
          </View>
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
          <Fact label={t('supplier')} value={supplier} />
          <Fact label={t('batch')} value={item.batch || '—'} />
          {item.expiry ? <Fact label={t('expiry')} value={item.expiry} /> : null}
          {last ? (
            <Fact
              label={t('lastMovement')}
              value={`${isAr ? last.typeAr : last.typeEn} · ${formatWhen(last.at, i18n.language)}`}
              last
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Place({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8, gap: 6 }}>
      <Kicker tone="muted" style={{ textAlign: 'center' }}>
        {label}
      </Kicker>
      <AppText weight="bold" style={{ fontSize: 34, lineHeight: 40, textAlign: 'center', fontVariant: ['tabular-nums'] }}>
        {value}
      </AppText>
    </View>
  );
}

function Fact({
  label,
  value,
  last,
  tabular,
  half,
  inset,
}: {
  label: string;
  value: string;
  last?: boolean;
  tabular?: boolean;
  half?: boolean;
  inset?: boolean;
}) {
  const { colors, isRTL } = useLayout();
  return (
    <View
      style={{
        flex: half ? 1 : undefined,
        paddingVertical: 14,
        paddingLeft: inset && !isRTL ? 16 : 0,
        paddingRight: inset && isRTL ? 16 : 0,
        borderBottomWidth: last || half ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        gap: 4,
      }}
    >
      <Kicker tone="muted">{label}</Kicker>
      <AppText
        weight="medium"
        style={{ fontSize: type.body, fontVariant: tabular ? ['tabular-nums'] : undefined }}
      >
        {value}
      </AppText>
    </View>
  );
}
