import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Search, Trash2, Loader2, Database } from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { searchMemories, deleteMemory } from '../../lib/api/memory'
import type { MemoryEntry } from '../../types/memory'

export default function MemoryPage() {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [namespace, setNamespace] = useState('')
  const [limit] = useState(50) // Fixed high limit, no pagination offset
  const [searchInput, setSearchInput] = useState(query)
  const [namespaceInput, setNamespaceInput] = useState(namespace)
  const [deletingMemory, setDeletingMemory] = useState<MemoryEntry | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null)

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['memory', { query, namespace, limit }],
    queryFn: () => searchMemories({ query, namespace, limit }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMemory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory'] })
      toast.success('Memory deleted')
      setDeletingMemory(null)
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Failed to delete memory'
      toast.error(msg)
    },
  })

  const handleSearch = () => {
    setQuery(searchInput.trim())
    setNamespace(namespaceInput.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const memories = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Memory Explorer</h2>
          <p className="text-muted-foreground mt-1">Search and manage stored memories.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Database size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Namespace..."
            value={namespaceInput}
            onChange={(e) => setNamespaceInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isFetching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Search
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading memories...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load memories. Please try again.
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50">
            <p className="text-sm font-medium text-gray-700">
              {memories.length} memory entries
              {memories.length === limit && ' (result limit reached; refine search for more)'}
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {memories.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No memories found. Try adjusting your search or namespace.
              </div>
            ) : (
              memories.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMemory(m)}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {m.namespace || 'default'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 truncate max-w-md">{m.content}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingMemory(m)
                    }}
                    className="text-red-500 hover:text-red-700 ml-2 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Memory Detail</h3>
            <div className="text-sm space-y-2">
              <div><span className="font-medium">ID:</span> {selectedMemory?.id}</div>
              <div><span className="font-medium">Namespace:</span> {selectedMemory?.namespace}</div>
              <div><span className="font-medium">Created:</span> {selectedMemory?.createdAt}</div>
              <div><span className="font-medium">Content:</span></div>
              <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-xs">{selectedMemory?.content}</p>
              {selectedMemory?.metadata && (
                <>
                  <div><span className="font-medium">Metadata:</span></div>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                    {JSON.stringify(selectedMemory.metadata, null, 2)}
                  </pre>
                </>
              )}
              {selectedMemory?.userId && <div><span className="font-medium">User ID:</span> {selectedMemory.userId}</div>}
              {selectedMemory?.applicationId && <div><span className="font-medium">App ID:</span> {selectedMemory.applicationId}</div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMemory} onOpenChange={() => setDeletingMemory(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-700">Delete Memory</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this memory? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingMemory(null)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingMemory!.id)}
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
  )
}