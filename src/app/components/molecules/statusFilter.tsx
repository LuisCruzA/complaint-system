import Select from "../atoms/select"
import { STATUS } from "@/app/types/complaints"

export default function StatusFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border-white/20 bg-white/5 px-3 py-2.5 text-gray-100"
    >
      <option value="" className="bg-gray-900 text-gray-100">All statuses</option>
      {STATUS.map((s) => (
        <option key={s} value={s} className="bg-gray-900 text-gray-100">
          {s}
        </option>
      ))}
    </Select>
  )
}
