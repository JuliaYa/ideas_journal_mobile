import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from "./hooks/useAuth";
import AddIdeaScreen from './screens/AddIdeaScreen';
import HomeScreen from './screens/HomeScreen';
import IdeasListScreen from './screens/IdeasListScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/AuthScreen';

export type RootStackParamList = {
  Home: undefined;
  IdeasList: undefined;
  AddIdea: undefined;
  Settings: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootLayout() {

  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Home">
          {user ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="IdeasList" component={IdeasListScreen} />
              <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ): (
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          )}
          
        </Stack.Navigator>
      </AuthProvider>
    </PaperProvider>
  );
}
