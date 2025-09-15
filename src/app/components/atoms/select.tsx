import { forwardRef, SelectHTMLAttributes } from "react"

type Props = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, Props>(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`rounded-xl border p-2 outline-none focus:border-blue-400 focus:ring focus:ring-blue-500/30 ${className}`}
      {...props}
    />
  )
})
Select.displayName = "Select"
export default Select
