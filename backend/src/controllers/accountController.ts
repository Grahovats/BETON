import type { Request, Response } from 'express';
import {
  createConnectedAccount,
  getDashboardData,
  listConnectedAccounts,
  manualSyncAccountData,
  refreshAccountData,
} from '../services/accountService.js';

export const createAccount = async (req: Request, res: Response) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { username, apiToken, password } = req.body as {
      username?: string;
      apiToken?: string;
      password?: string;
    };

    if (!username || !apiToken) {
      res.status(400).json({ error: 'Username and apiToken are required' });
      return;
    }

    const account = await createConnectedAccount({
      userId: req.authUser.userId,
      username,
      apiToken,
      password,
    });

    res.status(201).json({
      id: account.id,
      username: account.username,
      platform: account.platform,
      createdAt: account.createdAt,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const listAccounts = async (req: Request, res: Response) => {
  if (!req.authUser) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const accounts = await listConnectedAccounts(req.authUser.userId);
  res.json({ accounts });
};

export const refreshAccount = async (req: Request, res: Response) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await refreshAccountData(req.authUser.userId, req.params.accountId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const result = await getDashboardData(req.authUser.userId, req.params.accountId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const manualSyncAccount = async (req: Request, res: Response) => {
  try {
    if (!req.authUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const body = req.body as {
      metrics?: {
        totalEarnings?: number;
        activeSubscribers?: number;
        messagesCount?: number;
        revenueThisMonth?: number;
      };
      transactions?: Array<{
        externalId?: string;
        amount?: number;
        currency?: string;
        description?: string;
        status?: string;
        createdAt?: string;
      }>;
    };

    if (!body.metrics || !Array.isArray(body.transactions)) {
      res.status(400).json({ error: 'metrics and transactions are required' });
      return;
    }

    const result = await manualSyncAccountData(req.authUser.userId, req.params.accountId, {
      metrics: {
        totalEarnings: Number(body.metrics.totalEarnings ?? 0),
        activeSubscribers: Number(body.metrics.activeSubscribers ?? 0),
        messagesCount: Number(body.metrics.messagesCount ?? 0),
        revenueThisMonth: Number(body.metrics.revenueThisMonth ?? 0),
      },
      transactions: body.transactions
        .filter((tx) => tx.externalId)
        .map((tx) => ({
          externalId: tx.externalId as string,
          amount: Number(tx.amount ?? 0),
          currency: tx.currency ?? 'USD',
          description: tx.description ?? 'Imported transaction',
          status: tx.status ?? 'completed',
          createdAt: tx.createdAt ?? new Date().toISOString(),
        })),
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
