import { api } from "./client.js";

export async function getCanteensRequest() {
  const { data } = await api.get("/api/canteens");
  return data;
}

export async function getCanteenRequest(id) {
  const { data } = await api.get(`/api/canteens/${id}`);
  return data;
}

export async function createCanteenRequest(payload) {
  const { data } = await api.post("/api/canteens", payload);
  return data;
}

export async function updateCanteenRequest(id, payload) {
  const { data } = await api.put(`/api/canteens/${id}`, payload);
  return data;
}

export async function deleteCanteenRequest(id) {
  const { data } = await api.delete(`/api/canteens/${id}`);
  return data;
}