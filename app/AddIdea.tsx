// screens/AddIdeaScreen.tsx
import React, { useState } from 'react';
import { router, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { createIdea } from './services/ideas';


export default function AddIdeaScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addIdea = async function () {
    const res = await createIdea({title, description});
    if (res) {
      router.push('/IdeasList');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Add New Idea</Text>
      <TextInput
              mode="outlined"
              placeholder="Type name of your Idea"
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={{ marginBottom: 10 }}
            />
      <TextInput
              mode="outlined"
              multiline={true}
              numberOfLines={5}
              label="Description"
              placeholder="Type some more here"
              value={description}
              onChangeText={setDescription}
              style={{ marginBottom: 10 }}
            />

      <Button 
            mode="contained"
            disabled={title.trim().length == 0 }
            onPress={addIdea}>
        Add</Button>
    </View>
  );
}
