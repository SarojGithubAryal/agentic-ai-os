import { insertMemory, findMemories, deleteMemory } from "../repository/memory.repository.js";

export const storeMemory = async (data: {
  content: string;
  namespace?: string;
  userId?: string;
  applicationId?: string;
  metadata?: Record<string, unknown>;
}) => {
  return insertMemory(data);
};

export const searchMemories = async (filters: {
  query?: string;
  namespace?: string;
  userId?: string;
  applicationId?: string;
  limit?: number;
}) => {
  return findMemories(filters);
};

export const removeMemory = async (id: string) => {
  await deleteMemory(id);
};