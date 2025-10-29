# Stock Portfolio Tracker

A modern, responsive web application for tracking your stock holdings and portfolio performance. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Portfolio Overview**: View total portfolio value, gains/losses, and day changes
- 📈 **Stock Management**: Add, edit, and remove individual stock holdings
- 💰 **Real-time Calculations**: Automatic calculation of portfolio metrics and individual stock performance
- 💾 **Data Persistence**: Your portfolio data is saved locally in your browser
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with beautiful animations and transitions

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd /Users/ajinkyaganoje/cfo2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding Stocks

1. Click the "Add Stock" button in the header
2. Fill in the required information:
   - Stock Symbol (e.g., AAPL)
   - Company Name (e.g., Apple Inc.)
   - Number of Shares
   - Purchase Price per Share
   - Current Price per Share
   - Purchase Date
3. Click "Add Stock" to save

### Managing Your Portfolio

- **View Portfolio Summary**: See total value, gains/losses, and day changes at the top
- **Edit Stocks**: Click the edit icon on any stock card to modify details
- **Remove Stocks**: Click the trash icon to remove a stock from your portfolio
- **Track Performance**: Each stock card shows current value, cost basis, and gain/loss

### Data Storage

Your portfolio data is automatically saved to your browser's local storage, so it persists between sessions. No data is sent to external servers.

## Technology Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful icon library

## Project Structure

```
src/
├── components/
│   ├── AddStockModal.tsx    # Modal for adding new stocks
│   ├── EditStockModal.tsx   # Modal for editing existing stocks
│   ├── PortfolioSummary.tsx # Portfolio overview cards
│   ├── StockCard.tsx        # Individual stock display card
│   └── StockList.tsx        # List of all stocks
├── types/
│   └── portfolio.ts         # TypeScript type definitions
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and Tailwind imports
```

## Future Enhancements

- Real-time stock price updates via API integration
- Historical performance charts
- Portfolio diversification analysis
- Export/import functionality
- Multiple portfolio support
- Watchlist feature
- Dividend tracking

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
