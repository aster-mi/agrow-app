import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Shelves from './screens/Shelves';
import Stocks from './screens/Stocks';
import ReminderForm from './screens/ReminderForm';
import { schedulePendingNotifications, syncReminders } from './services/reminderService';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const scheme = useColorScheme();
  useEffect(() => {
    schedulePendingNotifications();
    syncReminders();
  }, []);
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Shelves" component={Shelves} />
        <Stack.Screen name="Stocks" component={Stocks} />
        <Stack.Screen name="ReminderForm" component={ReminderForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
