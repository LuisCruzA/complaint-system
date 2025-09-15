'use client'
import { forwardRef, InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean };

const Input = forwardRef<HTMLInputElement, Props>(({ hasError, className="", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full rounded-md border px-3 py-2 outline-none ${
        hasError ? "border-red-500" : "border-gray-300"
      } focus:border-black ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";
export default Input;
