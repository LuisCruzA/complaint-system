'use client'

import Pagination from '../molecules/pagination'

export default function ComplaintsFooter({
  page,
  totalPages,
  onPrev,
  onNext,
  loading,
  error,
}: {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  loading: boolean
  error: string | null
}) {
  return (
    <div className="mt-6">
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />
      {loading && <p className="mt-3 text-sm text-gray-300">Cargando…</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}
    </div>
  )
}
