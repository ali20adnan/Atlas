import { Search as SearchIcon, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ItemCard } from '../components/ItemCard';
import { AppText, IconBtn, Kicker, Screen, useLayout } from '../components/ui';
import { CATALOG, searchItems } from '../data/catalog';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { WarehouseItem } from '../types';
import { elevation, radius, space, type } from '../theme/tokens';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SearchScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { colors, row, writing, textAlign, fonts, isRTL } = useLayout();
  const [query, setQuery] = useState(route.params?.q ?? '');
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.q) setQuery(route.params.q);
    }, [route.params?.q]),
  );

  const results = useMemo(() => (query.trim() ? searchItems(query) : CATALOG), [query]);

  return (
    <Screen style={{ paddingLeft: 0, paddingRight: 0 }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 14 }}>
        <Kicker tone="muted">{t('catalogKicker')}</Kicker>
        <AppText weight="bold" style={{ fontSize: type.display, lineHeight: 46, letterSpacing: isRTL ? 0 : -0.5 }}>
          {t('search')}
        </AppText>
        <View
          style={[
            {
              minHeight: 56,
              borderRadius: radius.full,
              backgroundColor: focused ? colors.surface : colors.surfaceMuted,
              borderWidth: 1.5,
              borderColor: focused ? colors.accent : 'transparent',
              flexDirection: row,
              alignItems: 'center',
              paddingHorizontal: 18,
              gap: 10,
            },
            focused
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
          <SearchIcon size={18} color={focused ? colors.accent : colors.textMuted} strokeWidth={1.75} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityRole="search"
            accessibilityLabel={t('searchPlaceholder')}
            style={{
              flex: 1,
              minHeight: 56,
              color: colors.text,
              fontFamily: fonts.regular,
              fontSize: type.body,
              writingDirection: writing,
              textAlign,
            }}
          />
          {query ? (
            <IconBtn label={t('clearRecent')} onPress={() => setQuery('')} size={32}>
              <X size={16} color={colors.textMuted} strokeWidth={1.75} />
            </IconBtn>
          ) : null}
        </View>
        <AppText tone="muted" weight="medium" style={{ fontSize: type.micro, marginBottom: 2 }}>
          {t('resultsCount', { count: results.length })}
        </AppText>
      </View>

      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
          marginTop: space[8],
          marginBottom: 12,
          backgroundColor: results.length ? colors.surface : 'transparent',
          borderRadius: radius.xl,
          borderWidth: results.length ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
          overflow: 'hidden',
          ...(results.length ? elevation.card(colors) : undefined),
        }}
      >
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 4, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ItemSeparatorComponent={() => (
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginHorizontal: 16 }} />
          )}
          renderItem={({ item }: { item: WarehouseItem }) => (
            <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { id: item.id })} />
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 28, paddingHorizontal: 4, gap: 6 }}>
              <AppText weight="semibold" style={{ fontSize: type.title }}>
                {t('noResultsTitle')}
              </AppText>
              <AppText tone="secondary" style={{ fontSize: type.body }}>
                {t('noResultsBody')}
              </AppText>
            </View>
          }
        />
      </View>
    </Screen>
  );
}
