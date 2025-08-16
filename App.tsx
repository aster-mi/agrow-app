import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Shelves from './screens/Shelves';
import Stocks from './screens/Stocks';
import { RootStackParamList } from './types';
import { useEffect } from 'react';
import { initSyncService } from './syncService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const scheme = useColorScheme();
  useEffect(() => {
    initSyncService();
  }, []);
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Shelves" component={Shelves} />
        <Stack.Screen name="Stocks" component={Stocks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
