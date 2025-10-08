// screens/IdeasListScreen.tsx
import { useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, List, Snackbar, Text } from 'react-native-paper';
import { getList, Idea } from './services/ideas';
import { HeaderTitle } from '@react-navigation/elements';


export default function IdeasListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async (opts: { refresh?: boolean } = {}) => {
    if (opts.refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await getList();
      const data = (await res) as Idea[];

      setIdeas(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load ideas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTitle: 'List of your Ideas' });
    loadList();
  }, [loadList, navigation]);

  const renderItem = ({ item }: { item: Idea }) => (
    <List.Item
      title={item.title}
      description={item.description ?? ''}
      onPress={() => router.push({ pathname: '/IdeaDetails', params: { id: item.id } })}
      left={props => <List.Icon {...props} icon="spider-web" />}
    />
  );

  if (loading) {
    return <ActivityIndicator animating size="large" />
  }

  return (
    <>
      <Button style={styles.addIdea} mode="contained" onPress={() => router.push('/AddIdea')}>
        Add Idea
      </Button>
      {ideas.length === 0 ? (
        <View style={styles.center}>
          <Text>No ideas yet.</Text>
        </View>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={item => item.id ?? String(Math.random())}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadList({ refresh: true })} />}
          contentContainerStyle={ideas.length === 0 ? styles.center : undefined}
        />
      )}
      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: () => loadList() }}>
        {error}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addIdea: { margin: 30, marginTop: 10}
});
