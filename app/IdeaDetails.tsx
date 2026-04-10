import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper';
import { getIdea, deleteIdea, Idea } from './services/ideas';
import { getNotes, createTextNote, createAudioNote, deleteNote, NoteEntry } from './services/notes';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing, STATUS_COLORS } from './design';
import NoteTimeline from './components/NoteTimeline';
import NoteInput from './components/NoteInput';

export default function IdeaDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [idea, setIdea] = useState<Idea>();
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('Missing idea id');
      const [ideaData, notesData] = await Promise.all([getIdea(id), getNotes(id)]);
      setIdea(ideaData as Idea);
      setNotes(notesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const deleteItem = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('Missing idea id');
      await deleteIdea(id);
      router.push('/IdeasList');
    } catch (err: any) {
      setError(err.message || 'Failed to delete idea');
    } finally {
      setLoading(false);
    }
  };

  const handleSendText = async (text: string, imageUris: string[]) => {
    if (!id) return;
    await createTextNote(id, text, imageUris);
    const updated = await getNotes(id);
    setNotes(updated);
  };

  const handleSendAudio = async (audioUri: string) => {
    if (!id) return;
    await createAudioNote(id, audioUri);
    const updated = await getNotes(id);
    setNotes(updated);
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!id) return;
    await deleteNote(id, noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleEditNote = (_note: NoteEntry) => {
    // TODO: inline editing
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Idea Details',
      headerStyle: { backgroundColor: colors.warmCream },
      headerShadowVisible: false,
    });
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable onPress={() => router.push('/IdeasList')}>
            <Ionicons name="arrow-back" size={24} color={colors.black} style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        ),
      });
    }
    loadData();
  }, [loadData, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  const statusColor = STATUS_COLORS[idea?.status ?? 'new'] ?? STATUS_COLORS['new'];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.warmCream }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{idea?.status?.replace('_', ' ')}</Text>
            </View>
            <View style={styles.headerActions}>
              <Button
                mode="outlined"
                onPress={() => router.push({ pathname: '/EditIdea', params: { id } })}
                style={styles.editButton}
                labelStyle={styles.editButtonLabel}
              >
                Edit
              </Button>
              <Button mode="text" onPress={deleteItem} textColor={colors.pomegranate400} compact>
                Delete
              </Button>
            </View>
          </View>

          <Text variant="headlineMedium" style={styles.title}>
            {idea?.title}
          </Text>

          {idea?.main_picture && <Image source={{ uri: idea.main_picture }} style={styles.image} />}

          <Text variant="bodyLarge" style={styles.description}>
            {idea?.description}
          </Text>

          <View style={styles.metaRow}>
            <Text variant="bodySmall" style={styles.metaText}>
              Created: {new Date(idea?.created_at || '').toLocaleDateString()}
            </Text>
            <Text variant="bodySmall" style={styles.metaText}>
              Updated: {new Date(idea?.updated_at || '').toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text variant="titleMedium" style={styles.notesTitle}>
          Notes
        </Text>
        <NoteTimeline notes={notes} onDelete={handleDeleteNote} onEdit={handleEditNote} />
      </ScrollView>

      <NoteInput onSendText={handleSendText} onSendAudio={handleSendAudio} />

      <Snackbar visible={!!error} onDismiss={() => setError(null)} action={{ label: 'Retry', onPress: loadData }}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.warmCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.feature,
    borderWidth: 1,
    borderColor: colors.oatBorder,
    padding: spacing.lg,
    ...shadows.clay,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.badge,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  editButton: {
    borderColor: colors.oatBorder,
    borderRadius: radii.standard,
  },
  editButtonLabel: {
    fontSize: 14,
    color: colors.black,
  },
  title: {
    color: colors.black,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: radii.feature,
    marginBottom: spacing.md,
  },
  description: {
    color: colors.warmCharcoal,
    marginBottom: spacing.md,
    lineHeight: 26,
  },
  metaRow: {
    borderTopWidth: 1,
    borderTopColor: colors.oatLight,
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  metaText: {
    color: colors.warmSilver,
    marginBottom: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notesTitle: {
    color: colors.black,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
});
