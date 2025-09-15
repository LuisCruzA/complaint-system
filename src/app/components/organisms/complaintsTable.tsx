import { Complaint } from "@/app/types/complaints"
import ComplaintsRow from "../molecules/complaintsRow"

export default function ComplaintsTable({
  items,
  loading,
  onUpdate,
  onAddNote,
}: {
  items: Complaint[] | undefined
  loading: boolean
  onUpdate: (id: string, p: Partial<Pick<Complaint, 'status' | 'dueDate'>>) => Promise<void>
  onAddNote: (id: string, body: string) => Promise<void>
}) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
      <table className="w-full text-sm text-gray-100">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-left">
            <th className="p-3 font-semibold">Email</th>
            <th className="p-3 font-semibold">Description</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Due date</th>
            <th className="p-3 font-semibold">Notas</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, i) => (
            <ComplaintsRow key={item.id} item={item} onUpdate={onUpdate} onAddNote={onAddNote} rowIndex={i} />
          ))}

          {(!items || items.length === 0) && !loading && (
            <tr>
              <td colSpan={5} className="p-5 text-center text-gray-400">
              No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
