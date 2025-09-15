'use client'
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export default function Button({ loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className="inline-flex items-center justify-center rounded-md px-4 py-2 font-medium border border-gray-900 disabled:opacity-60"
      {...props}
    >
      {loading ? "Loading" : children}
    </button>
  );
}
