import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { editIdea, getIdea, Idea } from './services/ideas';
import { colors, radii, shadows, spacing } from './design';

export const STATUS_VALUES = [
  { label: 'New', value: 'new' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
  { label: 'Archived', value: 'archived' },
];

export default function EditIdeaScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useLocalSearchParams<{ id: string }>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveChanges = async function () {
    const res = await editIdea(id, { title, description, status }, imageUri);
    if (res) {
      router.push('/IdeasList');
    }
  };

  const loadIdea = useCallback(async () => {
    setLoading(true);
    try {
      if (!id) throw new Error('Missing idea id');
      const res = await getIdea(id);
      const data = (await res) as Idea;
      setTitle(data.title);
      setDescription(data.description || '');
      setStatus(data.status || 'new');
      setExistingImage(data.main_picture || null);
    } catch (_err) {
      // handled by loading state
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Edit Idea',
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
    loadIdea();
  }, [loadIdea, id, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <TextInput
          mode="outlined"
          placeholder="Type name of your Idea"
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          outlineColor={colors.oatBorder}
          activeOutlineColor={colors.ube800}
        />
        <Dropdown
          label="Status"
          placeholder="Select Status"
          options={STATUS_VALUES}
          value={status}
          onSelect={(value) => setStatus(value || 'new')}
        />
        <TextInput
          mode="outlined"
          multiline={true}
          numberOfLines={5}
          label="Description"
          placeholder="Type some more here"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { marginTop: spacing.md }]}
          outlineColor={colors.oatBorder}
          activeOutlineColor={colors.ube800}
        />

        <Button
          mode="outlined"
          onPress={pickImage}
          style={styles.imageButton}
          labelStyle={{ color: colors.black }}
          icon="image-plus"
        >
          {imageUri || existingImage ? 'Change Image' : 'Add Image'}
        </Button>
        {(imageUri || existingImage) && <Image source={{ uri: imageUri || existingImage! }} style={styles.preview} />}

        <Button
          mode="contained"
          disabled={title.trim().length === 0}
          onPress={saveChanges}
          style={styles.submitButton}
          contentStyle={styles.submitContent}
          labelStyle={styles.submitLabel}
        >
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream,
  },
  content: {
    padding: spacing.md,
  },
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
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.warmCream,
  },
  imageButton: {
    marginBottom: spacing.md,
    borderColor: colors.oatBorder,
    borderRadius: radii.standard,
    borderStyle: 'dashed' as any,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: radii.feature,
    marginBottom: spacing.md,
  },
  submitButton: {
    borderRadius: radii.pill,
  },
  submitContent: {
    paddingVertical: spacing.xs,
  },
  submitLabel: {
    fontWeight: '500',
    fontSize: 16,
  },
});
