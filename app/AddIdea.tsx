// screens/AddIdeaScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { createIdea } from './services/ideas';


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
    navigation.setOptions({ headerShown: true, headerTitle: 'Add new Idea' });
    if (!navigation.canGoBack()) {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            onPress={() => router.push('/IdeasList')}
          >
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15, marginRight: 15 }} />
          </Pressable>
        )
      });
    }
  }, [navigation]);

  return (
    <View style={{ flex: 1, margin: 20 }}>
      <TextInput
        mode="outlined"
        placeholder="Type name of your Idea"
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 10, backgroundColor: 'none' }}
      />
      <TextInput
        mode="outlined"
        multiline={true}
        numberOfLines={5}
        label="Description"
        placeholder="Type some more here"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 10, backgroundColor: 'none' }}
      />

      <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
        {imageUri ? 'Change Image' : 'Add Image'}
      </Button>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <Button
        mode="contained"
        disabled={title.trim().length == 0}
        onPress={addIdea}>
        Add</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  imageButton: { marginBottom: 10 },
  preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
});
