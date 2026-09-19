import React from 'react';
import { View } from 'react-native';
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
  const { colors } = useLayout();
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
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: radius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <AppText weight="semibold" style={{ color: fg, fontSize: type.label }}>
        {t(`status_${status}`)}
      </AppText>
    </View>
  );
});
