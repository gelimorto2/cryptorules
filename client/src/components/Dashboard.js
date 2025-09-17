import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    fetchHistoricalData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('/api/market/btc');
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get('/api/historical/btc?days=30');
      setHistoricalData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: historicalData.map(item => 
      new Date(item.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'BTC Price (USD)',
        data: historicalData.map(item => item.price),
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Bitcoin Price Chart (30 Days)'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
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
        <h1>Trading Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h3>Bitcoin Price</h3>
            <div className="metric-value">
              ${marketData.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div className={`metric-change ${marketData.change24h >= 0 ? 'positive' : 'negative'}`}>
              {marketData.change24h >= 0 ? '↗' : '↘'} {Math.abs(marketData.change24h)?.toFixed(2)}%
            </div>
          </div>

          <div className="card">
            <h3>24h Volume</h3>
            <div className="metric-value">
              ${marketData.volume?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="metric-change">
              Trading volume in last 24h
            </div>
          </div>

          <div className="card">
            <h3>Active Strategies</h3>
            <div className="metric-value">3</div>
            <div className="metric-change">
              Running automated strategies
            </div>
          </div>

          <div className="card">
            <h3>Portfolio Value</h3>
            <div className="metric-value">$12,500</div>
            <div className="metric-change positive">
              ↗ +25.0%
            </div>
          </div>
        </div>

        <div className="card">
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">Create Strategy</button>
              <button className="btn btn-secondary">View Portfolio</button>
              <button className="btn btn-success">Start Trading</button>
            </div>
          </div>

          <div className="card">
            <h3>Market Status</h3>
            <div style={{ color: '#059669', fontWeight: 'bold' }}>
              🟢 Markets Open
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;