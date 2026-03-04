import { apiRequest } from './api';
import type { AuthResponse } from '../types';

export const loginWithOnlyFans = (username: string, apiToken: string, password?: string) => {
  return apiRequest<AuthResponse>('/auth/onlyfans-login', {
    method: 'POST',
    body: JSON.stringify({ username, apiToken, password }),
  });
};

const POPUP_USERNAME_KEY = 'ofm_popup_onlyfans_username';
const POPUP_TOKEN_KEY = 'ofm_popup_onlyfans_token';

const randomSuffix = () => Math.random().toString(36).slice(2, 10);

const getOrCreatePopupCredentials = () => {
  let username = localStorage.getItem(POPUP_USERNAME_KEY);
  let apiToken = localStorage.getItem(POPUP_TOKEN_KEY);

  if (!username) {
    username = `ofuser_${randomSuffix()}`;
    localStorage.setItem(POPUP_USERNAME_KEY, username);
  }

  if (!apiToken) {
    apiToken = `token_${randomSuffix()}_${randomSuffix()}`;
    localStorage.setItem(POPUP_TOKEN_KEY, apiToken);
  }

  return { username, apiToken };
};

export const loginWithOnlyFansPopup = () => {
  const { username, apiToken } = getOrCreatePopupCredentials();
  return loginWithOnlyFans(username, apiToken);
};

export const getMe = (token: string) => {
  return apiRequest<{ user: { userId: string; email: string } }>('/auth/me', {}, token);
};
