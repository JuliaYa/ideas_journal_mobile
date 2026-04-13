import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing } from './design';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        What do you want to do?
      </Text>

      <View style={styles.buttons}>
        <Pressable style={styles.bigButtonPrimary} onPress={() => router.push('/AddIdea')}>
          <Ionicons name="bulb-outline" size={28} color={colors.white} />
          <Text variant="titleMedium" style={styles.bigButtonPrimaryText}>
            I have an Idea
          </Text>
        </Pressable>

        <Pressable style={styles.bigButton} onPress={() => router.push('/IdeasList')}>
          <Ionicons name="list-outline" size={28} color={colors.ube800} />
          <Text variant="titleMedium" style={styles.bigButtonText}>
            Dive into Ideas
          </Text>
        </Pressable>

        <Pressable style={styles.settingsButton} onPress={() => router.push('/Settings')}>
          <Ionicons name="settings-outline" size={24} color={colors.warmCharcoal} />
          <Text variant="bodyLarge" style={styles.settingsText}>
            Settings
          </Text>
        </Pressable>
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
  title: {
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttons: {
    gap: spacing.md,
  },
  bigButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.ube800,
    borderRadius: radii.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.clay,
  },
  bigButtonPrimaryText: {
    color: colors.white,
    fontWeight: '600',
  },
  bigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.oatBorder,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.clay,
  },
  bigButtonText: {
    color: colors.black,
    fontWeight: '600',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  settingsText: {
    color: colors.warmCharcoal,
  },
});
