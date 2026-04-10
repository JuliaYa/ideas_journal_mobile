import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { colors, radii, spacing } from './design';
import useAuth from './hooks/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      await login(username, password);
    } catch (_e) {
      Alert.alert('Error', 'Incorrect login or password');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          Ideas Journal
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign in to continue
        </Text>

        <TextInput
          mode="outlined"
          label="Login"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          outlineColor={colors.oatBorder}
          activeOutlineColor={colors.ube800}
        />
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          outlineColor={colors.oatBorder}
          activeOutlineColor={colors.ube800}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          disabled={!username.trim() || !password.trim()}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.feature,
    borderWidth: 1,
    borderColor: colors.oatBorder,
    padding: spacing.xl,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 2,
    },
  },
  title: {
    color: colors.black,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.warmSilver,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.warmCream,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: radii.pill,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    fontWeight: '500',
    fontSize: 16,
  },
});
