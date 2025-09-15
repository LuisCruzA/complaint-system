'use client'

import Label from '../atoms/label'
import SearchBar from '../molecules/searchBar'
import StatusFilter from '../molecules/statusFilter'

export default function ComplaintsToolbar({
  q,
  onChangeQ,
  onSearch,
  loading,
  status,
  onChangeStatus,
}: {
  q: string
  onChangeQ: (v: string) => void
  onSearch: () => void
  loading: boolean
  status: string
  onChangeStatus: (v: string) => void
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div className="grid gap-2">
        <Label htmlFor="q" className="text-gray-200">Find</Label>

        <SearchBar q={q} onChange={onChangeQ} onSearch={onSearch} loading={loading} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status" className="text-gray-200">Status</Label>
        <StatusFilter value={status} onChange={onChangeStatus} />
      </div>
    </div>
  )
}
