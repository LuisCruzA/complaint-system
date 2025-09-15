'use client'
import { ComponentProps } from "react";

type LabelProps = ComponentProps<"label"> & { required?: boolean };

export default function Label({ className = "", children, required, ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-red-600">
          *
        </span>
      )}
    </label>
  );
}
