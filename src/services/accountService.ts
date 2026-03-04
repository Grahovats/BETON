import { apiRequest } from './api';
import type { Account, DashboardResponse } from '../types';

export const listAccounts = (token: string) => {
  return apiRequest<{ accounts: Account[] }>('/accounts', {}, token);
};

export const connectAccount = (
  token: string,
  payload: { username: string; apiToken: string; password?: string },
) => {
  return apiRequest<{ id: string; username: string; platform: string; createdAt: string }>(
    '/accounts',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};

export const getDashboard = (token: string, accountId: string) => {
  return apiRequest<DashboardResponse>(`/accounts/${accountId}/dashboard`, {}, token);
};

export const refreshDashboard = (token: string, accountId: string) => {
  return apiRequest<DashboardResponse>(
    `/accounts/${accountId}/refresh`,
    { method: 'POST' },
    token,
  );
};

export const manualSyncDashboard = (
  token: string,
  accountId: string,
  payload: {
    metrics: {
      totalEarnings: number;
      activeSubscribers: number;
      messagesCount: number;
      revenueThisMonth: number;
    };
    transactions: Array<{
      externalId: string;
      amount: number;
      currency: string;
      description: string;
      status: string;
      createdAt: string;
    }>;
  },
) => {
  return apiRequest<DashboardResponse>(
    `/accounts/${accountId}/manual-sync`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
};
