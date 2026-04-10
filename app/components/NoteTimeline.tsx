import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Audio } from 'expo-av';
import { NoteEntry } from '../services/notes';
import { colors, radii, shadows, spacing } from '../design';

type Props = {
  notes: NoteEntry[];
  onDelete: (noteId: number) => void;
  onEdit: (note: NoteEntry) => void;
};

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function AudioPlayer({ uri }: { uri: string }) {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const togglePlay = async () => {
    if (playing && sound) {
      await sound.pauseAsync();
      setPlaying(false);
      return;
    }
    if (sound) {
      await sound.playAsync();
      setPlaying(true);
      return;
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setPlaying(false);
      }
    });
    await newSound.playAsync();
    setPlaying(true);
  };

  return (
    <Pressable onPress={togglePlay} style={styles.audioRow}>
      <IconButton icon={playing ? 'pause-circle' : 'play-circle'} size={32} iconColor={colors.ube800} />
      <Text variant="bodyMedium" style={{ color: colors.warmCharcoal }}>
        Audio note
      </Text>
    </Pressable>
  );
}

function NoteItem({ note, onDelete, onEdit }: { note: NoteEntry; onDelete: () => void; onEdit: () => void }) {
  const confirmDelete = () => {
    Alert.alert('Delete note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <Text variant="labelSmall" style={styles.timestamp}>
          {formatTimestamp(note.created_at)}
        </Text>
        <View style={styles.actions}>
          {note.note_type === 'text' && (
            <IconButton icon="pencil" size={16} onPress={onEdit} iconColor={colors.warmSilver} />
          )}
          <IconButton icon="delete" size={16} onPress={confirmDelete} iconColor={colors.warmSilver} />
        </View>
      </View>

      {note.note_type === 'text' && (
        <>
          {note.text && (
            <Text variant="bodyMedium" style={styles.noteText}>
              {note.text}
            </Text>
          )}
          {note.images.length > 0 && (
            <View style={styles.imageRow}>
              {note.images.map((img) => (
                <Image key={img.id} source={{ uri: img.image }} style={styles.thumbnail} />
              ))}
            </View>
          )}
        </>
      )}

      {note.note_type === 'audio' && note.audio_file && <AudioPlayer uri={note.audio_file} />}
    </View>
  );
}

export default function NoteTimeline({ notes, onDelete, onEdit }: Props) {
  if (notes.length === 0) {
    return (
      <Text variant="bodySmall" style={styles.empty}>
        No notes yet
      </Text>
    );
  }

  return (
    <View>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDelete={() => onDelete(note.id)} onEdit={() => onEdit(note)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.oatBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.clay,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: { color: colors.warmSilver },
  actions: { flexDirection: 'row' },
  noteText: {
    marginTop: spacing.xs,
    color: colors.black,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: radii.standard,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  empty: {
    color: colors.warmSilver,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});
