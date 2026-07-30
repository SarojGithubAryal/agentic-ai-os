export interface Document {
  id: string
  name: string
  mimeType: string
  size: number
  chunkCount: number
  createdAt: string
  updatedAt: string
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  embedding: number[] | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface DocumentListResponse {
  success: boolean
  data: Document[]
  metadata: {
    total: number
    limit: number
    offset: number
  }
}

export interface DocumentSingleResponse {
  success: boolean
  data: Document & { chunks: DocumentChunk[] }
}

export interface DocumentUploadResponse {
  success: boolean
  data: Document
}

export interface SearchRequest {
  query: string
  limit?: number
}

export interface SearchResult {
  documentId: string
  documentName: string
  chunkId: string
  content: string
  similarity: number
}

export interface SearchResponse {
  success: boolean
  data: SearchResult[]
}