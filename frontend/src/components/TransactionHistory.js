import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Implement fetchTransactions function
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const resp = await apiService.getTransactions(account || null, 20);
        setTransactions(resp.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            Filtering for: {formatAddress(account)}
          </div>
        )}
      </div>

      {/* TODO: Display transactions list */}
      {/* Show: type, from, to, amount, currency, status, timestamp, blockchainTxHash */}
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="empty">No transactions found</div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="transaction-card">
              <div className="tx-main">
                <div className="tx-type">{t.type}</div>
                <div className="tx-amount">{t.amount} {t.currency || 'ETH'}</div>
                <div className="tx-from">From: {formatAddress(t.from)}</div>
                <div className="tx-to">To: {formatAddress(t.to)}</div>
                <div className="tx-status">Status: {t.status}</div>
                <div className="tx-time">{formatDate(t.timestamp)}</div>
                <div className="tx-hash">Hash: {t.blockchainTxHash || '—'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;


