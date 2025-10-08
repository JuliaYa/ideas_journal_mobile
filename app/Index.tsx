// screens/HomeScreen.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';


export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        What do you want to do?
      </Text>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          icon="format-list-text"
          onPress={() => router.push('/IdeasList')}
        >
          Dive into Ideas
        </Button>
        <Button
          mode="contained"
          icon="grease-pencil"
          onPress={() => router.push('/AddIdea')}
        >
          I have Idea
        </Button>
      </View>

      <Button
        mode="text"
        onPress={() => router.push('/Settings')}
        style={styles.settingsButton}
      >
        Go to Settings
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },

  settingsButton: {
    position: 'absolute',
    bottom: 20,
  },
});
