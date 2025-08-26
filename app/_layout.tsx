import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AddIdeaScreen from './screens/AddIdeaScreen';
import HomeScreen from './screens/HomeScreen';
import IdeasListScreen from './screens/IdeasListScreen';
import SettingsScreen from './screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  IdeasList: undefined;
  AddIdea: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="IdeasList" component={IdeasListScreen} />
        <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </PaperProvider>
  );
}
