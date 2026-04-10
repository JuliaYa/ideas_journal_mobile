import { Stack, useRouter, useSegments } from 'expo-router';
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AuthProvider from './context/AuthContext';
import IdeasAppTheme from './customTheme';
import useAuth from './hooks/useAuth';
import { colors } from './design';

function HomeButton() {
  const router = useRouter();
  const segments = useSegments();
  const isHome = segments.length === 0 || segments[0] === 'index';

  if (isHome) return null;

  return (
    <Pressable onPress={() => router.push('/')} style={{ marginRight: 15 }}>
      <Ionicons name="home-outline" size={22} color={colors.black} />
    </Pressable>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.warmCream },
        headerShadowVisible: false,
        headerRight: () => <HomeButton />,
      }}
    >
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
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.oatLight,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.warmCream,
  },
});
