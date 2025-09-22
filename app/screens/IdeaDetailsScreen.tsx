// screens/IdeaDetailsScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text, Snackbar} from 'react-native-paper';
import { getIdea } from '../services/ideas';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/rootStack';
import { RouteProp } from '@react-navigation/native';

// todo: move common tipes to one place
type Idea = {
  id: string;
  title: string;
  description?: string | null;
};

type Props = {
  route: RouteProp<RootStackParamList, 'IdeaDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'IdeaDetails'>;
};

export default function IdeaDetailsScreen({route}: Props) {
  const [idea, setIdea] = useState<Idea>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = route.params;

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
  }, [loadList]);


  if (loading) {
    return <ActivityIndicator animating size="large" />
  }

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="headlineMedium">{idea?.title}</Text>
        <Text variant="bodyMedium">{idea?.description}</Text>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: () => loadList() }}>
        {error}
      </Snackbar>
    </>
  );
}
