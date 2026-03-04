export type User = {
  id?: string;
  userId?: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Account = {
  id: string;
  username: string;
  platform: string;
  createdAt: string;
  lastSnapshot: Metrics | null;
};

export type Metrics = {
  id: string;
  fetchedAt: string;
  totalEarnings: number;
  activeSubscribers: number;
  messagesCount: number;
  revenueThisMonth: number;
};

export type Transaction = {
  id: string;
  externalId: string;
  amount: number;
  currency: string;
  description: string;
  status: string;
  createdAt: string;
};

export type DashboardResponse = {
  account: {
    id: string;
    username: string;
    platform: string;
  };
  metrics: Metrics | null;
  transactions: Transaction[];
};
