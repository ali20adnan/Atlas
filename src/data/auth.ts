import type { SessionUser } from '../types';

const ACCOUNTS: Record<string, { password: string; user: SessionUser }> = {
  admin: {
    password: 'warehouse',
    user: {
      username: 'admin',
      displayEn: 'Layla Hassan',
      displayAr: 'ليلى حسن',
      role: 'supervisor',
    },
  },
  operator: {
    password: 'scan123',
    user: {
      username: 'operator',
      displayEn: 'Karim Nasser',
      displayAr: 'كريم ناصر',
      role: 'operator',
    },
  },
};

export function authenticate(username: string, password: string): SessionUser | null {
  const row = ACCOUNTS[username.trim().toLowerCase()];
  if (!row || row.password !== password) return null;
  return row.user;
}
