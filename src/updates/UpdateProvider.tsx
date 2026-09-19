import * as Updates from 'expo-updates';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type UpdatePayload = {
  version?: string;
  createdAt?: string | null;
};

type UpdateValue = {
  available: UpdatePayload | null;
  installing: boolean;
  error: string | null;
  check: () => Promise<'available' | 'none' | 'error'>;
  install: () => Promise<void>;
  dismiss: () => void;
  preview: () => void;
};

const UpdateContext = createContext<UpdateValue | null>(null);

export function UpdateProvider({ children }: { children: React.ReactNode }) {
  const [available, setAvailable] = useState<UpdatePayload | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (): Promise<'available' | 'none' | 'error'> => {
    setError(null);
    try {
      if (__DEV__ || !Updates.isEnabled) return 'none';
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setAvailable({
          version: Updates.updateId ?? undefined,
          createdAt: Updates.createdAt?.toISOString() ?? null,
        });
        return 'available';
      }
      return 'none';
    } catch {
      setError('check-failed');
      return 'error';
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void check();
    }, 1600);
    return () => clearTimeout(t);
  }, [check]);

  const install = useCallback(async () => {
    setInstalling(true);
    setError(null);
    try {
      if (__DEV__ || !Updates.isEnabled) {
        setInstalling(false);
        setAvailable(null);
        return;
      }
      const fetched = await Updates.fetchUpdateAsync();
      if (fetched.isNew) {
        await Updates.reloadAsync();
        return;
      }
      setError('install-failed');
    } catch {
      setError('install-failed');
    } finally {
      setInstalling(false);
    }
  }, []);

  const dismiss = useCallback(() => setAvailable(null), []);
  const preview = useCallback(() => setAvailable({ version: '1.0.1' }), []);

  const value = useMemo(
    () => ({ available, installing, error, check, install, dismiss, preview }),
    [available, installing, error, check, install, dismiss, preview],
  );

  return <UpdateContext.Provider value={value}>{children}</UpdateContext.Provider>;
}

export function useUpdates() {
  const ctx = useContext(UpdateContext);
  if (!ctx) throw new Error('useUpdates must be used within UpdateProvider');
  return ctx;
}
