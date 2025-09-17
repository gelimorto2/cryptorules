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
  },
  {
    id: 4,
    name: "Bollinger Bands Squeeze",
    description: "Buy when price touches lower Bollinger Band, sell at upper band",
    buyCondition: "price <= bb_lower",
    sellCondition: "price >= bb_upper",
    risk: "Medium",
    category: "Technical"
  },
  {
    id: 5,
    name: "MACD Golden Cross",
    description: "Buy when MACD line crosses above signal line",
    buyCondition: "macd > macd_signal",
    sellCondition: "macd < macd_signal",
    risk: "Low",
    category: "Technical"
  },
  {
    id: 6,
    name: "Volume Breakout",
    description: "Buy when volume spikes 200% above average with price increase",
    buyCondition: "volume > avg_volume * 3 && price_change_1h > 2",
    sellCondition: "volume < avg_volume * 0.8",
    risk: "High",
    category: "Momentum"
  },
  {
    id: 7,
    name: "Support and Resistance",
    description: "Buy at support levels, sell at resistance levels",
    buyCondition: "price <= support_level * 1.02",
    sellCondition: "price >= resistance_level * 0.98",
    risk: "Medium",
    category: "Technical"
  },
  {
    id: 8,
    name: "Scalping Bot",
    description: "Quick trades on small price movements (0.5-1%)",
    buyCondition: "price_change_5m < -0.5",
    sellCondition: "price_change_5m > 0.8",
    risk: "High",
    category: "Scalping"
  },
  {
    id: 9,
    name: "DCA Strategy",
    description: "Dollar Cost Averaging - buy fixed amounts on price drops",
    buyCondition: "price_change_24h < -3",
    sellCondition: "portfolio_profit > 15",
    risk: "Low",
    category: "DCA"
  },
  {
    id: 10,
    name: "Mean Reversion",
    description: "Buy when price deviates significantly from moving average",
    buyCondition: "price < ma_20 * 0.95",
    sellCondition: "price > ma_20 * 1.05",
    risk: "Medium",
    category: "Mean Reversion"
  },
  {
    id: 11,
    name: "Momentum Breakout",
    description: "Buy on strong upward momentum with high volume",
    buyCondition: "price_change_1h > 3 && rsi > 60 && volume > avg_volume * 2",
    sellCondition: "rsi > 80 || price_change_1h < -2",
    risk: "High",
    category: "Momentum"
  },
  {
    id: 12,
    name: "Stochastic RSI Bot",
    description: "Buy when Stochastic RSI is oversold, sell when overbought",
    buyCondition: "stoch_rsi < 20",
    sellCondition: "stoch_rsi > 80",
    risk: "Low",
    category: "Technical"
  },
  {
    id: 13,
    name: "Grid Trading Bot",
    description: "Buy at predefined levels below current price, sell above",
    buyCondition: "price <= grid_buy_level",
    sellCondition: "price >= grid_sell_level",
    risk: "Medium",
    category: "Grid Trading"
  },
  {
    id: 14,
    name: "News Sentiment Bot",
    description: "Trade based on market sentiment and news analysis",
    buyCondition: "sentiment_score > 0.7 && news_impact > 0.5",
    sellCondition: "sentiment_score < 0.3 || news_impact < -0.5",
    risk: "High",
    category: "Sentiment"
  },
  {
    id: 15,
    name: "Arbitrage Hunter",
    description: "Exploit price differences between exchanges",
    buyCondition: "price_diff_exchanges > 1.5",
    sellCondition: "price_diff_exchanges < 0.5",
    risk: "Low",
    category: "Arbitrage"
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