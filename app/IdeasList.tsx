// screens/IdeasListScreen.tsx
import { useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, List, Snackbar, Text } from 'react-native-paper';
import { getList, Idea } from './services/ideas';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_COLORS } from './constants';

export default function IdeasListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const loadList = useCallback(
    async (opts: { refresh?: boolean } = {}) => {
      if (opts.refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const res = await getList(statusFilter ?? undefined);
        const data = (await res) as Idea[];

        setIdeas(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load ideas');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [statusFilter],
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTitle: 'List of your Ideas' });
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        ),
      });
    }
    loadList();
  }, [loadList, navigation]);

  const renderItem = ({ item }: { item: Idea }) => (
    <View style={[styles.itemRow, { borderLeftColor: STATUS_COLORS[item.status ?? 'new'] ?? STATUS_COLORS['new'] }]}>
      <List.Item
        title={item.title}
        description={item.description ?? ''}
        onPress={() => router.push({ pathname: '/IdeaDetails', params: { id: item.id } })}
        style={styles.listItem}
      />
    </View>
  );

  if (loading) {
    return <ActivityIndicator animating size="large" />;
  }

  const STATUS_FILTERS = ['all', ...Object.keys(STATUS_COLORS)] as const;

  return (
    <>
      <Button style={styles.addIdea} mode="contained" onPress={() => router.push('/AddIdea')}>
        Add Idea
      </Button>
      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((s) => {
          const isActive = s === 'all' ? statusFilter === null : statusFilter === s;
          const color = s === 'all' ? '#7c56a7' : STATUS_COLORS[s];
          return (
            <Chip
              key={s}
              selected={isActive}
              onPress={() => setStatusFilter(s === 'all' ? null : s)}
              style={[styles.chip, isActive && { backgroundColor: color }]}
              textStyle={isActive ? { color: '#fff' } : undefined}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </Chip>
          );
        })}
      </View>
      {ideas.length === 0 ? (
        <View style={styles.center}>
          <Text>No ideas yet.</Text>
        </View>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id ?? String(Math.random())}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadList({ refresh: true })} />}
          contentContainerStyle={ideas.length === 0 ? styles.center : undefined}
        />
      )}
      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'Retry', onPress: () => loadList() }}
      >
        {error}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addIdea: { margin: 30, marginTop: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, marginBottom: 8, gap: 6 },
  chip: { marginBottom: 2 },
  itemRow: { borderLeftWidth: 4, marginVertical: 2, marginHorizontal: 8, borderRadius: 4 },
  listItem: { flex: 1 },
});
