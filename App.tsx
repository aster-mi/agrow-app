import "react-native-reanimated";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import * as Linking from "expo-linking";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Shelves from "./screens/Shelves";
import Stocks from "./screens/Stocks";
import Profile from "./screens/Profile";
import PostDetail from "./screens/PostDetail";
import Search from "./screens/Search";
import Notifications from "./screens/Notifications";
import NotificationSettings from "./screens/NotificationSettings";
import Timeline from "./screens/Timeline";
import StockDetail from "./screens/StockDetail";
import StockForm from "./screens/StockForm";
import ParentSelect from "./screens/ParentSelect";
import ImageDetail from "./screens/ImageDetail";
import NfcWriter from "./screens/NfcWriter";
import NfcHistory from "./screens/NfcHistory";
import ReminderForm from "./screens/ReminderForm";

import { RootStackParamList } from "./types";
import { StockProvider } from "./StockContext";
import { initSyncService } from "./syncService";
import { addHistory } from "./utils/nfcHistory";
import {
  schedulePendingNotifications,
  syncReminders,
} from "./services/reminderService";

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ["agrow://"],
  config: {
    screens: {
      Login: "login",
      Shelves: "shelves",
      // 例: agrow://stock/123
      Stocks: "stock/:id",
      NfcWriter: "writer",
      NfcHistory: "history",
      // 必要に応じて他画面もここへ追加
    },
  },
};

export default function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    // 同期サービス初期化
    initSyncService();

    // 期限の近い通知のスケジューリング＆リモート同期
    schedulePendingNotifications();
    syncReminders();

    // Deep Linkで stock/:id が来たら履歴追加
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      if (parsed.path?.startsWith("stock/")) {
        const id = parsed.path.replace("stock/", "");
        if (id) addHistory(id);
      }
    };

    // cold start 時のURL処理
    Linking.getInitialURL().then(
      (url: string | null) => url && handleUrl({ url })
    );
    // フォアグラウンドでのURL処理
    const sub = Linking.addEventListener("url", handleUrl);
    return () => sub.remove();
  }, []);

  return (
    <StockProvider>
      <NavigationContainer
        linking={linking}
        theme={scheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Shelves" component={Shelves} />
          <Stack.Screen name="Stocks" component={Stocks} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettings}
          />
          <Stack.Screen name="Timeline" component={Timeline} />
          <Stack.Screen name="StockDetail" component={StockDetail} />
          <Stack.Screen name="StockForm" component={StockForm} />
          <Stack.Screen name="ParentSelect" component={ParentSelect} />
          <Stack.Screen name="ImageDetail" component={ImageDetail} />
          <Stack.Screen name="NfcWriter" component={NfcWriter} />
          <Stack.Screen name="NfcHistory" component={NfcHistory} />
          <Stack.Screen name="ReminderForm" component={ReminderForm} />
        </Stack.Navigator>
      </NavigationContainer>
    </StockProvider>
  );
}
