// screens/IdeaDetailsScreen.tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { getIdea, Idea } from './services/ideas';


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
      <View style={{ flex: 1, margin: 20 }}>
        <Text variant="headlineMedium">{idea?.title}</Text>
        <Text variant='labelLarge' style={{ color: 'green', marginBottom: 10 }}>{idea?.status}</Text>
        <Image source={{uri: idea?.main_picture || undefined }} />
        <Text variant="bodyLarge" style={{marginBottom: 20}}>{idea?.description}</Text>
        <Text variant="bodySmall">Created: {new Date(idea?.created_at || '').toLocaleDateString()}</Text>
        <Text variant="bodySmall">Updated: {new Date(idea?.updated_at || '').toLocaleDateString()}</Text>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: () => loadList() }}>
        {error}
      </Snackbar>
    </>
  );
}
