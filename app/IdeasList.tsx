import { useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Chip, Snackbar, Text } from 'react-native-paper';
import { getList, Idea } from './services/ideas';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing, STATUS_COLORS } from './design';

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
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Your Ideas',
      headerStyle: { backgroundColor: colors.warmCream },
      headerShadowVisible: false,
    });
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={24} color={colors.black} style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        ),
      });
    }
    loadList();
  }, [loadList, navigation]);

  const renderItem = ({ item }: { item: Idea }) => {
    const statusColor = STATUS_COLORS[item.status ?? 'new'] ?? STATUS_COLORS['new'];
    return (
      <Pressable onPress={() => router.push({ pathname: '/IdeaDetails', params: { id: item.id } })}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>
          {item.description ? (
            <Text variant="bodyMedium" style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  const STATUS_FILTERS = ['all', ...Object.keys(STATUS_COLORS)] as const;

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => router.push('/AddIdea')}
        style={styles.addButton}
        contentStyle={styles.addButtonContent}
        labelStyle={styles.addButtonLabel}
      >
        Add Idea
      </Button>

      <View style={styles.chipRow}>
        {STATUS_FILTERS.map((s) => {
          const isActive = s === 'all' ? statusFilter === null : statusFilter === s;
          const chipColor = s === 'all' ? colors.warmCharcoal : STATUS_COLORS[s];
          return (
            <Chip
              key={s}
              selected={isActive}
              selectedColor={isActive ? colors.white : undefined}
              onPress={() => setStatusFilter(s === 'all' ? null : s)}
              style={[styles.chip, isActive && { backgroundColor: chipColor, borderColor: chipColor }]}
              textStyle={[styles.chipText, isActive && { color: colors.white }]}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </Chip>
          );
        })}
      </View>

      {ideas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge" style={{ color: colors.warmSilver }}>
            No ideas yet. Start by adding one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={ideas}
          keyExtractor={(item) => item.id ?? String(Math.random())}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadList({ refresh: true })} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{ label: 'Retry', onPress: () => loadList() }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.warmCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.pill,
  },
  addButtonContent: {
    paddingVertical: spacing.xs,
  },
  addButtonLabel: {
    fontWeight: '500',
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: 6,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.oatBorder,
  },
  chipText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.oatBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.clay,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: colors.black,
    fontWeight: '600',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: spacing.sm,
  },
  cardDescription: {
    color: colors.warmCharcoal,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
