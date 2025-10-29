# 📈 Stock Portfolio Tracker

A modern, responsive web application for tracking your stock portfolio with comprehensive holdings statement and transaction management.

## ✨ Features

### 🏦 Holdings Statement
- **Cumulative Position Tracking**: View your total holdings across all transactions
- **Professional Table Layout**: Clean, organized display similar to brokerage statements
- **Real-time Calculations**: Automatic profit/loss calculations and percentages

### 💱 Multi-Currency Support
- **Live Exchange Rates**: Real-time currency conversion using Alpha Vantage API
- **Fallback Rates**: Static rates when API limits are reached
- **Multiple Display Currencies**: View portfolio in USD, INR, EUR, GBP, and more
- **Proper Currency Formatting**: Correct symbols and locale-specific formatting

### 📊 Transaction Management
- **Buy/Sell Transactions**: Complete transaction history tracking
- **Stock Search**: Real-time stock search with auto-population
- **Transaction Editing**: Full CRUD operations for all transactions
- **Tabbed Interface**: Separate views for holdings and transaction history

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, professional interface
- **Real-time Updates**: Live data refresh and currency conversion
- **Intuitive Navigation**: Easy-to-use tabbed interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Alpha Vantage API key (free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/onion2907/cfo2.git
   cd cfo2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Railway (Recommended)

1. **Connect to GitHub**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Set Environment Variables**
   - `ALPHA_VANTAGE_API_KEY`: Your Alpha Vantage API key
   - `PORT`: 3000 (optional, Railway auto-assigns)

3. **Deploy**
   - Railway will automatically build and deploy
   - Your app will be live at the provided URL

### Other Platforms

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repo and deploy
- **Heroku**: `git push heroku main`

## 📱 Usage

### Adding Transactions
1. Click **"Add Transaction"** button
2. Search for stock symbol (e.g., "AAPL", "RELIANCE")
3. Select transaction type (Buy/Sell)
4. Enter quantity and price
5. Save transaction

### Viewing Holdings
1. **Holdings Tab**: See cumulative position summary
2. **Transactions Tab**: View all individual transactions
3. **Currency Selector**: Change display currency
4. **Refresh Button**: Update exchange rates

### Managing Portfolio
- **Edit Transactions**: Click edit icon on any transaction
- **Delete Transactions**: Click delete icon to remove
- **View Details**: Click on holdings to see related transactions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **API Integration**: Alpha Vantage API
- **Deployment**: Railway
- **Version Control**: Git + GitHub

## 📊 API Integration

### Alpha Vantage API
- **Stock Search**: Symbol search and company information
- **Real-time Quotes**: Current stock prices
- **Exchange Rates**: Live currency conversion
- **Rate Limiting**: 25 requests/day (free tier)

### Fallback System
- **Static Exchange Rates**: When API limits are reached
- **User Notifications**: Clear warnings about fallback usage
- **Seamless Experience**: App continues working with approximate rates

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── HoldingsTable.tsx
│   ├── TransactionsTable.tsx
│   ├── TransactionModal.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useStockSearch.ts
│   └── useCurrencyConversion.ts
├── services/           # API services
│   ├── alphaVantageApi.ts
│   ├── currencyConversion.ts
│   └── fallbackExchangeRates.ts
├── utils/              # Utility functions
│   ├── currency.ts
│   └── portfolioCalculations.ts
└── types/              # TypeScript interfaces
    └── portfolio.ts
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for financial data API
- [Railway](https://railway.app/) for hosting platform
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

If you have any questions or need help:

1. **Check the Issues**: Look for existing solutions
2. **Create an Issue**: Describe your problem
3. **Contact**: Reach out via GitHub discussions

---

**Happy Trading! 📈🚀**