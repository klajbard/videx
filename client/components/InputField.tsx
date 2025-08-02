import type { FC, PropsWithChildren } from "react";
import { useId } from "react";
import { Input } from "./Input";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: string | undefined;
}

export const InputField: FC<PropsWithChildren<InputFieldProps>> = ({ label, errors, children, id, ...props }) => {
  const uniqueId = useId();
  const inputId = id || uniqueId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      {label !== undefined && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Input
        id={inputId}
        type="text"
        errors={errors}
        aria-invalid={errors ? "true" : "false"}
        aria-describedby={errors ? errorId : undefined}
        {...props}
      />
      {children}
      {errors && (
        <p id={errorId} className="text-red-600 text-sm mt-1" role="alert">
          {errors}
        </p>
      )}
    </div>
  );
};
