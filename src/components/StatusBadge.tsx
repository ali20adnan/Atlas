import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { ItemStatus } from '../types';
import { radius, type } from '../theme/tokens';
import { AppText, useLayout } from './ui';

const TONE: Record<ItemStatus, 'accent' | 'warning' | 'danger' | 'info' | 'reserved'> = {
  in_stock: 'accent',
  low_stock: 'warning',
  reserved: 'reserved',
  in_transit: 'info',
  checked_out: 'info',
  damaged: 'danger',
  expired: 'danger',
};

export const StatusBadge = React.memo(function StatusBadge({ status }: { status: ItemStatus }) {
  const { t } = useTranslation();
  const { colors, row } = useLayout();
  const tone = TONE[status];
  const fg =
    tone === 'accent'
      ? colors.accent
      : tone === 'warning'
        ? colors.warning
        : tone === 'danger'
          ? colors.danger
          : tone === 'reserved'
            ? colors.reserved
            : colors.info;
  const bg =
    tone === 'accent'
      ? colors.accentSoft
      : tone === 'warning'
        ? colors.warningSoft
        : tone === 'danger'
          ? colors.dangerSoft
          : tone === 'reserved'
            ? colors.reservedSoft
            : colors.infoSoft;
  const border =
    tone === 'accent'
      ? colors.accentBorder
      : tone === 'warning'
        ? colors.warningBorder
        : tone === 'danger'
          ? colors.dangerBorder
          : tone === 'reserved'
            ? colors.reservedBorder
            : colors.infoBorder;
  return (
    <View
      style={{
        flexDirection: row,
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        backgroundColor: bg,
        borderRadius: radius.full,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: border,
        paddingHorizontal: 12,
        paddingVertical: 5,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} />
      <AppText weight="semibold" style={{ color: fg, fontSize: type.label }}>
        {t(`status_${status}`)}
      </AppText>
    </View>
  );
});
