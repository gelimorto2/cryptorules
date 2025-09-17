# CryptoRules 🚀

A simplified dashboard for crypto trading automation - an open-source clone of CoinRule with comprehensive features for strategy creation, backtesting, and portfolio management.

![Dashboard](https://github.com/user-attachments/assets/d2f3dc47-3e5a-4f4b-85eb-b3076acf5b1f)

## Features

### 📊 **Trading Dashboard**
- Real-time market data display
- Portfolio overview with key metrics
- Interactive Bitcoin price charts (30-day historical data)
- Quick action buttons for common tasks
- Market status indicators

### 🎯 **Strategy Management**
- **Predefined Strategies**: Ready-to-use trading strategies including:
  - Buy Low Sell High
  - RSI Oversold/Overbought
  - Moving Average Crossover
- **Custom Strategy Creation**: Build your own strategies with:
  - Custom buy/sell conditions
  - Risk level configuration
  - Strategy description and naming
- **Strategy Categories**: Momentum, Technical Analysis, Trend Following

![Strategies](https://github.com/user-attachments/assets/678f49b0-3a47-4c14-ac8d-6c1689e75c3e)

### 💼 **Portfolio Management**
- **Paper Trading**: Risk-free trading simulation
- **Real-time Portfolio Tracking**:
  - Cash balance monitoring
  - Active positions overview
  - Trade history with detailed records
- **Multi-Asset Support**: Bitcoin, Ethereum, Cardano, Polkadot
- **Trade Execution**: Simple buy/sell interface with instant execution

### 📈 **Advanced Backtesting**
- **Strategy Performance Analysis**:
  - Total return calculation
  - Win rate statistics
  - Maximum drawdown analysis
  - Sharpe ratio computation
- **Visual Analytics**:
  - Portfolio value charts
  - Performance metrics visualization
  - Trade history analysis
- **Configurable Parameters**:
  - Custom date ranges
  - Initial balance settings
  - Multiple cryptocurrency symbols

![Backtesting](https://github.com/user-attachments/assets/26ff7998-0d6c-4547-91b9-888523f579d6)

## Technology Stack

### Backend
- **Node.js** with Express.js
- RESTful API architecture
- Mock data for demonstration (easily extensible to real crypto APIs)
- CORS enabled for frontend integration

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Chart.js** with react-chartjs-2 for data visualization
- **Responsive CSS** with modern design patterns
- **Lucide React** for icons

### Key Libraries
- `axios` for HTTP requests
- `ws` for WebSocket support (ready for real-time data)
- `dotenv` for environment configuration
- `cors` for cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/gelimorto2/cryptorules.git
   cd cryptorules
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Individual Component Setup

**Backend only:**
```bash
npm install
npm run server
```

**Frontend only:**
```bash
cd client
npm install
npm start
```

**Production build:**
```bash
npm run build
npm start
```

## API Endpoints

### Market Data
- `GET /api/health` - Health check
- `GET /api/market/:symbol` - Current market data
- `GET /api/historical/:symbol` - Historical price data

### Strategy Management
- `GET /api/strategies/predefined` - Get predefined strategies
- `GET /api/strategies/user` - Get user-created strategies
- `POST /api/strategies` - Create new strategy

### Portfolio & Trading
- `GET /api/portfolio` - Get portfolio data
- `POST /api/trade` - Execute trade (paper trading)

### Backtesting
- `POST /api/backtest` - Run strategy backtest

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

### Crypto API Integration
The application is designed to easily integrate with real crypto APIs. Update the market data endpoints in `server/index.js` to connect with:
- CoinGecko API
- Binance API
- CoinMarketCap API
- Other cryptocurrency data providers

## Features in Detail

### Paper Trading
- **Risk-free environment** for testing strategies
- **Real-time portfolio tracking** with balance updates
- **Comprehensive trade history** with timestamps and details
- **Multi-asset support** for diversified portfolios

### Strategy Creation
- **Visual strategy builder** with form-based interface
- **Condition-based logic** for buy/sell triggers
- **Risk assessment** with low/medium/high classifications
- **Strategy categorization** for better organization

### Backtesting Engine
- **Historical performance analysis** with configurable date ranges
- **Statistical metrics** including Sharpe ratio and drawdown analysis
- **Visual results** with charts and performance indicators
- **Trade simulation** with detailed transaction logs

## Development Roadmap

### Phase 1 ✅ (Completed)
- Basic dashboard with market data
- Strategy management system
- Paper trading functionality
- Backtesting with charts

### Phase 2 (Planned)
- Real crypto broker integration
- Live trading capabilities
- Advanced technical indicators
- Strategy automation

### Phase 3 (Future)
- Social trading features
- Strategy marketplace
- Mobile application
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software is for educational and simulation purposes only. It includes paper trading functionality and should not be used for actual financial trading without proper risk assessment and testing. Always consult with financial advisors before making real trading decisions.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ by the CryptoRules Team**
