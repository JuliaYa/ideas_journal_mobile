import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function login(username: string, password: string) {
  const res = await api.post("/token/", { username, password });
  await AsyncStorage.setItem("access", res.data.access);
  await AsyncStorage.setItem("refresh", res.data.refresh);
}

export async function logout() {
  await AsyncStorage.multiRemove(["access", "refresh"]);
}
