export type RootStackParamList = {
  Login: undefined;
  Shelves: undefined;
  Stocks: undefined;
  PostDetail: { postId: string };
  Search: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  Timeline: undefined;
  StockDetail: { id: number };
  StockForm: { parentId?: number } | undefined;
  ParentSelect: { stockId: number };
  ImageDetail: { imageId: string };
};
