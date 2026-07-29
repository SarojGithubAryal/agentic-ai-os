import { BookOpen } from 'lucide-react'

export default function KnowledgePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Knowledge</h2>
      <p className="text-muted-foreground mt-1">Manage knowledge base and documents.</p>
      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <BookOpen size={32} className="text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Coming Soon</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          The Knowledge module is not yet implemented in the backend. Once available, you'll be able to upload documents, manage embeddings, and perform semantic search.
        </p>
      </div>
    </div>
  )
}