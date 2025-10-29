import React from 'react';
import { Transaction } from '../types/portfolio';
import { formatCurrency } from '../utils/currency';
import { Edit2, Trash2, Plus, Minus } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
  displayCurrency?: string;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
  onAddTransaction?: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  displayCurrency = 'USD',
  onEditTransaction,
  onDeleteTransaction,
  onAddTransaction
}) => {
  const formatAmount = (amount: number, currency: string = displayCurrency) => {
    return formatCurrency(amount, currency);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: 'BUY' | 'SELL') => {
    return type === 'BUY' ? (
      <Plus className="h-4 w-4 text-green-600" />
    ) : (
      <Minus className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionColor = (type: 'BUY' | 'SELL') => {
    return type === 'BUY' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionBgColor = (type: 'BUY' | 'SELL') => {
    return type === 'BUY' ? 'bg-green-50' : 'bg-red-50';
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions</h3>
          <p className="text-gray-500 mb-4">Start by adding your first buy or sell transaction.</p>
          <button
            onClick={onAddTransaction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
        <button
          onClick={onAddTransaction}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                {/* Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionBgColor(transaction.type)} ${getTransactionColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                    <span className="ml-1">{transaction.type}</span>
                  </div>
                </td>

                {/* Symbol */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.symbol}
                </td>

                {/* Name */}
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {transaction.name}
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {transaction.quantity.toLocaleString()}
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatAmount(transaction.price, transaction.currency)}
                </td>

                {/* Total */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {formatAmount(transaction.quantity * transaction.price, transaction.currency)}
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>

                {/* Notes */}
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {transaction.notes || '-'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEditTransaction?.(transaction)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit transaction"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTransaction?.(transaction.id)}
                      className="text-red-600 hover:text-red-900"
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
  );
};

export default TransactionsTable;
