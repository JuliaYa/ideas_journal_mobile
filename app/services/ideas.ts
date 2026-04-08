import { Platform } from 'react-native';
import api from './api';


export type Idea = {
  id?: string | null;
  title: string;
  description?: string | null;
  main_picture?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getList(status?: string) {
    const params = status ? { status } : undefined;
    const res = await api.get("/ideas", { params });
    return res.data;
};

export async function getIdea(id: string) {
    const res = await api.get("/ideas/" + id);
    return res.data;
};

function buildFormData(idea: Idea, imageUri: string): FormData {
    const form = new FormData();
    form.append('title', idea.title);
    form.append('description', idea.description ?? '');
    if (idea.status) form.append('status', idea.status);
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
    form.append('main_picture', { uri: imageUri, name: filename, type: mimeType } as any);
    return form;
}

export async function createIdea(idea: Idea, imageUri?: string | null) {
    if (imageUri) {
        const form = buildFormData(idea, imageUri);
        const res = await api.post("/ideas/", form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data;
    }
    const res = await api.post("/ideas/", { title: idea.title, description: idea.description ?? '' });
    return res.data;
};

export async function editIdea(id: string, idea: Idea, imageUri?: string | null) {
    if (imageUri) {
        const form = buildFormData(idea, imageUri);
        const res = await api.put("/ideas/" + id + "/", form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data;
    }
    const body: Record<string, string> = { title: idea.title, description: idea.description ?? '' };
    if (idea.status) body.status = idea.status;
    const res = await api.put("/ideas/" + id + "/", body);
    return res.data;
};

export async function deleteIdea(id: string) {
    const res = await api.delete("/ideas/" + id + "/");
    return res.data;
};
