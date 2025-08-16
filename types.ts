export interface Stock {
  id: string;
  name: string;
  image: string;
  tags: string[];
  isPublic: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Shelves: undefined;

  // Deep Link (agrow://stock/:id) 用に id を任意で受け取れるよう統合
  Stocks: { id?: string } | undefined;

  // 新規: { parentId?: number } / 編集: { stock: Stock } の両対応
  StockForm: { parentId?: number; stock?: Stock } | undefined;

  PostDetail: { postId: string };
  Search: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  Timeline: undefined;
  StockDetail: { id: number };
  ParentSelect: { stockId: number };
  ImageDetail: { imageId: string };

  // NFC 画面
  NfcWriter: undefined;
  NfcHistory: undefined;
};
