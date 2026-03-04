import { useEffect, useState } from 'react';
import { getMe, loginWithOnlyFansPopup } from '../services/authService';

const TOKEN_KEY = 'ofm_token';

type AuthState = {
  token: string | null;
  email: string | null;
  loading: boolean;
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem(TOKEN_KEY),
    email: null,
    loading: true,
  });

  useEffect(() => {
    const initialize = async () => {
      if (!state.token) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const result = await getMe(state.token);
        setState({ token: state.token, email: result.user.email, loading: false });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setState({ token: null, email: null, loading: false });
      }
    };

    void initialize();
  }, [state.token]);

  const doOnlyFansLogin = async () => {
    const result = await loginWithOnlyFansPopup();
    localStorage.setItem(TOKEN_KEY, result.token);
    setState({ token: result.token, email: result.user.email, loading: false });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ token: null, email: null, loading: false });
  };

  return {
    ...state,
    isAuthenticated: Boolean(state.token),
    loginWithOnlyFans: doOnlyFansLogin,
    logout,
  };
};
