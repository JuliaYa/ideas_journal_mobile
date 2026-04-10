import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { createIdea } from './services/ideas';
import { colors, radii, shadows, spacing } from './design';

export default function AddIdeaScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  const addIdea = async function () {
    const res = await createIdea({ title, description }, imageUri);
    if (res) {
      router.push('/IdeasList');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Add new Idea',
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
  }, [navigation]);

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
        <TextInput
          mode="outlined"
          multiline={true}
          numberOfLines={5}
          label="Description"
          placeholder="Type some more here"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
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
          {imageUri ? 'Change Image' : 'Add Image'}
        </Button>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        <Button
          mode="contained"
          disabled={title.trim().length === 0}
          onPress={addIdea}
          style={styles.submitButton}
          contentStyle={styles.submitContent}
          labelStyle={styles.submitLabel}
        >
          Add Idea
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
