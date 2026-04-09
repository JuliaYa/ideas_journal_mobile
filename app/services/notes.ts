import { Platform } from 'react-native';
import api from './api';

export type NoteImage = {
  id: number;
  image: string;
  created_at: string;
};

export type NoteEntry = {
  id: number;
  idea: number;
  note_type: 'text' | 'audio';
  text: string | null;
  audio_file: string | null;
  transcription: string | null;
  images: NoteImage[];
  created_at: string;
  updated_at: string;
};

export async function getNotes(ideaId: string): Promise<NoteEntry[]> {
  const res = await api.get(`/ideas/${ideaId}/notes/`);
  return res.data;
}

export async function createTextNote(ideaId: string, text: string, imageUris: string[]): Promise<NoteEntry> {
  if (imageUris.length > 0) {
    const form = new FormData();
    form.append('note_type', 'text');
    form.append('text', text);
    for (const uri of imageUris) {
      const filename = uri.split('/').pop() || 'photo.jpg';
      const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        form.append('images', blob, filename);
      } else {
        form.append('images', { uri, name: filename, type: mimeType } as any);
      }
    }
    const res = await api.post(`/ideas/${ideaId}/notes/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
  const res = await api.post(`/ideas/${ideaId}/notes/`, {
    note_type: 'text',
    text,
  });
  return res.data;
}

export async function createAudioNote(ideaId: string, audioUri: string): Promise<NoteEntry> {
  const form = new FormData();
  form.append('note_type', 'audio');
  const filename = audioUri.split('/').pop() || 'recording.m4a';
  if (Platform.OS === 'web') {
    const response = await fetch(audioUri);
    const blob = await response.blob();
    form.append('audio_file', blob, filename);
  } else {
    form.append('audio_file', {
      uri: audioUri,
      name: filename,
      type: 'audio/m4a',
    } as any);
  }
  const res = await api.post(`/ideas/${ideaId}/notes/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateNote(ideaId: string, noteId: number, text: string): Promise<NoteEntry> {
  const res = await api.put(`/ideas/${ideaId}/notes/${noteId}/`, {
    note_type: 'text',
    text,
  });
  return res.data;
}

export async function deleteNote(ideaId: string, noteId: number): Promise<void> {
  await api.delete(`/ideas/${ideaId}/notes/${noteId}/`);
}
