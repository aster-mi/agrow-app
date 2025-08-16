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

  // Deep Link (agrow://stock/:id) を考慮して id を任意に
  Stocks: { id?: string } | undefined;

  // リマインダー作成
  ReminderForm: undefined;

  // プロフィール（userId 任意指定可能）
  Profile: { userId?: string } | undefined;

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

  // NFC
  NfcWriter: undefined;
  NfcHistory: undefined;
};
