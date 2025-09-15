'use client'
import { useEffect, useState } from "react"
import Input from "../atoms/input"
import Button from "../atoms/button"

type Note = { id: string; body: string; createdAt: string }

export default function NotesPanel({
  complaintId,
  onAddNote,
}: {
  complaintId: string
  onAddNote: (id: string, body: string) => Promise<void>
}) {
  const [note, setNote] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState<Note[] | null>(null)

  async function loadNotes() {
    const res = await fetch(`/api/complaints/${complaintId}/notes`)
    const json = (await res.json()) as Note[]
    setNotes(json)
  }

  useEffect(() => {
    if (showNotes) void loadNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotes])

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input
          placeholder="Escribe una nota…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-56 rounded-xl border-white/20 bg-white/5 text-gray-100 placeholder-gray-400"
        />
        <Button
          type="button"
          onClick={async () => {
            const body = note.trim()
            if (!body) return
            await onAddNote(complaintId, body)
            setNote("")
            if (showNotes) void loadNotes()
          }}
          className="rounded-xl border-white/20 bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          Add
        </Button>
      </div>

      <button
        className="text-xs text-blue-300 underline underline-offset-4 hover:text-blue-200"
        onClick={() => setShowNotes((s) => !s)}
        type="button"
      >
        {showNotes ? "Hide notes" : "Show notes"}
      </button>

      {showNotes && (
        <ul className="space-y-2 text-xs text-gray-100">
          {notes?.map((n) => (
            <li key={n.id} className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10">
              <div>{n.body}</div>
              <div className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
            </li>
          ))}
          {!notes?.length && <li className="text-gray-400">No notes</li>}
        </ul>
      )}
    </div>
  )
}
