export type RootStackParamList = {
  Login: undefined;
  App: undefined;
  ItemDetail: { id: string; scanned?: boolean };
};

export type MainTabParamList = {
  Search: { q?: string };
  ScanTab: undefined;
  Settings: undefined;
};
