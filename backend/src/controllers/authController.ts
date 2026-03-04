import type { Request, Response } from 'express';
import { loginUser, loginWithOnlyFans, registerUser } from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password || password.length < 6) {
      res.status(400).json({ error: 'Email and password (min 6 chars) are required' });
      return;
    }

    const result = await registerUser(email.toLowerCase().trim(), password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser(email.toLowerCase().trim(), password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const me = (req: Request, res: Response) => {
  if (!req.authUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({ user: req.authUser });
};

export const onlyFansLogin = async (req: Request, res: Response) => {
  try {
    const { username, apiToken, password } = req.body as {
      username?: string;
      apiToken?: string;
      password?: string;
    };

    if (!username || !apiToken) {
      res.status(400).json({ error: 'Username and apiToken are required' });
      return;
    }

    const result = await loginWithOnlyFans(username, apiToken, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};
