import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiDollarSign, FiArrowDown, FiArrowUp, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

const WalletPage = () => {
  const { user } = useContext(AuthContext);
  const [wallet, setWallet] = useState({
    balance: 0,
    transactions: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock wallet data
    setWallet({
      balance: 5250.50,
      transactions: [
        { id: 1, type: 'credit', amount: 3500, description: 'Order ORD001 completed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { id: 2, type: 'debit', amount: -1000, description: 'Water refill order', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: 3, type: 'credit', amount: 2500, description: 'Order ORD002 completed', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { id: 4, type: 'debit', amount: -750, description: 'Maintenance service', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
      ]
    });
    setLoading(false);
  }, []);

  const handleWithdraw = () => {
    alert('Withdrawal feature - redirect to withdrawal form');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <h1>Your Wallet</h1>

      <div className="wallet-card">
        <div className="balance-section">
          <FiDollarSign size={32} />
          <div className="balance-info">
            <p className="balance-label">Available Balance</p>
            <p className="balance-amount">{wallet.balance.toFixed(2)} SAR</p>
          </div>
        </div>

        <div className="wallet-actions">
          <button className="btn btn-primary">
            <FiCreditCard /> Add Funds
          </button>
          <button className="btn btn-secondary" onClick={handleWithdraw}>
            <FiArrowUp /> Withdraw
          </button>
        </div>
      </div>

      <div className="transaction-section">
        <h2>Transaction History</h2>
        <div className="transaction-list">
          {wallet.transactions.map(tx => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-icon">
                {tx.type === 'credit' ? (
                  <FiArrowDown style={{ color: '#10b981' }} />
                ) : (
                  <FiArrowUp style={{ color: '#ef4444' }} />
                )}
              </div>
              <div className="transaction-details">
                <p className="transaction-description">{tx.description}</p>
                <p className="transaction-date">
                  {tx.date.toLocaleDateString('en-SA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className={`transaction-amount ${tx.type}`}>
                {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)} SAR
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wallet-features">
        <div className="feature-card">
          <FiTrendingUp size={24} />
          <h3>Auto-Recharge</h3>
          <p>Set up automatic recharges when balance drops below your threshold</p>
          <button className="btn btn-secondary btn-small">Configure</button>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
