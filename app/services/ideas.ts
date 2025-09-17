import api from './api';

export async function getList() {
    const res = await api.get("/ideas");
    return res.data;
}