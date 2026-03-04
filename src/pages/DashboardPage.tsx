import { useEffect, useState } from 'react';
import { AccountConnectForm } from '../components/AccountConnectForm';
import { ManualSyncPanel } from '../components/ManualSyncPanel';
import { MetricsCards } from '../components/MetricsCards';
import { TransactionsTable } from '../components/TransactionsTable';
import {
  connectAccount,
  getDashboard,
  listAccounts,
  manualSyncDashboard,
  refreshDashboard,
} from '../services/accountService';
import type { Account, DashboardResponse } from '../types';

type Props = {
  token: string;
  email: string;
  onLogout: () => void;
};

export const DashboardPage = ({ token, email, onLogout }: Props) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    const result = await listAccounts(token);
    setAccounts(result.accounts);
    if (!selectedAccountId && result.accounts.length > 0) {
      setSelectedAccountId(result.accounts[0].id);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchAccounts();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!selectedAccountId) {
        setDashboard(null);
        return;
      }
      try {
        const result = await getDashboard(token, selectedAccountId);
        setDashboard(result);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    void loadDashboard();
  }, [selectedAccountId]);

  const handleConnect = async (payload: { username: string; apiToken: string; password?: string }) => {
    await connectAccount(token, payload);
    await fetchAccounts();
  };

  const handleRefresh = async () => {
    if (!selectedAccountId) {
      return;
    }

    setRefreshing(true);
    setError(null);
    try {
      const result = await refreshDashboard(token, selectedAccountId);
      setDashboard(result);
      await fetchAccounts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleManualSync = async (payload: {
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
  }) => {
    if (!selectedAccountId) {
      return;
    }

    setError(null);
    const result = await manualSyncDashboard(token, selectedAccountId, payload);
    setDashboard(result);
    await fetchAccounts();
  };

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const hasConnectedOnlyFans = accounts.some(
    (account) => account.platform.toLowerCase() === 'onlyfans',
  );

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <h1>Creator Dashboard</h1>
          <p>{email}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <AccountConnectForm onSubmit={handleConnect} />

      <section className="card status-card">
        <div className="row">
          <h3>OnlyFans Connection Status</h3>
          <span className={hasConnectedOnlyFans ? 'status-badge connected' : 'status-badge disconnected'}>
            {hasConnectedOnlyFans ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        {hasConnectedOnlyFans ? (
          <p>
            Connected account:{' '}
            <strong>
              @{selectedAccount?.username ?? accounts[0].username}
            </strong>
          </p>
        ) : (
          <p>Connect your OnlyFans account to enable dashboard syncing.</p>
        )}
        {selectedAccount && (
          <p className="muted">
            Linked on {new Date(selectedAccount.createdAt).toLocaleString()}
          </p>
        )}
      </section>

      <section className="card">
        <h3>Connected Accounts</h3>
        {loading ? (
          <p>Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <p>No accounts connected yet.</p>
        ) : (
          <select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.username} ({account.platform})
              </option>
            ))}
          </select>
        )}
      </section>

      {selectedAccountId && (
        <section>
          <div className="row">
            <h2>@{dashboard?.account.username ?? '...'}</h2>
            <button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
          <MetricsCards metrics={dashboard?.metrics ?? null} />
          <TransactionsTable transactions={dashboard?.transactions ?? []} />
          <ManualSyncPanel onSubmit={handleManualSync} />
        </section>
      )}

      {error && <p className="error">{error}</p>}
    </main>
  );
};
