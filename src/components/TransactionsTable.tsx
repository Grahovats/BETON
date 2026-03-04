import type { Transaction } from '../types';

type Props = {
  transactions: Transaction[];
};

export const TransactionsTable = ({ transactions }: Props) => {
  return (
    <section className="card">
      <h3>Recent Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>{tx.status}</td>
              <td>
                {tx.currency} {tx.amount.toFixed(2)}
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={4}>No transactions yet. Refresh this account to fetch data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
