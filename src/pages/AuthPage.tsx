import { useState } from 'react';

type Props = {
  onOnlyFansLogin: () => Promise<void>;
};

export const AuthPage = ({ onOnlyFansLogin }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);

  const continueAfterPopupLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await onOnlyFansLogin();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openOnlyFansPopup = () => {
    window.open(
      'https://onlyfans.com/',
      'onlyfans-login',
      'popup=yes,width=460,height=720,left=120,top=80',
    );
    setPopupOpened(true);
  };

  return (
    <main className="container auth-layout">
      <section className="card auth-card">
        <h1>OnlyMonster MVP</h1>
        <p>Sign in using the OnlyFans window.</p>
        <p className="muted">
          1) Open the OnlyFans login window. 2) Log in there. 3) Click continue below.
        </p>
        <button className="text-button" type="button" onClick={openOnlyFansPopup}>
          Open OnlyFans Login Window
        </button>
        {error && <p className="error">{error}</p>}
        <button disabled={loading || !popupOpened} type="button" onClick={continueAfterPopupLogin}>
          {loading ? 'Please wait...' : 'Continue to Dashboard'}
        </button>
      </section>
    </main>
  );
};
