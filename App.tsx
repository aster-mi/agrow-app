import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import Shelves from './screens/Shelves';
import Stocks from './screens/Stocks';
import Search from './screens/Search';
import Notifications from './screens/Notifications';
import NotificationSettings from './screens/NotificationSettings';
import Timeline from './screens/Timeline';
import StockDetail from './screens/StockDetail';
import StockForm from './screens/StockForm';
import ParentSelect from './screens/ParentSelect';
import ImageDetail from './screens/ImageDetail';

import { RootStackParamList } from './types';
import { StockProvider } from './StockContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const scheme = useColorScheme();

  return (
    <StockProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Shelves" component={Shelves} />
          <Stack.Screen name="Stocks" component={Stocks} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
          <Stack.Screen name="Timeline" component={Timeline} />
          <Stack.Screen name="StockDetail" component={StockDetail} />
          <Stack.Screen name="StockForm" component={StockForm} />
          <Stack.Screen name="ParentSelect" component={ParentSelect} />
          <Stack.Screen name="ImageDetail" component={ImageDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </StockProvider>
  );
}
