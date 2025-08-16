# 🚀 Crypto Dashboard

A modern, real-time cryptocurrency dashboard built with React, TypeScript, and cutting-edge web technologies. Features live data, interactive charts, historical analysis, and AI-powered trend predictions.

## ✨ Features

- **Real-time Data**: Live cryptocurrency prices from CoinGecko API
- **Interactive Charts**: Beautiful, responsive charts with Recharts
- **Historical Analysis**: 7-day price history with moving averages
- **AI Predictions**: Advanced trend prediction using linear regression and RSI
- **Responsive Design**: Works perfectly on desktop and mobile
- **Test-Driven Development**: Comprehensive test suite with 30+ tests
- **Modern UI**: Dark theme with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library
- **Build Tool**: Vite
- **API**: CoinGecko API
- **Icons**: Lucide React

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Run the setup script**:
   ```bash
   setup.bat
   ```
   This will:
   - Check Node.js installation
   - Install all dependencies
   - Run tests to verify setup

2. **Start the development server**:
   ```bash
   start-dev.bat
   ```

3. **Open your browser** to `http://localhost:5173`

### Option 2: Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

### Batch Files (Windows)
- `setup.bat` - Complete project setup
- `start-dev.bat` - Start development server
- `run-tests.bat` - Interactive test runner
- `build.bat` - Create production build

### npm Scripts
- `npm run dev` - Start development server
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run build` - Create production build
- `npm run preview` - Preview production build

## 🧪 Testing

The project uses Test-Driven Development (TDD) with comprehensive test coverage:

- **Unit Tests**: All services and components
- **Integration Tests**: Data flow and user interactions
- **Mocking**: External APIs and chart libraries
- **Coverage**: 100% test coverage for critical paths

Run specific test suites:
```bash
npm test -- CryptoService
npm test -- PriceChart
npm test -- Dashboard
```

## 📊 API Integration

The dashboard integrates with the CoinGecko API to provide:

- Top cryptocurrency listings
- Real-time price data
- Historical price data
- Market cap and volume information

**Note**: The API has rate limits. The dashboard handles errors gracefully and includes retry logic.

## 🔮 Prediction Algorithm

The AI prediction system uses:

1. **Linear Regression**: Trend analysis on historical prices
2. **RSI (Relative Strength Index)**: Momentum indicator
3. **Moving Averages**: Smoothed price trends
4. **Confidence Scoring**: Based on data quality and trend strength

## 🎨 UI Components

- **PriceChart**: Interactive price visualization
- **Dashboard**: Main application layout
- **useCryptoData**: Custom hook for data management
- **Responsive Design**: Mobile-first approach

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── PriceChart.tsx   # Interactive charts
│   └── *.test.tsx       # Component tests
├── services/            # Business logic
│   ├── cryptoService.ts    # API integration
│   ├── historicalService.ts # Historical data
│   ├── predictionService.ts # AI predictions
│   └── *.test.ts        # Service tests
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

## 🚀 Deployment

1. **Build for production**:
   ```bash
   build.bat
   ```

2. **Deploy the `dist` folder** to your web server

3. **Preview locally**:
   ```bash
   npm run preview
   ```

## 🔧 Configuration

The project uses:
- **Vite** for fast development and building
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for styling
- **Jest** for testing

## 📈 Performance

- **Fast Loading**: Optimized bundle with code splitting
- **Responsive**: Smooth interactions with proper loading states
- **Efficient**: Minimal API calls with caching
- **Accessible**: ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ using Test-Driven Development**

For support or questions, please check the console for any errors and ensure you have a stable internet connection for API calls.