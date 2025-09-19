import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthProvider from './context/AuthContext';
import useAuth from "./hooks/useAuth";
import AddIdeaScreen from './screens/AddIdeaScreen';
import LoginScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import IdeasListScreen from './screens/IdeasListScreen';
import LoadingScreen from './screens/LoadingScreen';
import SettingsScreen from './screens/SettingsScreen';
import IdeaDetailsScreen from './screens/IdeaDetailsScreen';
import {RootStackParamList} from './services/rootStack';



const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <Stack.Navigator>
      {loading ? <Stack.Screen name="Loading" component={LoadingScreen} /> : null}
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="IdeasList" component={IdeasListScreen} />
          <Stack.Screen name="IdeaDetails" component={IdeaDetailsScreen} />
          <Stack.Screen name="AddIdea" component={AddIdeaScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function RootLayout() {

  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
