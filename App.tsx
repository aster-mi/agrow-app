import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as Linking from 'expo-linking';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Shelves from './screens/Shelves';
import Stocks from './screens/Stocks';
import NfcWriter from './screens/NfcWriter';
import NfcHistory from './screens/NfcHistory';
import { RootStackParamList } from './types';
import { addHistory } from './utils/nfcHistory';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['agrow://'],
  config: {
    screens: {
      Login: 'login',
      Shelves: 'shelves',
      Stocks: 'stock/:id',
      NfcWriter: 'writer',
      NfcHistory: 'history',
    },
  },
};

export default function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      if (parsed.path?.startsWith('stock/')) {
        const id = parsed.path.replace('stock/', '');
        addHistory(id);
      }
    };
    Linking.getInitialURL().then((url) => url && handleUrl({ url }));
    const sub = Linking.addEventListener('url', handleUrl);
    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      theme={scheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Shelves" component={Shelves} />
        <Stack.Screen name="Stocks" component={Stocks} />
        <Stack.Screen name="NfcWriter" component={NfcWriter} />
        <Stack.Screen name="NfcHistory" component={NfcHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
