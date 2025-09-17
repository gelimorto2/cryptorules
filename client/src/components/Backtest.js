import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Backtest = () => {
  const [backtestForm, setBacktestForm] = useState({
    strategyId: '1',
    symbol: 'BTC',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialBalance: '10000'
  });
  const [backtestResults, setBacktestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const strategies = [
    { id: '1', name: 'Buy Low Sell High' },
    { id: '2', name: 'RSI Oversold' },
    { id: '3', name: 'Moving Average Crossover' }
  ];

  const handleBacktest = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/backtest', backtestForm);
      setBacktestResults(response.data);
    } catch (error) {
      console.error('Error running backtest:', error);
      alert('Error running backtest');
    } finally {
      setLoading(false);
    }
  };

  const portfolioChart = backtestResults ? {
    labels: ['Initial', 'Final'],
    datasets: [
      {
        label: 'Portfolio Value (USD)',
        data: [backtestResults.initialBalance, backtestResults.finalBalance],
        backgroundColor: ['rgba(102, 126, 234, 0.5)', 'rgba(5, 150, 105, 0.5)'],
        borderColor: ['rgb(102, 126, 234)', 'rgb(5, 150, 105)'],
        borderWidth: 2
      }
    ]
  } : null;

  const metricsChart = backtestResults ? {
    labels: ['Win Rate %', 'Total Return %', 'Sharpe Ratio'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [backtestResults.winRate, backtestResults.totalReturn, backtestResults.sharpeRatio * 20],
        backgroundColor: 'rgba(102, 126, 234, 0.5)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 2
      }
    ]
  } : null;

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Strategy Backtesting</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3>Backtest Configuration</h3>
            <form onSubmit={handleBacktest}>
              <div className="form-group">
                <label>Strategy</label>
                <select
                  className="form-control"
                  value={backtestForm.strategyId}
                  onChange={(e) => setBacktestForm({...backtestForm, strategyId: e.target.value})}
                >
                  {strategies.map(strategy => (
                    <option key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Symbol</label>
                <select
                  className="form-control"
                  value={backtestForm.symbol}
                  onChange={(e) => setBacktestForm({...backtestForm, symbol: e.target.value})}
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="ADA">Cardano (ADA)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={backtestForm.startDate}
                  onChange={(e) => setBacktestForm({...backtestForm, startDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={backtestForm.endDate}
                  onChange={(e) => setBacktestForm({...backtestForm, endDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Initial Balance (USD)</label>
                <input
                  type="number"
                  className="form-control"
                  value={backtestForm.initialBalance}
                  onChange={(e) => setBacktestForm({...backtestForm, initialBalance: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Running Backtest...' : 'Run Backtest'}
              </button>
            </form>
          </div>

          {backtestResults && (
            <div className="card">
              <h3>Backtest Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                    {backtestResults.totalReturn.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Return</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                    {backtestResults.totalTrades}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Trades</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {backtestResults.winRate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Win Rate</div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {backtestResults.maxDrawdown.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Max Drawdown</div>
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <div>Initial Balance: <strong>${backtestResults.initialBalance.toLocaleString()}</strong></div>
                <div>Final Balance: <strong>${backtestResults.finalBalance.toLocaleString()}</strong></div>
                <div>Sharpe Ratio: <strong>{backtestResults.sharpeRatio.toFixed(2)}</strong></div>
              </div>
            </div>
          )}
        </div>

        {backtestResults && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3>Portfolio Value</h3>
                <div className="chart-container" style={{ height: '300px' }}>
                  <Bar data={portfolioChart} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    }
                  }} />
                </div>
              </div>

              <div className="card">
                <h3>Performance Metrics</h3>
                <div className="chart-container" style={{ height: '300px' }}>
                  <Bar data={metricsChart} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Trade History</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestResults.trades.map((trade, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem' }}>{trade.date}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            color: trade.type === 'buy' ? '#059669' : '#dc2626',
                            fontWeight: 'bold'
                          }}>
                            {trade.type.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          ${trade.price.toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          {trade.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!backtestResults && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>
              📊 Ready to Backtest
            </h3>
            <p style={{ color: '#9ca3af' }}>
              Configure your strategy parameters and run a backtest to see historical performance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backtest;