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

  // Deep Link (agrow://stock/:id) で id を受け取れるよう任意化
  Stocks: { id?: string } | undefined;

  // 編集 or 新規追加の両方に対応
  // - 新規: { parentId?: number }
  // - 編集: { stock: Stock }
  StockForm: { parentId?: number; stock?: Stock } | undefined;

  PostDetail: { postId: string };
  Search: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  Timeline: undefined;
  StockDetail: { id: number };
  ParentSelect: { stockId: number };
  ImageDetail: { imageId: string };

  // NFC
  NfcWriter: undefined;
  NfcHistory: undefined;
};
