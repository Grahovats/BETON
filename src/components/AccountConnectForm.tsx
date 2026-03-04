import { useState } from 'react';
import type { FormEvent } from 'react';

type Props = {
  onSubmit: (payload: { username: string; apiToken: string; password?: string }) => Promise<void>;
};

export const AccountConnectForm = ({ onSubmit }: Props) => {
  const [username, setUsername] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit({ username, apiToken, password: password || undefined });
      setUsername('');
      setApiToken('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Connect OnlyFans Account</h3>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <label>
        API Token
        <input
          type="password"
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          required
        />
      </label>
      <label>
        Password (optional)
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button disabled={loading} type="submit">
        {loading ? 'Connecting...' : 'Connect Account'}
      </button>
    </form>
  );
};
