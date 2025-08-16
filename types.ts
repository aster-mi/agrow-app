export type RootStackParamList = {
  Login: undefined;
  Shelves: undefined;
  Stocks: undefined;
  StockDetail: { id: number };
  StockForm: { parentId?: number } | undefined;
  ParentSelect: { stockId: number };
};
