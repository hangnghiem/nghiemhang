"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl ${className}`}>{children}</div>
  );
}

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-lg shadow-sky-500/20",
  secondary:
    "bg-white/10 hover:bg-white/15 text-white border border-white/10",
  ghost: "hover:bg-white/10 text-white/80",
  success:
    "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold",
  danger: "bg-rose-500/90 hover:bg-rose-500 text-white font-semibold",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  max,
  className = "",
  tone = "sky",
}: {
  value: number;
  max: number;
  className?: string;
  tone?: "sky" | "emerald" | "amber" | "violet";
}) {
  const pct = max <= 0 ? 100 : Math.min(100, Math.round((value / max) * 100));
  const tones: Record<string, string> = {
    sky: "bg-sky-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
  };
  return (
    <div className={`h-2 w-full rounded-full bg-white/10 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${tones[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SectionTitle({
  icon,
  children,
  right,
}: {
  icon?: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h3 className="text-sm font-semibold tracking-wide text-white/90 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </h3>
      {right}
    </div>
  );
}

export function Pill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${className}`}
    >
      {children}
    </span>
  );
}
