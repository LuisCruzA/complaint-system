import Button from "../atoms/button"

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mt-2 flex items-center gap-3 text-gray-200">
      <Button
        className="rounded-xl border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-50"
        disabled={page <= 1}
        onClick={onPrev}
        type="button"
      >
        Prev
      </Button>
      <span className="text-sm text-gray-300">
        Page {page} / {totalPages}
      </span>
      <Button
        className="rounded-xl border-white/20 bg-white/5 px-3 py-2 hover:bg-white/10 disabled:opacity-50"
        disabled={page >= totalPages}
        onClick={onNext}
        type="button"
      >
        Next
      </Button>
    </div>
  )
}
