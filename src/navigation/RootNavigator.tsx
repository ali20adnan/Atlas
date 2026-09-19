import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScanLine, Search, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ItemDetailScreen } from '../screens/ItemDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { radius } from '../theme/tokens';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function Tabs() {
  const { t } = useTranslation();
  const { colors } = useSettings();
  const insets = useSafeAreaInsets();
  const island = {
    height: 64,
    marginHorizontal: 16,
    marginBottom: Math.max(insets.bottom, 10),
    borderRadius: radius.xl,
    borderTopWidth: 0,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    ...Platform.select({ android: { elevation: 16 } }),
  };
  return (
    <Tab.Navigator
      initialRouteName="ScanTab"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        tabBarStyle: {
          ...island,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: t('search'),
          tabBarIcon: ({ color }) => <Search size={22} color={color} strokeWidth={1.75} />,
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanScreen}
        options={{
          tabBarLabel: t('scan'),
          tabBarIcon: ({ color }) => <ScanLine size={22} color={color} strokeWidth={1.75} />,
          tabBarStyle: {
            ...island,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            borderColor: 'rgba(248,250,252,0.12)',
          },
          tabBarActiveTintColor: '#34D399',
          tabBarInactiveTintColor: 'rgba(248,250,252,0.5)',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('account'),
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={1.75} />,
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
