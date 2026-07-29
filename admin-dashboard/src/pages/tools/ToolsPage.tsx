import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Play, Loader2, CheckCircle, XCircle, Info } from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { listTools, executeTool } from '../../lib/api/tools'
import type { ToolInfo, ToolExecuteResponse } from '../../types/tool'


export default function ToolsPage() {
  const queryClient = useQueryClient()
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(null)
  const [executionResult, setExecutionResult] = useState<ToolExecuteResponse['data'] | null>(null)
  const [executionError, setExecutionError] = useState<string | null>(null)

  // Fetch tools list
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tools'],
    queryFn: listTools,
  })

  const tools = data?.data ?? []

  // Execute tool mutation
  const executeMutation = useMutation({
    mutationFn: ({ name, input }: { name: string; input: Record<string, unknown> }) =>
      executeTool(name, input),
    onSuccess: (response) => {
      setExecutionResult(response.data)
      setExecutionError(null)
      toast.success(`${selectedTool?.name} executed successfully`)
      queryClient.invalidateQueries({ queryKey: ['memory'] }) // tool executions create memories
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Execution failed'
      setExecutionError(msg)
      toast.error(msg)
    },
  })

  const handleExecute = (toolName: string, input: Record<string, unknown>) => {
    setExecutionResult(null)
    setExecutionError(null)
    executeMutation.mutate({ name: toolName, input })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Tools</h2>
          <p className="text-muted-foreground mt-1">Available tools and execution interface.</p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading tools...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load tools. Please refresh.
        </div>
      )}

      {/* Tools List */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold capitalize">{tool.name}</h3>
                <button
                  onClick={() => setSelectedTool(tool)}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                >
                  <Play size={14} />
                  Execute
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
            </div>
          ))}
          {tools.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No tools available.
            </div>
          )}
        </div>
      )}

      {/* Execute Tool Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">{selectedTool?.name} Tool</h3>
            <p className="text-sm text-gray-600">{selectedTool?.description}</p>
            <ExecuteForm
              toolName={selectedTool?.name ?? ''}
              onExecute={handleExecute}
              isExecuting={executeMutation.isPending}
            />
            {executionResult && (
              <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium text-green-800">Result</span>
                </div>
                <pre className="text-sm text-green-900 whitespace-pre-wrap">
                  {JSON.stringify(executionResult.result, null, 2)}
                </pre>
                {executionResult.metadata && (
                  <div className="mt-2">
                    <span className="text-xs font-medium text-green-700">Metadata:</span>
                    <pre className="text-xs text-green-800 mt-1">
                      {JSON.stringify(executionResult.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
            {executionError && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={18} className="text-red-600" />
                  <span className="font-medium text-red-800">Error</span>
                </div>
                <p className="text-sm text-red-700">{executionError}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sub‑component for tool‑specific input form
function ExecuteForm({
  toolName,
  onExecute,
  isExecuting,
}: {
  toolName: string
  onExecute: (name: string, input: Record<string, unknown>) => void
  isExecuting: boolean
}) {
  const [expression, setExpression] = useState('2+2')
  const [format, setFormat] = useState('iso')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!toolName) return
    if (toolName === 'calculator') {
      onExecute(toolName, { expression })
    } else if (toolName === 'datetime') {
      onExecute(toolName, { format })
    } else {
      // Generic tool – provide an empty object or a generic input
      onExecute(toolName, {})
    }
  }

  // Show different input fields based on tool name
  if (toolName === 'calculator') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Expression</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={isExecuting || !toolName}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Run
        </button>
      </form>
    )
  }

  if (toolName === 'datetime') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="iso">ISO</option>
            <option value="unix">Unix timestamp</option>
            <option value="readable">Readable</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isExecuting || !toolName}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          Run
        </button>
      </form>
    )
  }

  // Generic fallback
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Info size={16} />
        This tool has no custom input form. Click Run to execute with default parameters.
      </div>
      <button
        type="submit"
        disabled={isExecuting || !toolName}
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        Run
      </button>
    </form>
  )
}