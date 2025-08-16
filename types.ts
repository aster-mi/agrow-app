export type RootStackParamList = {
  Login: undefined;
  Shelves: undefined;
  Stocks: undefined;
  StockForm: { stock?: Stock } | undefined;
};

export interface Stock {
  id: string;
  name: string;
  image: string;
  tags: string[];
  isPublic: boolean;
}
