import api from './api';

export async function getList() {
    const res = await api.get("/ideas");
    return res.data;
};

export async function getIdea(id: string) {
    const res = await api.get("/ideas/" + id);
    return res.data;
};
