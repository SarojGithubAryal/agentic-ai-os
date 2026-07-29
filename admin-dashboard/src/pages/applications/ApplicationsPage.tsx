import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff } from 'lucide-react'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../../lib/api/applications'
import type { Application, ApplicationCreateRequest, ApplicationUpdateRequest } from '../../types/application'

// Validation schemas
const createSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

const updateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

export default function ApplicationsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const limit = 10
  const offset = (page - 1) * limit

  // Fetch applications list
  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', page],
    queryFn: () => listApplications(limit, offset),
  })

  const applications = data?.data ?? []
  const total = data?.metadata?.total // may be undefined if backend doesn't return it
  const hasNextPage = applications.length === limit
  const hasPrevPage = page > 1

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ApplicationCreateRequest) => createApplication(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      setNewApiKey(response.data.apiKey)
    },
    onError: () => {
      toast.error('Failed to create application')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplicationUpdateRequest }) =>
      updateApplication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application updated')
      setEditingApp(null)
    },
    onError: () => {
      toast.error('Failed to update application')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application deleted')
      setDeletingApp(null)
    },
    onError: () => {
      toast.error('Failed to delete application')
    },
  })

  // Form state for create/edit
  const [createOpen, setCreateOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [deletingApp, setDeletingApp] = useState<Application | null>(null)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [keyVisible, setKeyVisible] = useState(false)

  // Forms
  const createForm = useForm<ApplicationCreateRequest>({
    resolver: zodResolver(createSchema),
  })

  const updateForm = useForm<ApplicationUpdateRequest>({
    resolver: zodResolver(updateSchema),
  })

  const handleCreate = (data: ApplicationCreateRequest) => {
    createMutation.mutate(data)
  }

  const handleUpdate = (data: ApplicationUpdateRequest) => {
    if (editingApp) {
      updateMutation.mutate({ id: editingApp.id, data })
    }
  }

  const handleDelete = () => {
    if (deletingApp) {
      deleteMutation.mutate(deletingApp.id)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('API key copied to clipboard')
  }

  const openCreateDialog = () => {
    createForm.reset()
    setCreateOpen(true)
  }

  const openEditDialog = (app: Application) => {
    updateForm.reset({ name: app.name })
    setEditingApp(app)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Applications</h2>
          <p className="text-muted-foreground mt-1">Manage registered applications.</p>
        </div>
        <button
          onClick={openCreateDialog}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Create Application
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex items-center justify-center py-12 text-slate-500">
          Loading applications...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load applications. Please try again later.
        </div>
      )}

      {/* Applications Table */}
      {!isLoading && !error && (
        <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No applications yet. Create your first one!
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditDialog(app)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination – uses hasNextPage / hasPrevPage instead of total */}
          {(hasPrevPage || hasNextPage) && (
            <div className="flex items-center justify-between border-t bg-white px-4 py-3">
              <div className="text-sm text-gray-700">
                Page {page} {total !== undefined ? `of ${Math.ceil(total / limit)}` : ''}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrevPage}
                  className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage}
                  className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Application Dialog */}
      <Dialog open={createOpen && !newApiKey} onOpenChange={setCreateOpen}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create Application</h3>
            <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
              <div>
                <label htmlFor="create-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="create-name"
                  type="text"
                  {...createForm.register('name')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {createForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Show API Key after creation */}
      <Dialog open={!!newApiKey} onOpenChange={() => setNewApiKey(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700">Application Created!</h3>
            <p className="text-sm text-gray-600">
              Copy this API key now. You won't be able to see it again.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-3">
              <input
                type={keyVisible ? 'text' : 'password'}
                readOnly
                value={newApiKey ?? ''}
                className="flex-1 bg-transparent text-sm font-mono outline-none"
              />
              <button onClick={() => setKeyVisible(!keyVisible)} className="text-gray-500 hover:text-gray-700">
                {keyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => copyToClipboard(newApiKey!)} className="text-gray-500 hover:text-gray-700">
                <Copy size={16} />
              </button>
            </div>
            <button
              onClick={() => {
                setNewApiKey(null)
                setCreateOpen(false)
              }}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Done
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={!!editingApp} onOpenChange={() => setEditingApp(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Edit Application</h3>
            <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  {...updateForm.register('name')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {updateForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{updateForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingApp} onOpenChange={() => setDeletingApp(null)}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-red-700">Delete Application</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-medium">{deletingApp?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingApp(null)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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