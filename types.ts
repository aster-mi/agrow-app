export type RootStackParamList = {
  Login: undefined;
  Shelves: undefined;
  Stocks: undefined;
  Timeline: undefined;
  StockDetail: { id: number };
  StockForm: { parentId?: number } | undefined;
  ParentSelect: { stockId: number };
  ImageDetail: { imageId: string };
};
