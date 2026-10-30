"use client";

import { AnimatePresence, motion } from "motion/react";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  counter?: string;
  filled?: boolean;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLElement>>;
};

/** Campo con etiqueta flotante, línea animada y mensaje de error accesible. */
export function Field({ id, label, required, error, className = "", counter, filled, children }: FieldProps) {
  const errId = `${id}-err`;
  const child = children;
  const value = (child.props.value as string | undefined) ?? "";
  const isFilled = filled ?? value.length > 0;
  const control = {
    ...child.props,
    id,
    required,
    "aria-invalid": !!error,
    "aria-describedby": error ? errId : undefined,
    className: `peer block w-full bg-transparent pb-3 pt-7 text-[16px] text-navy outline-none disabled:opacity-60 ${child.props.className ?? ""} ${
      child.type === "textarea" ? "resize-y min-h-[140px]" : ""
    }`,
  };
  const Tag = child.type as "input";

  return (
    <div className={`relative ${className}`}>
      <div className="group relative">
        <Tag {...control} />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-0 origin-left text-muted transition-all duration-500 ease-out-expo peer-focus:top-1 peer-focus:scale-[0.78] peer-focus:text-blue ${
            isFilled ? "top-1 scale-[0.78]" : "top-7 scale-100"
          }`}
        >
          {label}
          {required && <span className="text-blue"> *</span>}
        </label>
        {Tag === ("select" as "input") && (
          <svg className="pointer-events-none absolute bottom-4 right-1 size-4 text-navy/50" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span className={`absolute inset-x-0 bottom-0 h-px ${error ? "bg-red-600/50" : "bg-navy/15"}`} />
        <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-blue transition-transform duration-500 ease-out-expo peer-focus:scale-x-100" />
      </div>
      <div className="flex justify-between gap-4">
        <ErrorText id={errId} message={error} />
        {counter && <span className="mt-2 shrink-0 text-[12px] text-muted tabular-nums">{counter}</span>}
      </div>
    </div>
  );
}

export function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 text-[13px] text-red-700"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
