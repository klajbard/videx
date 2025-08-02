import type { FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { BaseButton } from "./BaseButton";

const variants = {
  primary: "bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-gray-100",
  ghost: "text-gray-600 bg-transparent hover:text-gray-900",
} as const;

export const Button: FC<
  PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }>
> = ({ className, children, variant = "primary", ...props }) => (
  <BaseButton
    className={twMerge("disabled:opacity-50 px-4 py-2 rounded-sm font-medium", variants[variant], className)}
    {...props}
  >
    {children}
  </BaseButton>
);
