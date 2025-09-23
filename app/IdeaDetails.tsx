// screens/IdeaDetailsScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { getIdea } from './services/ideas';

// todo: move common tipes to one place
type Idea = {
  id: string;
  title: string;
  description?: string | null;
  main_picture?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function IdeaDetailsScreen() {
  const [idea, setIdea] = useState<Idea>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('Missing idea id');
      const res = await getIdea(id);
      const data = (await res) as Idea;

      setIdea(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList, id]);


  if (loading) {
    return <ActivityIndicator animating size="large" />
  }

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">{idea?.title}</Text>
        <Text variant='bodyLarge'>Status: {idea?.status}</Text>
        <Image source={{uri: idea?.main_picture || undefined }} />
        <Text variant="bodyMedium">{idea?.description}</Text>
        <Text variant="bodySmall">Created at: {new Date(idea?.created_at || '').toLocaleDateString()}</Text>
        <Text variant="bodySmall">Updated at: {new Date(idea?.updated_at || '').toLocaleDateString()}</Text>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: () => loadList() }}>
        {error}
      </Snackbar>
    </>
  );
}
