import React from 'react';
import { TrendingUp, List } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'holdings' | 'transactions';
  onTabChange: (tab: 'holdings' | 'transactions') => void;
  holdingsCount: number;
  transactionsCount: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  holdingsCount,
  transactionsCount
}) => {
  const tabs = [
    {
      id: 'holdings' as const,
      name: 'Holdings',
      icon: TrendingUp,
      count: holdingsCount,
      description: 'Cumulative positions'
    },
    {
      id: 'transactions' as const,
      name: 'Transactions',
      icon: List,
      count: transactionsCount,
      description: 'Buy/Sell history'
    }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon
                className={`
                  -ml-0.5 mr-2 h-5 w-5
                  ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                aria-hidden="true"
              />
              <span>{tab.name}</span>
              <span
                className={`
                  ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                  ${isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-900'
                  }
                `}
              >
                {tab.count}
              </span>
              <span className="ml-2 text-xs text-gray-400 hidden sm:inline">
                {tab.description}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
