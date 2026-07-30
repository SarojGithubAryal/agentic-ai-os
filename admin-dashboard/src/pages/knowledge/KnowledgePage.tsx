import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Trash2,
  Loader2,
  Search,
  Eye,
  Plus,
} from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  getDocument,
  searchKnowledge,
} from '../../lib/api/knowledge'
import type { Document, DocumentChunk, SearchResult } from '../../types/knowledge'
import { cn } from '../../lib/utils'

export default function KnowledgePage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'documents' | 'search'>('documents')
  const [page, setPage] = useState(1)
  const limit = 10
  const offset = (page - 1) * limit

  // Document list
  const { data: docData, isLoading: docLoading, isError: docError } = useQuery({
    queryKey: ['knowledge-documents', page],
    queryFn: () => listDocuments(limit, offset),
    enabled: activeTab === 'documents',
  })

  const documents = docData?.data ?? []
  const totalDocs = docData?.metadata?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] })
      toast.success('Document uploaded and indexed')
      setShowUpload(false)
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Upload failed'
      toast.error(msg)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] })
      toast.success('Document deleted')
      setDeletingDoc(null)
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Delete failed'
      toast.error(msg)
    },
  })

  // Detail state
  const [detailDoc, setDetailDoc] = useState<(Document & { chunks: DocumentChunk[] }) | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Upload dialog
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null)

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadFile) {
      uploadMutation.mutate(uploadFile)
    }
  }

  const handleViewDetail = async (doc: Document) => {
    setDetailLoading(true)
    try {
      const res = await getDocument(doc.id)
      setDetailDoc(res.data)
    } catch {
      toast.error('Failed to load document details')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearchLoading(true)
    setSearchError(null)
    try {
      const res = await searchKnowledge(searchQuery.trim(), 10)
      setSearchResults(res.data)
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Search failed'
      setSearchError(msg)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Knowledge</h2>
          <p className="text-muted-foreground mt-1">Manage documents and semantic search.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('documents')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'documents'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'search'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          )}
        >
          Search
        </button>
      </div>

      {activeTab === 'documents' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {totalDocs} document{totalDocs !== 1 && 's'}
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus size={16} />
              Upload
            </button>
          </div>

          {docLoading && (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading documents...
            </div>
          )}

          {docError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              Failed to load documents.
            </div>
          )}

          {!docLoading && !docError && (
            <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chunks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(doc.size / 1024).toFixed(1)} KB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.chunkCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleViewDetail(doc)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingDoc(doc)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No documents yet. Upload your first file.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-4 py-3">
                  <span className="text-sm text-gray-700">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Dialog */}
          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <form onSubmit={handleUpload} className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                    accept=".pdf,.txt,.md,.csv,.json"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUpload(false)}
                      className="rounded-md border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!uploadFile || uploadMutation.isPending}
                      className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <Dialog open={!!detailDoc} onOpenChange={() => setDetailDoc(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {detailLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              )}
              {detailDoc && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{detailDoc.name}</h3>
                  <div className="text-sm text-gray-600">
                    <p>Size: {(detailDoc.size / 1024).toFixed(1)} KB</p>
                    <p>Chunks: {detailDoc.chunks.length}</p>
                    <p>Uploaded: {new Date(detailDoc.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Chunks</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {detailDoc.chunks.map((chunk, idx) => (
                        <div key={chunk.id} className="rounded border bg-gray-50 p-3 text-xs">
                          <p className="font-mono text-gray-500 mb-1">Chunk {idx + 1}</p>
                          <p className="whitespace-pre-wrap">{chunk.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <Dialog open={!!deletingDoc} onOpenChange={() => setDeletingDoc(null)}>
            <DialogContent>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-700">Delete Document</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete <strong>{deletingDoc?.name}</strong>?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeletingDoc(null)}
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(deletingDoc!.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {activeTab === 'search' && (
        <div>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search across all documents..."
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading || !searchQuery.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {searchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </button>
          </div>

          {searchError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 mb-4">{searchError}</div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.chunkId} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {result.documentName}
                    </span>
                    <span className="text-xs text-gray-400">
                      Similarity: {(result.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{result.content}</p>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !searchLoading && !searchError && (
            <div className="text-center py-12 text-gray-500">
              No results found for "{searchQuery}".
            </div>
          )}
        </div>
      )}
    </div>
  )
}