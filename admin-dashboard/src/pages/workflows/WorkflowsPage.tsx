import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Play, Loader2, CheckCircle, XCircle, History, RefreshCw } from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import { startWorkflow, getWorkflowRun } from '../../lib/api/workflows'
import type { WorkflowRun } from '../../types/workflow'
import { cn } from '../../lib/utils'

// Static list of registered workflows – ideally we'd fetch this from an endpoint,
// but the backend currently has only 'datetime-and-calc'. You can expand this array later.
const KNOWN_WORKFLOWS = [
  { name: 'datetime-and-calc', description: 'Gets current time and then performs a calculation using the timestamp.' },
]

export default function WorkflowsPage() {
  const queryClient = useQueryClient()
  const [selectedWorkflow, setSelectedWorkflow] = useState<(typeof KNOWN_WORKFLOWS)[0] | null>(null)
  const [currentRun, setCurrentRun] = useState<WorkflowRun | null>(null)
  const [runIdInput, setRunIdInput] = useState('')
  const [showLookup, setShowLookup] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  // Run workflow mutation
  const runMutation = useMutation({
    mutationFn: ({ name, input }: { name: string; input?: Record<string, unknown> }) =>
      startWorkflow(name, input),
    onSuccess: (response) => {
      setCurrentRun(response.data)
      toast.success('Workflow completed')
      queryClient.invalidateQueries({ queryKey: ['memory'] })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Workflow failed'
      toast.error(msg)
    },
  })

  // Lookup run by ID
  const lookupMutation = useMutation({
    mutationFn: (runId: string) => getWorkflowRun(runId),
    onSuccess: (response) => {
      setCurrentRun(response.data)
      setLookupError(null)
      toast.success('Run retrieved')
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error?.message || 'Run not found'
      setLookupError(msg)
    },
  })

  const handleRun = (workflowName: string, input?: Record<string, unknown>) => {
    setCurrentRun(null)
    runMutation.mutate({ name: workflowName, input })
  }

  const handleLookup = () => {
    if (runIdInput.trim()) {
      setLookupError(null)
      lookupMutation.mutate(runIdInput.trim())
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Workflows</h2>
          <p className="text-muted-foreground mt-1">Execute workflows and view results.</p>
        </div>
        <button
          onClick={() => setShowLookup(!showLookup)}
          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          <History size={16} />
          Lookup Run by ID
        </button>
      </div>

      {/* Lookup run ID section */}
      {showLookup && (
        <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Run ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={runIdInput}
              onChange={(e) => setRunIdInput(e.target.value)}
              placeholder="UUID of the run"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleLookup}
              disabled={lookupMutation.isPending || !runIdInput.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {lookupMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Lookup
            </button>
          </div>
          {lookupError && <p className="mt-2 text-sm text-red-600">{lookupError}</p>}
        </div>
      )}

      {/* Workflow cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {KNOWN_WORKFLOWS.map((wf) => (
          <div key={wf.name} className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">{wf.name.replace(/-/g, ' ')}</h3>
              <button
                onClick={() => setSelectedWorkflow(wf)}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
              >
                <Play size={14} />
                Execute
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">{wf.description}</p>
          </div>
        ))}
      </div>

      {/* Execute workflow dialog */}
      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">{selectedWorkflow?.name.replace(/-/g, ' ')}</h3>
            <p className="text-sm text-gray-600">{selectedWorkflow?.description}</p>
            <WorkflowInputForm
              workflowName={selectedWorkflow?.name ?? ''}
              onRun={handleRun}
              isRunning={runMutation.isPending}
            />
            {runMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                Running workflow... (may take a moment)
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Current run result display (also for lookup) */}
      {currentRun && (
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Run Result</h3>
              <p className="text-xs text-gray-500 font-mono">{currentRun.id}</p>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                currentRun.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {currentRun.status === 'completed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
              {currentRun.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <p>Workflow: <span className="font-medium">{currentRun.workflowName}</span></p>
            <p>Started: {new Date(currentRun.startedAt).toLocaleString()}</p>
            <p>Completed: {new Date(currentRun.completedAt).toLocaleString()}</p>
          </div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Steps</h4>
          <div className="space-y-2">
            {currentRun.results.map((step, idx) => (
              <div key={step.stepId} className="rounded bg-gray-50 p-3 border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500">Step {idx + 1}</span>
                  <span className="text-xs text-gray-400">{step.stepId}</span>
                </div>
                <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                  {JSON.stringify(step.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Sub‑component for optional input
function WorkflowInputForm({
  workflowName,
  onRun,
  isRunning,
}: {
  workflowName: string
  onRun: (name: string, input?: Record<string, unknown>) => void
  isRunning: boolean
}) {
  const [inputJson, setInputJson] = useState('{}')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let parsed: Record<string, unknown> | undefined
    try {
      parsed = JSON.parse(inputJson)
    } catch {
      toast.error('Invalid JSON input')
      return
    }
    onRun(workflowName, parsed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Input (JSON)</label>
        <textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          placeholder='{"key": "value"}'
        />
        <p className="mt-1 text-xs text-gray-400">Optional initial context for the workflow. Leave as {"{}"} if none.</p>
      </div>
      <button
        type="submit"
        disabled={isRunning}
        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
        Start Workflow
      </button>
    </form>
  )
}