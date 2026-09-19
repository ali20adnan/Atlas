import { Search as SearchIcon, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ItemCard } from '../components/ItemCard';
import { AppText, IconBtn, Screen, hair, useLayout } from '../components/ui';
import { CATALOG, searchItems } from '../data/catalog';
import type { MainTabParamList, RootStackParamList } from '../navigation/types';
import type { WarehouseItem } from '../types';
import { radius, type } from '../theme/tokens';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function SearchScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { colors, row, writing, textAlign, fonts } = useLayout();
  const [query, setQuery] = useState(route.params?.q ?? '');
  const [focused, setFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.q) setQuery(route.params.q);
    }, [route.params?.q]),
  );

  const results = useMemo(() => (query.trim() ? searchItems(query) : CATALOG), [query]);

  return (
    <Screen>
      <View
        style={{
          marginTop: 8,
          borderRadius: radius.full,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          borderWidth: hair,
          borderColor: focused ? colors.accent : colors.border,
        }}
      >
        <View
          style={{
            minHeight: 56,
            flexDirection: row,
            alignItems: 'center',
            paddingHorizontal: 8,
            gap: 8,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radius.full,
              backgroundColor: focused ? colors.accentSoft : colors.surfaceMuted,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon size={18} color={focused ? colors.accent : colors.textMuted} strokeWidth={1.75} />
          </View>
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
            <IconBtn label={t('clearRecent')} onPress={() => setQuery('')}>
              <X size={16} color={colors.textMuted} strokeWidth={1.75} />
            </IconBtn>
          ) : null}
        </View>
      </View>

      <View
        style={{
          marginTop: 16,
          marginBottom: 12,
          flexDirection: row,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: colors.surfaceMuted,
            borderRadius: radius.full,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <AppText tone="secondary" weight="medium" style={{ fontSize: type.label }}>
            {t('resultsCount', { count: results.length })}
          </AppText>
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 96, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }: { item: WarehouseItem }) => (
          <ItemCard item={item} onPress={() => navigation.navigate('ItemDetail', { id: item.id })} />
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 64 }}>
            <AppText tone="secondary" style={{ fontSize: type.body }}>
              {t('noResultsBody')}
            </AppText>
          </View>
        }
      />
    </Screen>
  );
}
