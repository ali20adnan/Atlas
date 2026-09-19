import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBadge } from '../components/StatusBadge';
import { AppText, Screen, hair, useLayout } from '../components/ui';
import { getItem } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { radius, type } from '../theme/tokens';

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
  const last = item.history[0];

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: 16, flexDirection: row, alignItems: 'center' }}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          hitSlop={8}
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Back size={22} color={colors.text} strokeWidth={1.75} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View style={{ marginTop: 12 }}>
          <StatusBadge status={item.status} />
        </View>
        <AppText weight="semibold" style={{ fontSize: type.display, lineHeight: 34, marginTop: 12 }}>
          {name}
        </AppText>

        <View
          style={{
            marginTop: 24,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: hair,
            borderColor: colors.border,
            padding: 20,
          }}
        >
          <AppText weight="semibold" style={{ fontSize: 40, fontVariant: ['tabular-nums'] }}>
            {item.qty}
          </AppText>
          <AppText tone="muted" style={{ fontSize: type.label, marginTop: 4 }}>
            {unit}
            {item.status === 'low_stock' ? `  ·  ${t('minQuantity')} ${item.minQty}` : ''}
          </AppText>
        </View>

        <View
          style={{
            marginTop: 16,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: hair,
            borderColor: colors.border,
            paddingHorizontal: 16,
          }}
        >
          <Fact label={t('location')} value={`${item.aisle}–${item.rack}–${item.bin}`} />
          <Fact label={t('sku')} value={item.sku} />
          <Fact label={t('barcode')} value={item.barcode} />
          <Fact label={t('supplier')} value={supplier} />
          {item.batch ? <Fact label={t('batch')} value={item.batch} /> : null}
          {item.expiry ? <Fact label={t('expiry')} value={item.expiry} /> : null}
          {last ? (
            <Fact
              label={t('lastMovement')}
              value={`${isAr ? last.typeAr : last.typeEn}  ·  ${formatWhen(last.at, i18n.language)}`}
              last
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Fact({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const { colors } = useLayout();
  return (
    <View
      style={{
        paddingVertical: 16,
        borderBottomWidth: last ? 0 : hair,
        borderBottomColor: colors.border,
        gap: 4,
      }}
    >
      <AppText tone="muted" style={{ fontSize: type.label }}>
        {label}
      </AppText>
      <AppText style={{ fontSize: type.body }}>{value}</AppText>
    </View>
  );
}
