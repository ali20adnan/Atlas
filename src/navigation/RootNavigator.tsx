import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanLine, Search, User } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { tabBarChrome } from './tabBarChrome';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/** Tab hit target with premium hover (web) + press (all platforms) feedback. */
function TabButton({ style, ...props }: PressableProps) {
  return (
    <Pressable
      {...props}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        {
          opacity: state.pressed ? 0.7 : 1,
          transform: [{ scale: state.pressed ? 0.96 : (state as { hovered?: boolean }).hovered ? 0.97 : 1 }],
        },
        // RN Web only; the key stays absent on native so no invalid style warning.
        (state as { hovered?: boolean }).hovered ? { cursor: 'pointer' as never } : null,
      ]}
    />
  );
}

/**
 * Built-in tab labels collapse to a ~5px box on RN Web (font-metric clash in
 * bottom-tabs' label layout), so we render icon + label ourselves — the same
 * Text setup that renders correctly on every other screen.
 */
function Tabs() {
  const { t } = useTranslation();
  const { colors, fonts, isRTL } = useSettings();
  const insets = useSafeAreaInsets();
  const bar = tabBarChrome(colors, insets.bottom);
  const tabIcon = (Icon: typeof Search, label: string) => ({ color }: { color: string }) => (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <Icon size={22} color={color} strokeWidth={1.75} />
      <Text
        numberOfLines={1}
        style={{
          color,
          fontFamily: fonts.semibold,
          fontSize: 11,
          lineHeight: 14,
          writingDirection: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {label}
      </Text>
    </View>
  );
  return (
    <Tab.Navigator
      initialRouteName="ScanTab"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: bar.tabBarActiveTintColor,
        tabBarInactiveTintColor: bar.tabBarInactiveTintColor,
        tabBarButton: TabButton,
        tabBarStyle: bar.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t('search'),
          tabBarIcon: tabIcon(Search, t('search')),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{
          tabBarLabel: t('scan'),
          tabBarIcon: tabIcon(ScanLine, t('scan')),
          ...tabBarChrome(colors, insets.bottom, true),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('account'),
          tabBarIcon: tabIcon(User, t('account')),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { user } = useAuth();
  const { colors } = useSettings();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="App" component={Tabs} />
          <Stack.Screen
            name="ItemDetail"
            component={ItemDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
