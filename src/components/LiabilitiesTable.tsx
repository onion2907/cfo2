import React from 'react';
import { Edit2, Trash2, CreditCard, Home, Car, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { Liability } from '../types/portfolio';
import { 
  getLiabilityTypeDisplayName,
  formatLiabilityAmount 
} from '../utils/liabilityCalculations';

interface LiabilitiesTableProps {
  liabilities: Liability[];
  displayCurrency: string;
  onEditLiability: (liability: Liability) => void;
  onDeleteLiability: (id: string) => void;
  onAddLiability: () => void;
}

const getLiabilityIcon = (type: Liability['type']) => {
  switch (type) {
    case 'MORTGAGE':
      return <Home className="h-5 w-5 text-blue-600" />;
    case 'CAR_LOAN':
      return <Car className="h-5 w-5 text-green-600" />;
    case 'STUDENT_LOAN':
      return <GraduationCap className="h-5 w-5 text-purple-600" />;
    case 'CREDIT_CARD':
      return <CreditCard className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-600" />;
  }
};

const LiabilitiesTable: React.FC<LiabilitiesTableProps> = ({
  liabilities,
  displayCurrency,
  onEditLiability,
  onDeleteLiability,
  onAddLiability
}) => {
  const formatAmount = (amount: number) => {
    return formatLiabilityAmount(amount, displayCurrency);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };


  const getRemainingPercentage = (liability: Liability) => {
    return (liability.outstandingBalance / liability.outstandingBalance) * 100;
  };

  if (liabilities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Liabilities Found</h3>
          <p className="text-gray-500 mb-6">
            Start by adding your loans, credit cards, and other liabilities to track your financial position.
          </p>
          <button
            onClick={onAddLiability}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Add First Liability</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Liabilities</h3>
          <button
            onClick={onAddLiability}
            className="btn-primary flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Add Liability</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {liabilities.map((liability) => (
              <tr key={liability.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getLiabilityIcon(liability.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {liability.name}
                      </div>
                      {liability.lenderName && (
                        <div className="text-sm text-gray-500">
                          {liability.lenderName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-900">
                      {getLiabilityTypeDisplayName(liability.type)}
                    </span>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        liability.secured === true 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {liability.secured ? 'SECURED' : 'UNSECURED'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        liability.tenure && liability.tenure.includes('year') && parseInt(liability.tenure) <= 1
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {liability.tenure ? (liability.tenure.includes('year') && parseInt(liability.tenure) <= 1 ? 'Short Term' : 'Long Term') : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatAmount(liability.outstandingBalance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {formatAmount(liability.outstandingBalance)}
                    </span>
                    <div className="flex items-center mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getRemainingPercentage(liability)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {getRemainingPercentage(liability).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPercentage(liability.interestRate || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatAmount(liability.emiAmount || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {liability.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      liability.isActive ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {liability.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditLiability(liability)}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-200"
                      title="Edit liability"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteLiability(liability.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-200"
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
  );
};

export default LiabilitiesTable;
