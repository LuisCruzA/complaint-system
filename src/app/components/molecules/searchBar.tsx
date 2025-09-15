import Input from "../atoms/input"
import Button from "../atoms/button"

export default function SearchBar({
  q, onChange, onSearch, loading,
}: {
  q: string
  onChange: (v: string) => void
  onSearch: () => void
  loading?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Search email or text…"
        value={q}
        onChange={(e) => onChange(e.target.value)}
        className="w-72 rounded-xl border-white/20 bg-white/5 px-4 py-2.5 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring focus:ring-blue-500/30"
      />
      <Button
        className="rounded-xl bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        onClick={onSearch}
        loading={loading}
        type="button"
      >
        Search
      </Button>
    </div>
  )
}
