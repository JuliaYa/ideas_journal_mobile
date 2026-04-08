// screens/EditIdeaScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { editIdea, getIdea, Idea } from './services/ideas';

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
    const [error, setError] = useState<string | null>(null);

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
        setError(null);

        try {
            if (!id) throw new Error('Missing idea id');
            const res = await getIdea(id);
            const data = (await res) as Idea;

            setTitle(data.title);
            setDescription(data.description || '');
            setStatus(data.status || 'new');
            setExistingImage(data.main_picture || null);

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
                style={{ marginBottom: 10, marginTop: 10, backgroundColor: 'none' }}
            />

            <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
                {imageUri || existingImage ? 'Change Image' : 'Add Image'}
            </Button>
            {(imageUri || existingImage) && (
                <Image source={{ uri: imageUri || existingImage! }} style={styles.preview} />
            )}

            <Button
                mode="contained"
                disabled={title.trim().length == 0}
                onPress={saveChanges}>
                Save</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    imageButton: { marginBottom: 10 },
    preview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
});
