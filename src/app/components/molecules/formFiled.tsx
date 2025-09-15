// components/molecules/FormField.tsx
import { ReactNode } from "react";
import Label from "../atoms/label";
import Input from "../atoms/input";

type BaseProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helper?: ReactNode;
};

type InputFieldProps = BaseProps & {
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  // Para integrarlo con react-hook-form:
  register?: React.InputHTMLAttributes<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormField({
  id, label, required, error, helper, type="text", ...inputProps
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} required={required}>{label}</Label>
      <Input id={id} type={type} hasError={!!error} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
