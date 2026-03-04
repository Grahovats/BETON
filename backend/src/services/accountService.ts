import { prisma } from '../prisma.js';
import { decrypt, encrypt } from '../utils/encryption.js';
import { fetchOnlyFansDashboardMock } from './onlyFansService.js';

type ManualSyncPayload = {
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
    createdAt: string | Date;
  }>;
};

const persistAccountData = async (accountId: string, payload: ManualSyncPayload) => {
  const snapshot = await prisma.accountSnapshot.create({
    data: {
      accountId,
      totalEarnings: payload.metrics.totalEarnings,
      activeSubscribers: payload.metrics.activeSubscribers,
      messagesCount: payload.metrics.messagesCount,
      revenueThisMonth: payload.metrics.revenueThisMonth,
    },
  });

  await prisma.$transaction(
    payload.transactions.map((transaction) =>
      prisma.transaction.upsert({
        where: {
          accountId_externalId: {
            accountId,
            externalId: transaction.externalId,
          },
        },
        create: {
          accountId,
          externalId: transaction.externalId,
          amount: transaction.amount,
          currency: transaction.currency,
          description: transaction.description,
          status: transaction.status,
          createdAt: new Date(transaction.createdAt),
        },
        update: {
          amount: transaction.amount,
          currency: transaction.currency,
          description: transaction.description,
          status: transaction.status,
          createdAt: new Date(transaction.createdAt),
          fetchedAt: new Date(),
        },
      }),
    ),
  );

  const transactions = await prisma.transaction.findMany({
    where: { accountId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return { snapshot, transactions };
};

export const createConnectedAccount = async (params: {
  userId: string;
  username: string;
  apiToken: string;
  password?: string;
}) => {
  const account = await prisma.connectedAccount.create({
    data: {
      userId: params.userId,
      username: params.username,
      encryptedToken: encrypt(params.apiToken),
      encryptedPassword: params.password ? encrypt(params.password) : null,
    },
  });

  return account;
};

export const listConnectedAccounts = async (userId: string) => {
  const accounts = await prisma.connectedAccount.findMany({
    where: { userId },
    include: {
      snapshots: {
        orderBy: { fetchedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return accounts.map((account) => ({
    id: account.id,
    platform: account.platform,
    username: account.username,
    createdAt: account.createdAt,
    lastSnapshot: account.snapshots[0] ?? null,
  }));
};

export const refreshAccountData = async (userId: string, accountId: string) => {
  const account = await prisma.connectedAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const apiToken = decrypt(account.encryptedToken);

  const data = await fetchOnlyFansDashboardMock({
    username: account.username,
    token: apiToken,
  });

  const { snapshot, transactions } = await persistAccountData(account.id, data);

  return {
    account: {
      id: account.id,
      username: account.username,
      platform: account.platform,
    },
    metrics: snapshot,
    transactions,
  };
};

export const manualSyncAccountData = async (
  userId: string,
  accountId: string,
  payload: ManualSyncPayload,
) => {
  const account = await prisma.connectedAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const { snapshot, transactions } = await persistAccountData(account.id, payload);

  return {
    account: {
      id: account.id,
      username: account.username,
      platform: account.platform,
    },
    metrics: snapshot,
    transactions,
  };
};

export const getDashboardData = async (userId: string, accountId: string) => {
  const account = await prisma.connectedAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const latestSnapshot = await prisma.accountSnapshot.findFirst({
    where: { accountId: account.id },
    orderBy: { fetchedAt: 'desc' },
  });

  const transactions = await prisma.transaction.findMany({
    where: { accountId: account.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    account: {
      id: account.id,
      username: account.username,
      platform: account.platform,
    },
    metrics: latestSnapshot,
    transactions,
  };
};
