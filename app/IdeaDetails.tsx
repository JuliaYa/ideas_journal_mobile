import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator, Button, Snackbar, Text } from 'react-native-paper';
import { getIdea, deleteIdea, Idea } from './services/ideas';
import { getNotes, createTextNote, createAudioNote, deleteNote, NoteEntry } from './services/notes';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_COLORS } from './constants';
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
    // TODO: inline editing — for now this is a no-op placeholder
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'Idea Details' });
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable onPress={() => router.push('/IdeasList')}>
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        ),
      });
    }
    loadData();
  }, [loadData, navigation]);

  if (loading) {
    return <ActivityIndicator animating size="large" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Button
          onPress={() => router.push({ pathname: '/EditIdea', params: { id } })}
          style={{ alignSelf: 'flex-end' }}
        >
          Edit
        </Button>
        <Text variant="headlineMedium">{idea?.title}</Text>
        <Text
          variant="labelLarge"
          style={{ color: STATUS_COLORS[idea?.status ?? 'new'] ?? STATUS_COLORS['new'], marginBottom: 10 }}
        >
          {idea?.status}
        </Text>
        {idea?.main_picture && <Image source={{ uri: idea.main_picture }} style={styles.image} />}
        <Text variant="bodyLarge" style={{ marginBottom: 20 }}>
          {idea?.description}
        </Text>
        <Text variant="bodySmall">Created: {new Date(idea?.created_at || '').toLocaleDateString()}</Text>
        <Text variant="bodySmall" style={{ marginBottom: 20 }}>
          Updated: {new Date(idea?.updated_at || '').toLocaleDateString()}
        </Text>
        <Button onPress={deleteItem} style={{ alignSelf: 'flex-end' }}>
          Delete
        </Button>

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
  scrollContent: { padding: 20 },
  image: { width: '100%', height: 250, borderRadius: 8, marginBottom: 10 },
  notesTitle: { marginTop: 16, marginBottom: 8 },
});
