export interface MemoryEntry {
  id: string
  userId: string | null
  applicationId: string | null
  namespace: string
  content: string
  metadata: Record<string, unknown> | null
  embedding: string | null
  createdAt: string
  updatedAt: string
}

export interface MemoryListResponse {
  success: boolean
  data: MemoryEntry[]
}

export interface MemorySearchParams {
  query?: string
  namespace?: string
  limit?: number
}