import crypto from 'crypto';

type FetchInput = {
  username: string;
  token: string;
};

type ValidateInput = {
  username: string;
  token: string;
  password?: string;
};

export type OnlyFansMetrics = {
  totalEarnings: number;
  activeSubscribers: number;
  messagesCount: number;
  revenueThisMonth: number;
};

export type OnlyFansTransaction = {
  externalId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending';
  createdAt: Date;
};

export type OnlyFansDashboardData = {
  metrics: OnlyFansMetrics;
  transactions: OnlyFansTransaction[];
};

export const validateOnlyFansCredentialsMock = async (
  input: ValidateInput,
): Promise<{ valid: boolean }> => {
  const normalizedUsername = input.username.trim().toLowerCase();
  const token = input.token.trim();

  if (normalizedUsername.length < 2 || token.length < 8) {
    return { valid: false };
  }

  if (input.password && input.password.length < 4) {
    return { valid: false };
  }

  return { valid: true };
};

const seededNumber = (seed: string, min: number, max: number): number => {
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  const value = Number.parseInt(hash.slice(0, 8), 16);
  return min + (value % (max - min + 1));
};

const withCents = (amount: number): number => Number(amount.toFixed(2));

export const fetchOnlyFansDashboardMock = async (
  input: FetchInput,
): Promise<OnlyFansDashboardData> => {
  const baseSeed = `${input.username}:${input.token}`;
  const totalEarnings = withCents(seededNumber(`${baseSeed}:earnings`, 2000, 50000) + Math.random() * 100);
  const revenueThisMonth = withCents(totalEarnings * 0.08 + Math.random() * 250);

  const transactions: OnlyFansTransaction[] = Array.from({ length: 8 }).map((_, index) => {
    const seed = `${baseSeed}:tx:${index}`;
    const amount = withCents(seededNumber(seed, 10, 350) + Math.random());
    return {
      externalId: crypto.createHash('md5').update(seed).digest('hex'),
      amount,
      currency: 'USD',
      description: `Subscription payment #${index + 1}`,
      status: index % 3 === 0 ? 'pending' : 'completed',
      createdAt: new Date(Date.now() - index * 86400000),
    };
  });

  return {
    metrics: {
      totalEarnings,
      activeSubscribers: seededNumber(`${baseSeed}:subs`, 50, 1500),
      messagesCount: seededNumber(`${baseSeed}:msgs`, 100, 10000),
      revenueThisMonth,
    },
    transactions,
  };
};
