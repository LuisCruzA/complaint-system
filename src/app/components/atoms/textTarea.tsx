import { forwardRef, TextareaHTMLAttributes } from "react"

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`min-h-32 rounded-xl border p-3 outline-none focus:border-blue-400 focus:ring focus:ring-blue-500/30 ${className}`}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"
export default Textarea
