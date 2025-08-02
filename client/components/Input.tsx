import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends PropsWithChildren<React.InputHTMLAttributes<HTMLInputElement>> {
  errors?: string | undefined;
}

export const Input: FC<InputProps> = ({ errors, type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={twMerge(
        "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-base leading-6 transition-colors",
        errors ? "border-red-300 focus:ring-red-500" : "border-gray-800",
      )}
      {...props}
    />
  );
};
