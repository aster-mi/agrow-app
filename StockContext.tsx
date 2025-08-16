import React, { createContext, useContext, useState } from 'react';

export type Stock = {
  id: number;
  name: string;
  parent_id: number | null;
};

type StockContextType = {
  stocks: Stock[];
  addStock: (name: string, parent_id: number | null) => void;
  setParent: (id: number, parent_id: number | null) => void;
};

const StockContext = createContext<StockContextType>({
  stocks: [],
  addStock: () => {},
  setParent: () => {},
});

let nextId = 1;

export function StockProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);

  const addStock = (name: string, parent_id: number | null) => {
    setStocks(prev => [...prev, { id: nextId++, name, parent_id }]);
  };

  const setParent = (id: number, parent_id: number | null) => {
    setStocks(prev => prev.map(s => (s.id === id ? { ...s, parent_id } : s)));
  };

  return (
    <StockContext.Provider value={{ stocks, addStock, setParent }}>
      {children}
    </StockContext.Provider>
  );
}

export const useStocks = () => useContext(StockContext);
