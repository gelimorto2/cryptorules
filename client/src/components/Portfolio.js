import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [tradeForm, setTradeForm] = useState({
    symbol: 'BTC',
    type: 'buy',
    amount: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('/api/portfolio');
      setPortfolio(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setLoading(false);
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/trade', tradeForm);
      setPortfolio(response.data.portfolio);
      setTradeForm({
        symbol: 'BTC',
        type: 'buy',
        amount: '',
        price: ''
      });
      alert(`Trade executed successfully!`);
    } catch (error) {
      console.error('Error executing trade:', error);
      alert('Error executing trade');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Portfolio Management</h1>
        
        <div className="portfolio-summary">
          <div className="card">
            <h3>Cash Balance</h3>
            <div className="metric-value">
              ${portfolio?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className="metric-change">
              Available for trading
            </div>
          </div>

          <div className="card">
            <h3>Total Positions</h3>
            <div className="metric-value">
              {portfolio?.positions?.length || 0}
            </div>
            <div className="metric-change">
              Active holdings
            </div>
          </div>

          <div className="card">
            <h3>Total Trades</h3>
            <div className="metric-value">
              {portfolio?.history?.length || 0}
            </div>
            <div className="metric-change">
              Historical transactions
            </div>
          </div>

          <div className="card">
            <h3>Portfolio Type</h3>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>
              📄 Paper
            </div>
            <div className="metric-change">
              Simulated trading
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3>Execute Trade (Paper Trading)</h3>
            <form onSubmit={handleTrade} className="trade-form">
              <div className="form-group">
                <label>Symbol</label>
                <select
                  className="form-control"
                  value={tradeForm.symbol}
                  onChange={(e) => setTradeForm({...tradeForm, symbol: e.target.value})}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="DOT">Polkadot (DOT)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={tradeForm.type}
                  onChange={(e) => setTradeForm({...tradeForm, type: e.target.value})}
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.00001"
                  className="form-control"
                  value={tradeForm.amount}
                  onChange={(e) => setTradeForm({...tradeForm, amount: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={tradeForm.price}
                  onChange={(e) => setTradeForm({...tradeForm, price: e.target.value})}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Execute {tradeForm.type.charAt(0).toUpperCase() + tradeForm.type.slice(1)} Order
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Current Positions</h3>
            {portfolio?.positions?.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {portfolio.positions.map((position, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{position.symbol}</strong>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {position.amount} @ ${position.price}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 'bold' }}>
                          ${(position.amount * position.price).toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(position.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                No positions currently held
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h3>Trade History</h3>
          {portfolio?.history?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Symbol</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.history.map((trade, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem' }}>
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem' }}>{trade.symbol}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          color: trade.type === 'buy' ? '#059669' : '#dc2626',
                          fontWeight: 'bold'
                        }}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {trade.amount}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        ${trade.price.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        ${trade.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No trade history yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;