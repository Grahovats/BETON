import type { Metrics } from '../types';

type Props = {
  metrics: Metrics | null;
};

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const MetricsCards = ({ metrics }: Props) => {
  const items = [
    {
      label: 'Total Earnings',
      value: metrics ? currency.format(metrics.totalEarnings) : '-',
    },
    {
      label: 'Active Subscribers',
      value: metrics ? metrics.activeSubscribers : '-',
    },
    {
      label: 'Messages Count',
      value: metrics ? metrics.messagesCount : '-',
    },
    {
      label: 'Revenue This Month',
      value: metrics ? currency.format(metrics.revenueThisMonth) : '-',
    },
  ];

  return (
    <div className="metrics-grid">
      {items.map((item) => (
        <article key={item.label} className="card metric-card">
          <p>{item.label}</p>
          <h3>{item.value}</h3>
        </article>
      ))}
    </div>
  );
};
