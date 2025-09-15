'use client'
import { Complaint, STATUS } from "@/app/types/complaints"
import Select from "../atoms/select"
import Input from "../atoms/input"
import NotesPanel from "./notesPanel"

export default function ComplaintsRow({
  item,
  onUpdate,
  onAddNote,
  rowIndex,
}: {
  item: Complaint
  onUpdate: (id: string, p: Partial<Pick<Complaint, 'status' | 'dueDate'>>) => Promise<void>
  onAddNote: (id: string, body: string) => Promise<void>
  rowIndex?: number
}) {
  const badgeColor: Record<Complaint['status'], string> = {
    NEW: 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30',
    IN_PROGRESS: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30',
    RESOLVED: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30',
    CLOSED: 'bg-gray-500/20 text-gray-300 ring-1 ring-gray-400/30',
  }

  return (
    <tr className={`${rowIndex! % 2 === 0 ? 'bg-white/0' : 'bg-white/[0.03]'} border-b border-white/10 align-top`}>
      <td className="p-3 align-middle">
        <div className="font-medium text-white">{item.email}</div>
        <div className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
      </td>

      <td className="p-3 text-gray-200">{item.description}</td>

      <td className="p-3">
        <div className={`inline-flex items-center gap-2`}>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${badgeColor[item.status]}`}>
            {item.status}
          </span>
          <Select
            value={item.status}
            onChange={(e) => onUpdate(item.id, { status: e.target.value as Complaint['status'] })}
            className="rounded-lg border-white/20 bg-white/5 text-gray-100"
          >
            {STATUS.map((s) => (
              <option key={s} value={s} className="bg-gray-900 text-gray-100">
                {s}
              </option>
            ))}
          </Select>
        </div>
      </td>

      <td className="p-3">
        <Input
          type="date"
          value={item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : ""}
          onChange={(e) =>
            onUpdate(item.id, {
              dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
            })
          }
          className="rounded-lg border-white/20 bg-white/5 text-gray-100"
        />
      </td>

      <td className="p-3">
        <NotesPanel complaintId={item.id} onAddNote={onAddNote} />
      </td>
    </tr>
  )
}
