import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { authenticate } from '../data/auth';
import type { SessionUser } from '../types';

const KEY = 'qrwh.session';

async function readSession() {
  if (Platform.OS === 'web') return AsyncStorage.getItem(KEY);
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return AsyncStorage.getItem(KEY);
  }
}

async function writeSession(value: string | null) {
  if (Platform.OS === 'web') {
    if (value) await AsyncStorage.setItem(KEY, value);
    else await AsyncStorage.removeItem(KEY);
    return;
  }
  try {
    if (value) await SecureStore.setItemAsync(KEY, value);
    else await SecureStore.deleteItemAsync(KEY);
  } catch {
    if (value) await AsyncStorage.setItem(KEY, value);
    else await AsyncStorage.removeItem(KEY);
  }
}

type AuthValue = {
  user: SessionUser | null;
  booting: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await readSession();
        if (raw) setUser(JSON.parse(raw) as SessionUser);
      } catch {
        setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const next = authenticate(username, password);
    if (!next) return false;
    setUser(next);
    await writeSession(JSON.stringify(next));
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await writeSession(null);
  }, []);

  const value = useMemo(() => ({ user, booting, login, logout }), [user, booting, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
