// screens/AddIdeaScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ActivityIndicator, Text, TextInput, Button } from 'react-native-paper';
import { getIdea, editIdea, Idea } from './services/ideas';
import { Ionicons } from '@expo/vector-icons';


export default function EditIdeaScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { id } = useLocalSearchParams<{ id: string }>();

    const saveChanges = async function () {
        // just create new Idea object with updated params
        const res = await editIdea(id, { title, description });
        if (res) {
            router.push('/IdeasList');
        }
    };

    const loadIdea = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!id) throw new Error('Missing idea id');
            const res = await getIdea(id);
            const data = (await res) as Idea;

            console.log(data);
            setTitle(data.title);
            setDescription(data.description || '');
            //setStatus(data.status || 'new');

            setLoading(false);
        } catch (err: any) {
            setError(err.message || 'Failed to load idea');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        navigation.setOptions({ headerShown: true, title: 'Edit the Idea' });
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
        loadIdea();
    }, [loadIdea, id, navigation]);

    if (loading) {
        return <ActivityIndicator animating size="large" />
    }

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
                onPress={saveChanges}>
                Save</Button>
        </View>
    );
}
