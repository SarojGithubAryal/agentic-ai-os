import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Activity, CheckCircle2, XCircle } from 'lucide-react'
import { getProvidersHealth } from '../../lib/api/providers'
import { cn } from '../../lib/utils'

export default function ProvidersPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['providers-health'],
    queryFn: getProvidersHealth,
  })

  const providers = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Providers</h2>
          <p className="mt-1 text-muted-foreground">
            Current status of configured AI providers.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-md bg-linear-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-medium text-white shadow transition hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50"
        >
          <RefreshCw size={16} className={cn(isFetching && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 flex items-center justify-center py-12 text-slate-500">
          Loading providers...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Failed to load provider status. Please try refreshing.
        </div>
      )}

      {/* Providers table */}
      {!isLoading && !isError && (
        <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b bg-gray-50 px-6 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Activity size={16} className="text-indigo-500" />
              Provider Status
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {providers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No providers configured.
              </div>
            ) : (
              providers.map((p) => (
                <div
                  key={p.provider}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full',
                        p.status === 'ok'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      )}
                    >
                      {p.status === 'ok' ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {p.provider}
                      </p>
                      <p className="text-xs text-gray-500">{p.message}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      p.status === 'ok'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {p.status === 'ok' ? 'Healthy' : 'Unhealthy'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}