import api from './api';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  }
};

export type Idea = {
  id?: string | null;
  title: string;
  description?: string | null;
  main_picture?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export async function getList() {
    const res = await api.get("/ideas");
    return res.data;
};

export async function getIdea(id: string) {
    const res = await api.get("/ideas/" + id);
    return res.data;
};

export async function createIdea(idea: Idea) {
    const res = await api.post("/ideas/create/", idea, config);
    return res.data;
};
