import { api } from "./client";

export const fetchRoadmap = async () => {
  const res = await api.get("/roadmap/");
  return res.data;
};
