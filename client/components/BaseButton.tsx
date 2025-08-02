import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const BaseButton: FC<PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({
  children,
  className,
  type = "button",
  ...rest
}) => (
  <button
    className={twMerge(
      "cursor-pointer disabled:cursor-not-allowed px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors",
      className,
    )}
    type={type}
    {...rest}
  >
    {children}
  </button>
);
