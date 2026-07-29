import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/modules/memory/repository/memory.repository.js", () => ({
  insertMemory: vi.fn(),
  findMemories: vi.fn(),
  deleteMemory: vi.fn(),
}));

import { storeMemory, searchMemories, removeMemory } from "../../src/modules/memory/service/memory.service.js";
import { insertMemory, findMemories, deleteMemory } from "../../src/modules/memory/repository/memory.repository.js";

describe("Memory Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("storeMemory", () => {
    it("should insert a memory", async () => {
      const mockMemory = { id: "mem-1", content: "Hello", namespace: "chat" };
      vi.mocked(insertMemory).mockResolvedValue(mockMemory as any);

      const result = await storeMemory({ content: "Hello", namespace: "chat" });
      expect(result).toEqual(mockMemory);
      expect(insertMemory).toHaveBeenCalledWith({ content: "Hello", namespace: "chat" });
    });
  });

  describe("searchMemories", () => {
    it("should find memories by query", async () => {
      const mockResults = [{ id: "mem-1", content: "Hello world" }];
      vi.mocked(findMemories).mockResolvedValue(mockResults as any);

      const results = await searchMemories({ query: "Hello", limit: 5 });
      expect(results).toEqual(mockResults);
      expect(findMemories).toHaveBeenCalledWith({ query: "Hello", limit: 5 });
    });
  });

  describe("removeMemory", () => {
    it("should delete a memory", async () => {
      vi.mocked(deleteMemory).mockResolvedValue(undefined);

      await removeMemory("mem-1");
      expect(deleteMemory).toHaveBeenCalledWith("mem-1");
    });
  });
});