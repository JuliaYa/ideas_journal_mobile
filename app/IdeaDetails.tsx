// screens/IdeaDetailsScreen.tsx
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper';
import { getIdea, deleteIdea, Idea } from './services/ideas';
import { Ionicons } from '@expo/vector-icons';


export default function IdeaDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [idea, setIdea] = useState<Idea>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  const deleteItem = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('Missing idea id');
      const res = await deleteIdea(id);
      router.push("/IdeasList");
    } catch (err: any) {
      setError(err.message || 'Failed to delete idea');
    } finally {
      setLoading(false);
    }
  };

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
    navigation.setOptions({ headerShown: true, title: 'Idea Details' });
    if (!navigation.canGoBack()) {

      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/IdeasList')}
          >
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        )
      })

    }
    loadList();
  }, [loadList, id, navigation]);


  if (loading) {
    return <ActivityIndicator animating size="large" />
  }

  return (
    <>
      <View style={{ flex: 1, margin: 20 }}>
        <Button onPress={() => { router.push({ pathname: '/EditIdea', params: { id: id } }) }} style={{ alignSelf: 'flex-end' }}>Edit</Button>
        <Text variant="headlineMedium">{idea?.title}</Text>
        <Text variant='labelLarge' style={{ color: 'green', marginBottom: 10 }}>{idea?.status}</Text>
        <Image source={{ uri: idea?.main_picture || undefined }} />
        <Text variant="bodyLarge" style={{ marginBottom: 20 }}>{idea?.description}</Text>
        <Text variant="bodySmall">Created: {new Date(idea?.created_at || '').toLocaleDateString()}</Text>
        <Text variant="bodySmall">Updated: {new Date(idea?.updated_at || '').toLocaleDateString()}</Text>
        <Button onPress={deleteItem} style={{ alignSelf: 'flex-end' }}>Delete</Button>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: () => loadList() }}>
        {error}
      </Snackbar>
    </>
  );
}
