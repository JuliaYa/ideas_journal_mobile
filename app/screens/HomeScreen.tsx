// screens/HomeScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/rootStack';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        What do you want to do?
      </Text>

      <View style={styles.buttons}>
        <Button
          mode="contained"
          icon="format-list-text"
          onPress={() => navigation.navigate('IdeasList')}
        >
          View the List
        </Button>
        <Button
          mode="contained"
          icon="grease-pencil"
          onPress={() => navigation.navigate('AddIdea')}
        >
          Add New Idea
        </Button>
      </View>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Settings')}
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
