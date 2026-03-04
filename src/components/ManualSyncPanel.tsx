import { useState } from 'react';
import type { FormEvent } from 'react';

type Props = {
  onSubmit: (payload: {
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
  }) => Promise<void>;
};

const example = {
  metrics: {
    totalEarnings: 12500,
    activeSubscribers: 420,
    messagesCount: 981,
    revenueThisMonth: 1800,
  },
  transactions: [
    {
      externalId: 'tx_1',
      amount: 29.99,
      currency: 'USD',
      description: 'Subscription payment',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ],
};

export const ManualSyncPanel = ({ onSubmit }: Props) => {
  const [raw, setRaw] = useState(JSON.stringify(example, null, 2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = JSON.parse(raw) as Parameters<Props['onSubmit']>[0];
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Manual Sync Import</h3>
      <p>Paste JSON from an approved data export pipeline for this account.</p>
      <label>
        JSON Payload
        <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={12} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Importing...' : 'Import Sync Data'}
      </button>
    </form>
  );
};
