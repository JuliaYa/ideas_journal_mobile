import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { colors, radii, spacing } from '../design';

type Props = {
  onSendText: (text: string, imageUris: string[]) => Promise<void>;
  onSendAudio: (audioUri: string) => Promise<void>;
};

export default function NoteInput({ onSendText, onSendAudio }: Props) {
  const [mode, setMode] = useState<'text' | 'audio'>('text');
  const [text, setText] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sending, setSending] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendText = async () => {
    if (!text.trim() && imageUris.length === 0) return;
    setSending(true);
    try {
      await onSendText(text, imageUris);
      setText('');
      setImageUris([]);
    } finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const { recording: rec } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(rec);
  };

  const stopAndSend = async () => {
    if (!recording) return;
    setSending(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) await onSendAudio(uri);
    } finally {
      setSending(false);
      setMode('text');
    }
  };

  const discardRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    setMode('text');
  };

  if (mode === 'audio') {
    return (
      <View style={styles.container}>
        <View style={styles.audioBar}>
          <IconButton icon="close" onPress={discardRecording} disabled={sending} iconColor={colors.warmCharcoal} />
          {recording ? (
            <IconButton
              icon="stop-circle"
              iconColor={colors.pomegranate400}
              size={36}
              onPress={stopAndSend}
              disabled={sending}
            />
          ) : (
            <IconButton icon="record-circle" iconColor={colors.pomegranate400} size={36} onPress={startRecording} />
          )}
          {recording && <IconButton icon="send" onPress={stopAndSend} disabled={sending} iconColor={colors.ube800} />}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imageUris.length > 0 && (
        <View style={styles.previewRow}>
          {imageUris.map((uri, i) => (
            <View key={i} style={styles.previewWrap}>
              <Image source={{ uri }} style={styles.previewImage} />
              <IconButton
                icon="close-circle"
                size={16}
                style={styles.removeBtn}
                onPress={() => removeImage(i)}
                iconColor={colors.warmCharcoal}
              />
            </View>
          ))}
        </View>
      )}
      <View style={styles.inputRow}>
        <IconButton icon="image-plus" onPress={pickImage} disabled={sending} iconColor={colors.warmCharcoal} />
        <TextInput
          mode="outlined"
          placeholder="Add a note..."
          value={text}
          onChangeText={setText}
          style={styles.textInput}
          outlineColor={colors.oatBorder}
          activeOutlineColor={colors.ube800}
          dense
        />
        <IconButton
          icon="microphone"
          onPress={() => setMode('audio')}
          disabled={sending}
          iconColor={colors.warmCharcoal}
        />
        <IconButton
          icon="send"
          onPress={handleSendText}
          disabled={sending || (!text.trim() && imageUris.length === 0)}
          iconColor={colors.ube800}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.oatBorder,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.warmCream,
  },
  previewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingTop: 6,
  },
  previewWrap: { position: 'relative' },
  previewImage: {
    width: 56,
    height: 56,
    borderRadius: radii.standard,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  audioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
