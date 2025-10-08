// screens/AddIdeaScreen.tsx
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { createIdea } from './services/ideas';


export default function AddIdeaScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addIdea = async function () {
    const res = await createIdea({ title, description });
    if (res) {
      router.push('/IdeasList');
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: true, headerTitle: 'Add new Idea' });
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

      <Button
        mode="contained"
        disabled={title.trim().length == 0}
        onPress={addIdea}>
        Add</Button>
    </View>
  );
}
