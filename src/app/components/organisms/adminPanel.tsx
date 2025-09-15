'use client'
import { useRouter } from "next/navigation"

import { useEffect, useMemo, useState } from 'react'

import { ComplaintsFooterx, ComplaintsTablex, ComplaintsToolBarx } from "../index"
import Button from "../atoms/button"
import type { Complaint, ListRes } from '@/app/types/complaints'

const pageSize = 10


export default function AdminPanel() {
    const router = useRouter()

  const [data, setData] = useState<ListRes | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string>('') 
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPages = useMemo(
    () => (data ? Math.ceil(data.total / pageSize) : 1),
    [data]
  )

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const usp = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })
      if (status) usp.set('status', status)
      if (q) usp.set('q', q)
      const res = await fetch(`/api/complaints?${usp.toString()}`)
      if (!res.ok) throw new Error('Error cargando lista')
      const json = (await res.json()) as ListRes
      setData(json)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status])

  async function update(id: string, patch: Partial<Pick<Complaint, 'status' | 'dueDate'>>) {
    const res = await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      console.error(await res.text())
      return
    }
    void load()
  }

  async function addNote(id: string, body: string) {
    const res = await fetch(`/api/complaints/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    })
    if (!res.ok) console.error(await res.text())
  }

return (
    
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <section className="w-full max-w-6xl rounded-2xl bg-white/5 p-8 shadow-lg ring-1 ring-white/10 backdrop-blur-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">Panel de gestión</h2>
        <Button
  type="button"
  onClick={() => router.push("/")}
  className="mb-6 rounded-xl bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
>
  back to complaint panel
</Button>
        <ComplaintsToolBarx
          q={q}
          onChangeQ={(v) => setQ(v)}
          onSearch={() => {
            setPage(1)
            void load()
          }}
          loading={loading}
          status={status}
          onChangeStatus={(v) => {
            setPage(1)
            setStatus(v)
          }}
        />
  
        <ComplaintsTablex
          items={data?.items}
          loading={loading}
          onUpdate={update}
          onAddNote={addNote}
        />
  
        <ComplaintsFooterx
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
          loading={loading}
          error={error}
        />
      </section>
    </main>
  )
  
}
