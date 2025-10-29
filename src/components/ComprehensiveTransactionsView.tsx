import React from 'react';
import { Transaction, Liability } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';
import { Plus, Edit2, Trash2, TrendingUp, CreditCard } from 'lucide-react';

interface ComprehensiveTransactionsViewProps {
  transactions: Transaction[];
  liabilities: Liability[];
  displayCurrency?: string;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onEditLiability: (liability: Liability) => void;
  onDeleteLiability: (liabilityId: string) => void;
  onAddTransaction: () => void;
  onAddLiability: () => void;
}

const ComprehensiveTransactionsView: React.FC<ComprehensiveTransactionsViewProps> = ({
  transactions,
  liabilities,
  displayCurrency = 'INR',
  onEditTransaction,
  onDeleteTransaction,
  onEditLiability,
  onDeleteLiability,
  onAddTransaction,
  onAddLiability
}) => {
  const formatAmount = (amount: number) => formatCurrency(amount, displayCurrency);

  // Calculate totals
  const totalTransactions = transactions.length;
  const totalLiabilities = liabilities.length;
  const totalStockValue = transactions.reduce((sum, t) => sum + (t.price * t.quantity), 0);
  const totalLiabilityValue = liabilities.reduce((sum, l) => sum + l.outstandingBalance, 0);

  // Group transactions by type
  const buyTransactions = transactions.filter(t => t.type === 'BUY');
  const sellTransactions = transactions.filter(t => t.type === 'SELL');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Stock Transactions</div>
          <div className="text-2xl font-bold text-gray-900">{totalTransactions}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Liabilities</div>
          <div className="text-2xl font-bold text-gray-900">{totalLiabilities}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Stock Value</div>
          <div className="text-2xl font-bold text-gray-900">{formatAmount(totalStockValue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600">Total Liabilities</div>
          <div className="text-2xl font-bold text-red-600">{formatAmount(totalLiabilityValue)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onAddTransaction}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Stock Transaction</span>
        </button>
        <button
          onClick={onAddLiability}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Liability</span>
        </button>
      </div>

      {/* Stock Transactions Section */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stock Transactions</h3>
                  <p className="text-sm text-gray-600">{totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''} • {buyTransactions.length} Buy • {sellTransactions.length} Sell</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{formatAmount(totalStockValue)}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.symbol}</div>
                        <div className="text-sm text-gray-500">{transaction.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'BUY' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(transaction.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(transaction.price * transaction.quantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditTransaction(transaction)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit transaction"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Liabilities Section */}
      {liabilities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Liabilities</h3>
                  <p className="text-sm text-gray-600">{totalLiabilities} liability{totalLiabilities !== 1 ? 'ies' : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-red-600">{formatAmount(totalLiabilityValue)}</div>
                <div className="text-sm text-gray-600">Total Balance</div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {liabilities.map((liability) => (
                  <tr key={liability.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{liability.name}</div>
                        {liability.description && (
                          <div className="text-sm text-gray-500">{liability.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {liability.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        liability.secured === true 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {liability.secured ? 'SECURED' : 'UNSECURED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(liability.outstandingBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(liability.emiAmount || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(liability.interestRate || 0).toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEditLiability(liability)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit liability"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLiability(liability.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete liability"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {transactions.length === 0 && liabilities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No transactions or liabilities added yet</div>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onAddTransaction}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock Transaction</span>
            </button>
            <button
              onClick={onAddLiability}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Liability</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveTransactionsView;
