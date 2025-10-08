import { Stack } from 'expo-router';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AuthProvider from './context/AuthContext';
import IdeasAppTheme from './customTheme';
import useAuth from "./hooks/useAuth";


function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {loading ? <Stack.Screen name="Loading" options={{ headerShown: false }} /> : null}
      {user ? (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="IdeasList" />
          <Stack.Screen name="IdeaDetails" />
          <Stack.Screen name="AddIdea" />
          <Stack.Screen name="EditIdea" />
          <Stack.Screen name="Settings" />
        </>
      ) : (
        <Stack.Screen name="Login" />
      )}
    </Stack>
  );
}

export default function RootLayout() {

  return (
    <PaperProvider theme={IdeasAppTheme}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
