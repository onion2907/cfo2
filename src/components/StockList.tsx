import React, { useState } from 'react';
import { Stock } from '../types/portfolio';
import StockCard from './StockCard';
import EditStockModal from './EditStockModal';
import { PlusCircle } from 'lucide-react';

interface StockListProps {
  stocks: Stock[];
  onUpdateStock: (id: string, updatedStock: Partial<Stock>) => void;
  onRemoveStock: (id: string) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, onUpdateStock, onRemoveStock }) => {
  const [editingStock, setEditingStock] = useState<Stock | null>(null);

  const handleEdit = (stock: Stock) => {
    setEditingStock(stock);
  };

  const handleUpdate = (updatedStock: Partial<Stock>) => {
    if (editingStock) {
      onUpdateStock(editingStock.id, updatedStock);
      setEditingStock(null);
    }
  };

  const handleCloseEdit = () => {
    setEditingStock(null);
  };

  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <PlusCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No stocks in your portfolio</h3>
        <p className="text-gray-500 mb-6">Get started by adding your first stock holding.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Holdings</h2>
        <span className="text-sm text-gray-500">{stocks.length} stock{stocks.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <StockCard
            key={stock.id}
            stock={stock}
            onEdit={handleEdit}
            onRemove={onRemoveStock}
          />
        ))}
      </div>

      {editingStock && (
        <EditStockModal
          stock={editingStock}
          isOpen={!!editingStock}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default StockList;
