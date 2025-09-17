const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for strategies
const predefinedStrategies = [
  {
    id: 1,
    name: "Buy Low Sell High",
    description: "Buy when price drops 5%, sell when it rises 10%",
    buyCondition: "price_change_24h < -5",
    sellCondition: "price_change_24h > 10",
    risk: "Medium",
    category: "Momentum"
  },
  {
    id: 2,
    name: "RSI Oversold",
    description: "Buy when RSI < 30, sell when RSI > 70",
    buyCondition: "rsi < 30",
    sellCondition: "rsi > 70",
    risk: "Low",
    category: "Technical"
  },
  {
    id: 3,
    name: "Moving Average Crossover",
    description: "Buy when MA(10) crosses above MA(50)",
    buyCondition: "ma_10 > ma_50",
    sellCondition: "ma_10 < ma_50",
    risk: "Medium",
    category: "Trend Following"
  }
];

// Mock portfolio data
let portfolio = {
  balance: 10000, // USD
  positions: [],
  history: []
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CryptoRules API is running' });
});

// Get market data (using CoinGecko API as example)
app.get('/api/market/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // Mock data for demonstration
    const mockData = {
      symbol: symbol.toUpperCase(),
      price: Math.random() * 50000 + 10000,
      change24h: (Math.random() - 0.5) * 20,
      volume: Math.random() * 1000000000,
      timestamp: Date.now()
    };
    res.json(mockData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get historical data for charts
app.get('/api/historical/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 30 } = req.query;
    
    // Generate mock historical data
    const data = [];
    const basePrice = 40000;
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const price = basePrice + (Math.random() - 0.5) * 10000;
      data.push({
        timestamp: date.getTime(),
        price: price,
        volume: Math.random() * 1000000
      });
    }
    
    res.json({ symbol: symbol.toUpperCase(), data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get predefined strategies
app.get('/api/strategies/predefined', (req, res) => {
  res.json(predefinedStrategies);
});

// Get user strategies
app.get('/api/strategies/user', (req, res) => {
  // Mock user strategies
  res.json([]);
});

// Create new strategy
app.post('/api/strategies', (req, res) => {
  const { name, description, buyCondition, sellCondition, risk } = req.body;
  const newStrategy = {
    id: Date.now(),
    name,
    description,
    buyCondition,
    sellCondition,
    risk,
    category: "Custom",
    created: new Date().toISOString()
  };
  res.json(newStrategy);
});

// Backtest strategy
app.post('/api/backtest', (req, res) => {
  const { strategyId, symbol, startDate, endDate } = req.body;
  
  // Mock backtest results
  const mockResults = {
    initialBalance: 10000,
    finalBalance: 12500,
    totalReturn: 25,
    totalTrades: 15,
    winRate: 73.3,
    maxDrawdown: -8.5,
    sharpeRatio: 1.45,
    trades: [
      { date: '2023-01-01', type: 'buy', price: 40000, amount: 0.25 },
      { date: '2023-01-15', type: 'sell', price: 42000, amount: 0.25 },
      // Add more mock trades
    ]
  };
  
  res.json(mockResults);
});

// Get portfolio
app.get('/api/portfolio', (req, res) => {
  res.json(portfolio);
});

// Execute trade (paper trading)
app.post('/api/trade', (req, res) => {
  const { symbol, type, amount, price } = req.body;
  
  const trade = {
    id: Date.now(),
    symbol,
    type,
    amount: parseFloat(amount),
    price: parseFloat(price),
    total: parseFloat(amount) * parseFloat(price),
    timestamp: new Date().toISOString()
  };
  
  // Update portfolio (simplified)
  if (type === 'buy' && portfolio.balance >= trade.total) {
    portfolio.balance -= trade.total;
    portfolio.positions.push(trade);
  } else if (type === 'sell') {
    portfolio.balance += trade.total;
    // Remove from positions (simplified)
  }
  
  portfolio.history.push(trade);
  
  res.json({ success: true, trade, portfolio });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});