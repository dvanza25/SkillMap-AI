import { api } from "./client";

export const completeNode = async (nodeId) => {
  const res = await api.post(`/progress/complete/${nodeId}/`);
  return res.data;
};
